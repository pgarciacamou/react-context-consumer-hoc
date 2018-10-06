# react-context-consumer-hoc v2.x

> React context consumer hoc. A 2KB lib that consumes context as props.

[![NPM](https://img.shields.io/npm/v/react-context-consumer-hoc.svg)](https://www.npmjs.com/package/react-context-consumer-hoc) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-context-consumer-hoc
```

## Simple example

```jsx
// MyComponent.js
import { withContext } from 'react-context-consumer-hoc'
import { ContextA } from './MyContextAProvider' // => { a: 1 }
import { ContextB } from './MyContextBProvider' // => { b: 2 }

function MyComponent({ a, b }) { /* a === 1 && b === 2 //=> true */ }

export default withContext(ContextA, ContextB)(MyComponent)
```

## Notation

The context APIs must be passed as comma separated arguments. The component will then receive the context as props.

`withContext(PlainContext1, PlainContext2, ...)(Component)`

**Each argument** can be either:

1. Regular Context API.
  - `withContext(PlainContext1, PlainContext2, ...)(Component)`
2. Array wrapping any single Context API (where index 0 is the Context).
  - `withContext(..., [PlainContextN, selector], ...)(Component)`

As illustrated, the second approach requires passing a selector (`function`) or namespace (`string`) as index 1.

* **[function|required]** selector that takes in the context and returns an object which is destructured to be passed as props to the component `<Component {...selector(context)} />`.
  - E.g. `withContext([PlainContext, (context) => ({ foo: context.foo })])(...)`
  - E.g. `({ a, b }) => ({ c: a + b })`
  - E.g. with `lodash` -> `context => _.pick(context, "foo")`
  - E.g. with `reselect` -> `context => ContextSelectors.getPropFoo`
* **[string|required]** namespace that will include the context.
  - E.g. `withContext([PlainContext, "a"])(...)` which is the same as `(context) => ({ a: context })` or `<Component [namespace]={context} />`

## Usage

### Simple example (same as above)

```jsx
// MyComponent.js
import { withContext } from 'react-context-consumer-hoc'
import { ContextA } from './MyContextAProvider' // => { a: 1 }
import { ContextB } from './MyContextBProvider' // => { b: 2 }

function MyComponent({ a, b }) { /* a === 1 && b === 2 //=> true */ }

export default withContext(ContextA, ContextB)(MyComponent)
```

### Namespacing

```jsx
// MyComponent.js
import { withContext } from 'react-context-consumer-hoc'
import { ContextA } from './MyContextAProvider' // => { a: 1 }
import { ContextB } from './MyContextBProvider' // => { b: 2 }

function MyComponent({ a, wrap }) { /* a === 1 && wrap.b === 2 //=> true */ }

export default withContext(
  ContextA,
  [ContextB, "wrap"] // with namespace
)(MyComponent)
```

### Selectors

Selectors must return an object as it will be destructured to be passed as props to the Component.

Selectors allow increasing performance, for example, if a PureComponent only cares about a never changing property in a context that has multiple changing properties, then the use of a selector prevents unnecessary re-renders.

Another added benefit is that selectors can be created with libraries like `reselect` that use memoization.

```jsx
// MyComponent.js
import { withContext } from 'react-context-consumer-hoc'
import { ContextA } from './MyContextAProvider' // => { a: 1, a: 2 }

function MyComponent({ a, b }) { /* a === 1 && b === undefined //=> true */ }

export default withContext(
  /**
   * This will only return "a" from ContextA ("b" will be undefined)
   */
  [ContextA, (context) => ({ a: context.a })]
)(MyComponent)
```

Similar approach with `reselect`.

```jsx
// ContextASelectors.js
import { createSelector } from 'reselect'
const _getPropA = (context) => context.a
const _getPropB = (context) => context.b
export const getAandB = createSelector(
  [getPropA, getPropB],
  (a, b) => ({ a, b }) // memoized!
)

// MyComponent.js
import { withContext } from 'react-context-consumer-hoc'
import { ContextA } from './MyContextAProvider' // => { a: 1, b: 2, a: 3 }
import * as ContextASelectors from './ContextASelectors'

function MyComponent({ a, b, c }) { /* a === 1 && b === 2 && c === undefined //=> true */ }

export default withContext(
  /**
   * This will only return "a" and "b" from ContextA ("c" will be undefined)
   */
  [ContextA, getAandB]
)(MyComponent)
```

### Full example

```jsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withContext } from 'react-context-consumer-hoc'

class SomeComponent extends Component {
  static propTypes = {
    a: PropTypes.number.isRequired, // injected by ContextA
    b: PropTypes.number.isRequired // injected by ContextB
  }

  render() {
    const { a, b } = this.props
    return [
      <div key='a' id='context-a'>
        {a}
      </div>,
      <div key='b' id='context-b'>
        {b}
      </div>
    ]
  }
}

// The context will normally be exported elsewhere
const ContextA = React.createContext()
const ContextB = React.createContext()

// this would normally look like
//   export default withContext(ContextA, ContextB)(SomeComponent)
const Consumer = withContext(ContextA, ContextB)(SomeComponent)

export default class App extends Component {
  constructor() {
    super()

    this.childContextA = { a: 1 }
    this.childContextB = { b: 2 }
  }
  render () {
    return (
      <ContextA.Provider value={this.childContextA}>
        <ContextB.Provider value={this.childContextB}>
          <div className='stuff'>some other content</div>
          <div className='nested element'>
            <Consumer />
          </div>
        </ContextB.Provider>
      </ContextA.Provider>
    )
  }
}
```

## Author

* Pablo Garcia [@pgarciacamou](https://twitter.com/pgarciacamou/)

## Contributors

<!-- Contributors START
pablo_garcia pgarciacamou https://twitter.com/pgarciacamou/ contributor
Contributors END -->
<!-- Contributors table START -->
| <img src="https://avatars.githubusercontent.com/pgarciacamou?s=100" width="100" alt="pablo garcia" /><br />[<sub>pablo garcia</sub>](https://twitter.com/pgarciacamou/)<br />💻 📖 💡 |
| :---: | :---: |
<!-- Contributors table END -->
This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.
