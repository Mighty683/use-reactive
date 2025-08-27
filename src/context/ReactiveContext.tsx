import {
  createContext,
  memo,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { ContextEventBus } from "./bus";

export function createReactiveContext<T>() {
  const internalContext = createContext<ContextEventBus<T> | null>(null);
  const Provider = memo(
    ({ value, children }: PropsWithChildren<{ value: T }>) => {
      const [bus] = useState(() => new ContextEventBus<T>(value));
      return (
        <internalContext.Provider value={bus}>
          {children}
        </internalContext.Provider>
      );
    },
  );

  const useReactiveContext = () => {};

  return {
    Provider,
  };
}
