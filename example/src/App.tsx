import { memo, useEffect } from "react";

import { createReactiveContext } from "../../src/context/ReactiveContext";

const { Provider, useReactiveContext } = createReactiveContext<{
  text: string;
  changingText: string;
}>();

const StableChild = memo(() => {
  const state = useReactiveContext();
  useEffect(() => {
    console.count("StableChild rendered");
  });
  return <div>{state.text}</div>;
});

const UnstableChild = memo(() => {
  const state = useReactiveContext();
  useEffect(() => {
    console.count("UnstableChild rendered");
  });
  return <div>Watch me change: {state.changingText}</div>;
});

const ChangingParent = memo(() => {
  const state = useReactiveContext();
  useEffect(() => {
    console.count("ChangingParent rendered");
  });
  return (
    <div>
      <StableChild />
      <UnstableChild />
      <input
        onChange={(e) => {
          state.changingText = e.target.value;
        }}
        value={state.changingText}
      />
    </div>
  );
});

function App() {
  return (
    <Provider
      value={{
        text: "Hello World",
        changingText: "Change me!",
      }}
    >
      <ChangingParent />
    </Provider>
  );
}

export default App;
