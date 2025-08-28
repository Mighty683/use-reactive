import { useReactive } from "./useReactive";
import { testHook } from "../tests/testHook";
import { act, memo, useEffect } from "react";
import { render } from "@testing-library/react";

describe("useReactive", () => {
  describe("functional tests", () => {
    it("should cause re-render on value change", () => {
      const renderSpy = vi.fn();
      const result = testHook(() => {
        const result = useReactive({ count: 1 });
        useEffect(() => {
          renderSpy();
        }, [result.count]);
        return result;
      });
      expect(result.hookResult.count).toBe(1);
      act(() => {
        result.hookResult.count = 2;
      });
      expect(result.hookResult.count).toBe(2);
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
    it("should re-render on destructed object value change", () => {
      const renderSpy = vi.fn();
      const TestComponent = ({ value }: { value: { count: number } }) => {
        const proxyValue = useReactive(value);
        const { count } = proxyValue;
        useEffect(() => {
          renderSpy();
        }, [count]);
        return <span>{count}</span>;
      };
      const TestComponentWrapper = () => {
        const { changedValue } = useReactive({
          changedValue: {
            count: 1,
          },
          notChangedValue: { count: 1 },
        });
        useEffect(() => {
          changedValue.count = changedValue.count + 1;
        }, []);
        return (
          <div>
            <TestComponent value={changedValue} />
          </div>
        );
      };
      render(<TestComponentWrapper />);
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    it("should not re-render on object value change without read in component", () => {
      const renderSpy = vi.fn();
      const TestComponent = memo(({ value }: { value: { count: number } }) => {
        const reactiveValue = useReactive(value);
        useEffect(() => {
          renderSpy();
        }, []);
        return <span>{reactiveValue.count}</span>;
      });
      const TestComponentWrapper = () => {
        const { changedValue, notChangedValue } = useReactive({
          changedValue: {
            count: 1,
          },
          notChangedValue: { count: 1 },
        });
        useEffect(() => {
          changedValue.count = changedValue.count + 1;
        }, []);
        return (
          <div>
            <TestComponent value={notChangedValue} />
          </div>
        );
      };
      render(<TestComponentWrapper />);
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });
});
