# use-reactive

[![NPM](https://img.shields.io/npm/v/use-reactive.svg)](https://www.npmjs.com/package/use-reactive) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> React Reactive Hook

Goal is to provide simple in use reactive system for React

## Install

```bash
npm install --save use-reactive
```

## Usage

```tsx
import React from 'react'
import useReactive from 'use-reactive'

export default function App () {
  const counter = useReactive(1)

  return (
    <div>
      <button
        onClick={
          () => counter.value = counter.value + 1
        }
      >
        {counter.value}
      </button>
    </div>
  )
```

## ToDo

- Nested Objects Support
- Class components support

## License

MIT © [Mighty683](https://github.com/Mighty683)
