# react-context-consumer-hoc v2.x

> React context consumer hoc. A 2KB lib that consumes context as props.

[![NPM](https://img.shields.io/npm/v/react-context-consumer-hoc.svg)](https://www.npmjs.com/package/react-context-consumer-hoc) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Build Status](https://travis-ci.org/pgarciacamou/react-context-consumer-hoc.svg?branch=master)](https://travis-ci.org/pgarciacamou/react-context-consumer-hoc) [![Package Quality](http://npm.packagequality.com/shield/react-context-consumer-hoc.svg)](http://packagequality.com/#?package=react-context-consumer-hoc) [![Renovate](https://img.shields.io/badge/renovate-enabled-green?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNjkgMzY5Ij48Y2lyY2xlIGN4PSIxODkuOSIgY3k9IjE5MC4yIiByPSIxODQuNSIgZmlsbD0iI2ZmZTQyZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTUgLTYpIi8+PHBhdGggZmlsbD0iIzhiYjViNSIgZD0iTTI1MSAyNTZsLTM4LTM4YTE3IDE3IDAgMDEwLTI0bDU2LTU2YzItMiAyLTYgMC03bC0yMC0yMWE1IDUgMCAwMC03IDBsLTEzIDEyLTktOCAxMy0xM2ExNyAxNyAwIDAxMjQgMGwyMSAyMWM3IDcgNyAxNyAwIDI0bC01NiA1N2E1IDUgMCAwMDAgN2wzOCAzOHoiLz48cGF0aCBmaWxsPSIjZDk1NjEyIiBkPSJNMzAwIDI4OGwtOCA4Yy00IDQtMTEgNC0xNiAwbC00Ni00NmMtNS01LTUtMTIgMC0xNmw4LThjNC00IDExLTQgMTUgMGw0NyA0N2M0IDQgNCAxMSAwIDE1eiIvPjxwYXRoIGZpbGw9IiMyNGJmYmUiIGQ9Ik04MSAxODVsMTgtMTggMTggMTgtMTggMTh6Ii8+PHBhdGggZmlsbD0iIzI1YzRjMyIgZD0iTTIyMCAxMDBsMjMgMjNjNCA0IDQgMTEgMCAxNkwxNDIgMjQwYy00IDQtMTEgNC0xNSAwbC0yNC0yNGMtNC00LTQtMTEgMC0xNWwxMDEtMTAxYzUtNSAxMi01IDE2IDB6Ii8+PHBhdGggZmlsbD0iIzFkZGVkZCIgZD0iTTk5IDE2N2wxOC0xOCAxOCAxOC0xOCAxOHoiLz48cGF0aCBmaWxsPSIjMDBhZmIzIiBkPSJNMjMwIDExMGwxMyAxM2M0IDQgNCAxMSAwIDE2TDE0MiAyNDBjLTQgNC0xMSA0LTE1IDBsLTEzLTEzYzQgNCAxMSA0IDE1IDBsMTAxLTEwMWM1LTUgNS0xMSAwLTE2eiIvPjxwYXRoIGZpbGw9IiMyNGJmYmUiIGQ9Ik0xMTYgMTQ5bDE4LTE4IDE4IDE4LTE4IDE4eiIvPjxwYXRoIGZpbGw9IiMxZGRlZGQiIGQ9Ik0xMzQgMTMxbDE4LTE4IDE4IDE4LTE4IDE4eiIvPjxwYXRoIGZpbGw9IiMxYmNmY2UiIGQ9Ik0xNTIgMTEzbDE4LTE4IDE4IDE4LTE4IDE4eiIvPjxwYXRoIGZpbGw9IiMyNGJmYmUiIGQ9Ik0xNzAgOTVsMTgtMTggMTggMTgtMTggMTh6Ii8+PHBhdGggZmlsbD0iIzFiY2ZjZSIgZD0iTTYzIDE2N2wxOC0xOCAxOCAxOC0xOCAxOHpNOTggMTMxbDE4LTE4IDE4IDE4LTE4IDE4eiIvPjxwYXRoIGZpbGw9IiMzNGVkZWIiIGQ9Ik0xMzQgOTVsMTgtMTggMTggMTgtMTggMTh6Ii8+PHBhdGggZmlsbD0iIzFiY2ZjZSIgZD0iTTE1MyA3OGwxOC0xOCAxOCAxOC0xOCAxOHoiLz48cGF0aCBmaWxsPSIjMzRlZGViIiBkPSJNODAgMTEzbDE4LTE3IDE4IDE3LTE4IDE4ek0xMzUgNjBsMTgtMTggMTggMTgtMTggMTh6Ii8+PHBhdGggZmlsbD0iIzk4ZWRlYiIgZD0iTTI3IDEzMWwxOC0xOCAxOCAxOC0xOCAxOHoiLz48cGF0aCBmaWxsPSIjYjUzZTAyIiBkPSJNMjg1IDI1OGw3IDdjNCA0IDQgMTEgMCAxNWwtOCA4Yy00IDQtMTEgNC0xNiAwbC02LTdjNCA1IDExIDUgMTUgMGw4LTdjNC01IDQtMTIgMC0xNnoiLz48cGF0aCBmaWxsPSIjOThlZGViIiBkPSJNODEgNzhsMTgtMTggMTggMTgtMTggMTh6Ii8+PHBhdGggZmlsbD0iIzAwYTNhMiIgZD0iTTIzNSAxMTVsOCA4YzQgNCA0IDExIDAgMTZMMTQyIDI0MGMtNCA0LTExIDQtMTUgMGwtOS05YzUgNSAxMiA1IDE2IDBsMTAxLTEwMWM0LTQgNC0xMSAwLTE1eiIvPjxwYXRoIGZpbGw9IiMzOWQ5ZDgiIGQ9Ik0yMjggMTA4bC04LThjLTQtNS0xMS01LTE2IDBMMTAzIDIwMWMtNCA0LTQgMTEgMCAxNWw4IDhjLTQtNC00LTExIDAtMTVsMTAxLTEwMWM1LTQgMTItNCAxNiAweiIvPjxwYXRoIGZpbGw9IiNhMzM5MDQiIGQ9Ik0yOTEgMjY0bDggOGM0IDQgNCAxMSAwIDE2bC04IDdjLTQgNS0xMSA1LTE1IDBsLTktOGM1IDUgMTIgNSAxNiAwbDgtOGM0LTQgNC0xMSAwLTE1eiIvPjxwYXRoIGZpbGw9IiNlYjZlMmQiIGQ9Ik0yNjAgMjMzbC00LTRjLTYtNi0xNy02LTIzIDAtNyA3LTcgMTcgMCAyNGw0IDRjLTQtNS00LTExIDAtMTZsOC04YzQtNCAxMS00IDE1IDB6Ii8+PHBhdGggZmlsbD0iIzEzYWNiZCIgZD0iTTEzNCAyNDhjLTQgMC04LTItMTEtNWwtMjMtMjNhMTYgMTYgMCAwMTAtMjNMMjAxIDk2YTE2IDE2IDAgMDEyMiAwbDI0IDI0YzYgNiA2IDE2IDAgMjJMMTQ2IDI0M2MtMyAzLTcgNS0xMiA1em03OC0xNDdsLTQgMi0xMDEgMTAxYTYgNiAwIDAwMCA5bDIzIDIzYTYgNiAwIDAwOSAwbDEwMS0xMDFhNiA2IDAgMDAwLTlsLTI0LTIzLTQtMnoiLz48cGF0aCBmaWxsPSIjYmY0NDA0IiBkPSJNMjg0IDMwNGMtNCAwLTgtMS0xMS00bC00Ny00N2MtNi02LTYtMTYgMC0yMmw4LThjNi02IDE2LTYgMjIgMGw0NyA0NmM2IDcgNiAxNyAwIDIzbC04IDhjLTMgMy03IDQtMTEgNHptLTM5LTc2Yy0xIDAtMyAwLTQgMmwtOCA3Yy0yIDMtMiA3IDAgOWw0NyA0N2E2IDYgMCAwMDkgMGw3LThjMy0yIDMtNiAwLTlsLTQ2LTQ2Yy0yLTItMy0yLTUtMnoiLz48L3N2Zz4=)](https://renovatebot.com)

## Install

```bash
npm install --save react-context-consumer-hoc
```

## Documentation

- [The Gist (quick examples)](#the-gist)
- [API](#api)
  - [`withContextAsProps(Context1[, Context2, ..., ContextN])`](#withcontextasprops)
  - [`withContext(contextList, mapContextToProps)`](#withcontext)
- [Full example](#full-example)
- [Contributors](#author)

## The Gist

Using `withContextAsProps`
```jsx
import { withContextAsProps } from 'react-context-consumer-hoc'

// ContextA == { a: 1 } && ContextB == { b: 1 }
const InnerComponent = ({ a, b, ...ownProps }) => { /* ... */ }
const MyComponent = withContextAsProps(ContextA, ContextB)(InnerComponent)
```

Using `withContext`
```jsx
import { withContext } from 'react-context-consumer-hoc'

// ContextA == { a: 1 } && ContextB == { b: 1 }
const InnerComponent = ({ c, ...ownProps }) => { /* ... */ }
const MyComponent = withContext(
  [ContextA, ContextB],
  (context, ownProps) => ({ c: context.a + context.b }) // mapContextToProps
)(InnerComponent)
```

Using `withContext` and [`reselect -> createSelector()`](https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc)
```jsx
import { withContext } from 'react-context-consumer-hoc'
import { createSelector } from 'reselect'

const addAandB = createSelector(
  (context) => context.a,
  (context) => context.b,
  (a, b) => a + b
)

// ContextABC == { a: 1, b: 2, c: 3 }
const InnerComponent = ({ sum, ...ownProps }) => { /* ... */ }
const MyComponent = withContext(
  [ContextABC],
  (context, ownProps) => ({ sum: addAandB(context) }) // mapContextToProps
)(InnerComponent)
```

Namespaces using `withContext` and [`reselect -> createStructuredSelector()`](https://github.com/reduxjs/reselect#createstructuredselectorinputselectors-selectorcreator--createselector)
```jsx
import { withContext } from 'react-context-consumer-hoc'
import { createStructuredSelector } from 'reselect'

// ContextA == { a: 1 } && ContextB == { b: 1 }
const InnerComponent = ({ context: { a, b }, ...ownProps }) => { /* ... */ }
const MyComponent = withContext(
  [ContextA, ContextB],
  createStructuredSelector({
    context: createStructuredSelector({
      a: (context) => context.a,
      b: (context) => context.b
    })
  })
)(InnerComponent)
```

## API

### withContextAsProps

`withContextAsProps(Context1[, Context2, ..., ContextN])(Component)`

Wraps the Component with dynamically created consumers and passes all consumed context as props. `withContextAsProps` is a facade around `withContext`, providing a convenient API for the most common use cases.

#### Arguments

* `Context1[, Context2, ..., ContextN]` (*Comma-separated context list | required*): At least 1 context API is needed. The component will be wrapped in consumers from each of the context passed to `withContextAsProps`.

  All `react-context-consumer-hoc` APIs wrap the new component once at export, i.e. there is no further computation done afterward.

  > Note: in advanced scenarios where you need more control over the rendering performance, it is recommended to use `withContext`. In this case, you can pass a `mapContextToProps` function where you can specify which props from the context to *select* for a particular component instance. Most apps will not need this as long as the context doesn't change too often. One scenario could be if one of the context gets recomputed on every render but only a few really care about the changes.

### withContext

`withContext(contextList, mapContextToProps)(Component)`

Wraps the Component with dynamically created consumers and passes all consumed context as props.

#### Arguments

* `contextList` (*Array | required*): A list of context API with at least 1. The component will be wrapped in consumers from each of the context in the array.
* `mapContextToProps(context, ownProps): contextPropsObject` (*Function | required*): This function is called with 2 arguments and must return an object conatining the props that will be passed to the component. The first argument is the consumed context from the APIs and the second argument is the props that are being passed to the component. `mapContextToProps` must return an object Note that this function is called on every render and the object returned will be destructured/passed as props to the component.

  > Use `reselect` to efficiently compose selectors using memoization

### Full example

```jsx
// ProviderA.js
import React from 'react'
const childContextA = { a: 1 }
export const ContextA = React.createContext(childContextA)
export default ({ children }) => (
  <ContextA.Provider value={childContextA}>
    {children}
  </ContextA.Provider>
)

// ProviderB.js
import React from 'react'
const childContextB = { b: 2 }
export const ContextB = React.createContext(childContextB)
export default ({ children }) => (
  <ContextB.Provider value={childContextB}>
    {children}
  </ContextB.Provider>
)

// MyComponent.js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withContextAsProps } from 'react-context-consumer-hoc'
import { ContextA } from './ProviderA'
import { ContextB } from './ProviderB'

class MyComponent extends Component {
  static propTypes = {
    // from context
    a: PropTypes.number.isRequired,
    b: PropTypes.number.isRequired,

    // own props
    c: PropTypes.number.isRequired
  }

  render() {
    return (
      <div>
        <div>{this.props.a}</div>
        <div>{this.props.b}</div>
        <div>{this.props.c}</div>
      </div>
    )
  }
}

export default withContextAsProps(ContextA, ContextB)(MyComponent)

// App.js
import React, { Component } from 'react'
import ProviderA from './ProviderA'
import ProviderB from './ProviderB'
import MyComponent from './MyComponent'

export default class App extends Component {
  render () {
    return (
      <ProviderA>
        <ProviderB>
          <div className='stuff'>some other content</div>
          <div className='nested element'>
            <MyComponent c="3" />
          </div>
        </ProviderB>
      </ProviderA>
    )
  }
}
```

## Author

* Pablo Garcia [@pgarciacamou](https://twitter.com/pgarciacamou/)

## Contributors

<!-- Contributors START
pablo_garcia pgarciacamou https://twitter.com/pgarciacamou/ author contributor
Contributors END -->
<!-- Contributors table START -->
| <img src="https://avatars.githubusercontent.com/pgarciacamou?s=100" width="100" alt="pablo garcia" /><br />[<sub>pablo garcia</sub>](https://twitter.com/pgarciacamou/)<br />💻 📖 💡 |
| :---: |
<!-- Contributors table END -->
This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.

[![Package Quality](http://npm.packagequality.com/badge/react-context-consumer-hoc.png)](http://packagequality.com/#?package=react-context-consumer-hoc)
