import { useEffect } from "react";
import { createReactiveContext } from "./ReactiveContext";
import { render } from "@testing-library/react";

describe("ReactiveContext", () => {
  const { Provider, useReactiveContext } = createReactiveContext<{
    count: number;
  }>();

  it("should provide value to children", () => {
    const effectSpy = vi.fn();
    const TestComponent = () => {
      const { count } = useReactiveContext();
      useEffect(() => {
        effectSpy(count);
      }, [count]);
      return <span>{count}</span>;
    };
    const renderer = render(
      <Provider
        value={{
          count: 1,
        }}
      >
        <TestComponent />
      </Provider>,
    );
    expect(effectSpy).toHaveBeenCalledWith(1);
    expect(renderer.container.innerHTML).toBe("<span>1</span>");
  });
  it("should update value in children", () => {
    const effectSpy = vi.fn();
    const TestComponent = () => {
      const { count } = useReactiveContext();
      useEffect(() => {
        effectSpy(count);
      }, [count]);
      return <span>{count}</span>;
    };
    const TestTriggerComponent = () => {
      const value = useReactiveContext();
      useEffect(() => {
        value.count = 2;
      }, []);
      return null;
    };
    const value = { count: 1 };

    const renderer = render(
      <Provider value={value}>
        <TestTriggerComponent />
        <TestComponent />
      </Provider>,
    );
    expect(effectSpy).toHaveBeenCalledTimes(2);
    expect(renderer.container.innerHTML).toBe("<span>2</span>");
  });
});
