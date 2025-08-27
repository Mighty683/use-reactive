import { useEffect, useRef, useState } from "react";

class InternalProxy<T extends object> {
  public usedProperties = new Set<string | symbol>();
  public proxy: T;
  constructor(target: T, handler: ProxyHandler<T>) {
    this.proxy = new Proxy<T>(target, handler);
  }
}

function buildProxyCopy<V>(value: V, onSet: () => void): V {
  if (value && typeof value === "object" && value !== null) {
    const { proxy, usedProperties } = new InternalProxy(value, {
      get(object, prop, receiver) {
        if (receiver === proxy) {
          usedProperties.add(prop);
          return Reflect.get(object, prop, receiver);
        } else {
          return undefined;
        }
      },
      set(object, prop, newValue, receiver) {
        if (receiver === proxy) {
          const result = Reflect.set(object, prop, newValue);
          if (result && usedProperties.has(prop)) {
            onSet();
          }
          return result;
        } else {
          return false;
        }
      },
    });
    for (const path of Object.keys(value)) {
      const property = value[path as keyof typeof value];
      if (typeof property === "object" && property !== null) {
        Object.defineProperty(value, path, {
          value: buildProxyCopy<typeof property>(property, onSet),
        });
      }
    }
    return proxy;
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
  const [valueState, setValue] = useState(
    buildProxyCopy<T>(value, () => {
      if (isMountedRef.current) {
        setValue((v) => {
          return { ...v };
        });
      }
    }),
  );
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return valueState;
}
