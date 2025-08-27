import { useMemo, useState } from "react";

export class Observable<T> {
  constructor(value: T) {
    this.value = value;
  }
  value: T;
}

export default function useReactive<T>(value: T): Observable<T> {
  const [valueState, setValueState] = useState(value);
  return useMemo(() => {
    const observable = new Observable(valueState);
    const _proxy: Observable<T> = new Proxy(observable, {
      set(object, prop, newValue, receiver) {
        if (prop === "value" && receiver === _proxy) {
          object[prop] = newValue;
          setValueState(newValue);
          return true;
        } else {
          return false;
        }
      },
    });
    return _proxy;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
