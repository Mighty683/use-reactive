import { useReactive } from "./useReactive";
import { testHook } from "../tests/testHook";
import { act, memo, useEffect } from "react";
import { render } from "@testing-library/react";

describe("useReactive", () => {
  describe("functional tests", () => {
    it("should render hook", () => {
      const result = testHook(() => useReactive(1));
      expect(result.hookResult).toBe(1);
    });
    it.skip("should cause re-render on value change", () => {
      const renderSpy = vi.fn();
      const result = testHook(() => {
        const result = useReactive({ count: 1 });
        useEffect(() => {
          renderSpy();
        }, [result]);
        return result;
      });
      expect(result.hookResult.count).toBe(1);
      act(() => {
        result.hookResult.count = 2;
      });
      expect(result.hookResult.count).toBe(2);
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
    it("should work with destructured value", () => {
      const result = testHook(() => {
        let { count } = useReactive({ count: 1 });
        useEffect(() => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          count = count + 3;
        }, [count]);
        return { count };
      });
      expect(result.hookResult.count).toBe(1);
    });
    it("should re-render on object value change", () => {
      const renderSpy = vi.fn();
      const TestComponent = ({ value }: { value: { count: number } }) => {
        const reactiveValue = useReactive(value);
        useEffect(() => {
          renderSpy();
        }, []);
        return <span>{reactiveValue.count}</span>;
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
