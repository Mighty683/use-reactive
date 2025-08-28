import { useEffect, useRef, useState } from "react";

const isProxy = Symbol("isProxy");
const listeners = Symbol("listeners");

function isInternalProxy<V>(value: V): value is V & {
  [isProxy]: true;
  [listeners]: Map<string | symbol, Set<() => void>>;
} {
  return (
    value !== null &&
    typeof value === "object" &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    value[isProxy] === true
  );
}

function buildProxyCopy<V>(value: V, onValueChange: () => void): V {
  if (isInternalProxy(value)) {
    const proxy = new Proxy(value, {
      get(object, prop, receiver) {
        if (prop === listeners) {
          return object[listeners];
        }
        if (prop === isProxy) {
          return true;
        }
        if (receiver === proxy) {
          const propListeners = object[listeners].get(prop);
          if (propListeners) {
            propListeners.add(onValueChange);
          } else {
            object[listeners].set(prop, new Set([onValueChange]));
          }
        }
        return Reflect.get(object, prop, receiver);
      },
    });
    return proxy;
  }
  if (value && typeof value === "object" && value !== null) {
    const listenersMap = new Map<string | symbol, Set<() => void>>();
    const proxy = new Proxy(value, {
      get(object, prop, receiver) {
        if (prop === listeners) {
          return listenersMap;
        }
        if (prop === isProxy) {
          return true;
        }
        if (receiver === proxy) {
          if (!listenersMap.has(prop)) {
            listenersMap.set(prop, new Set());
          }
          listenersMap.get(prop)?.add(onValueChange);
        }
        return Reflect.get(object, prop, receiver);
      },
      set(object, prop, newValue, receiver) {
        const result = Reflect.set(object, prop, newValue, receiver);
        if (result && listenersMap.has(prop)) {
          onValueChange?.();
          listenersMap.get(prop)?.forEach((l) => l());
        }
        return result;
      },
    });
    for (const path of Object.keys(value)) {
      const property = value[path as keyof typeof value];
      if (typeof property === "object" && property !== null) {
        Object.defineProperty(value, path, {
          value: buildProxyCopy<typeof property>(property, onValueChange),
        });
      }
    }
    return proxy as V;
  }
  return value;
}

/**
 * Hook which allows usage of reactive state in React.
 * It allows to set directly properties of objects and arrays,
 * and the component will re-render when those properties change.
 * if a primitive value is used, it will ignore it.
 * Destructuring of the returned value is supported, but
 * reactivity will be lost for the destructured properties.
 * It will work as read-only.
 */
export function useReactive<T extends object>(value: T): T {
  const [, setRerenderTrigger] = useState(0);
  const [valueState] = useState(() => {
    const onValueChange = () => {
      if (isMountedRef.current) {
        setRerenderTrigger((v) => Math.min(v + 1, Number.MAX_SAFE_INTEGER));
      }
    };

    return buildProxyCopy<T>(value, onValueChange);
  });
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return valueState;
}
