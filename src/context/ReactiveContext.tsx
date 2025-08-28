import { createContext, memo, useContext, type PropsWithChildren } from "react";
import { useReactive } from "../hooks/useReactive";

export function createReactiveContext<T extends object>() {
  const internalContext = createContext<T | null>(null);
  const Provider = memo(
    ({ value, children }: PropsWithChildren<{ value: T }>) => {
      const reactiveValue = useReactive(value);
      return (
        <internalContext.Provider value={reactiveValue}>
          {children}
        </internalContext.Provider>
      );
    },
  );

  const useReactiveContext = () => {
    const value = useContext(internalContext);
    if (value === null) {
      throw new Error(
        "useReactiveContext must be used within a Provider with a value",
      );
    }
    const reactiveValue = useReactive(value);

    return reactiveValue;
  };

  return {
    Provider,
    useReactiveContext,
  };
}
