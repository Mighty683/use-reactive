import { render } from "@testing-library/react";

export function testHook<
  H extends (...args: unknown[]) => R,
  R = ReturnType<H>,
>(hook: H) {
  let hookResult: R;
  const TestComponent = ({ callback }: { callback: H }) => {
    const result = callback();
    hookResult = result;
    return null;
  };
  const renderResult = render(<TestComponent callback={hook} />);
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    hookResult,
    renderResult,
  };
}
