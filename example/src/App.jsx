import React from 'react'
import useReactive from 'use-reactive'

export default function App () {
  const counter = useReactive(1)

  return (
    <div
      style={{
        display:  'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }}
    >
      <code>
        {'counter.value = counter.value + 1'}
      </code>
      Hi I am reactive click to increment
      <button onClick={() => counter.value = counter.value + 1}>{counter.value}</button>
    </div>
  )
}
