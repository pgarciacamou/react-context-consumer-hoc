# react-context-consumer-hoc v2.x

> React context consumer hoc. A 2KB lib that consumes context as props.

[![NPM](https://img.shields.io/npm/v/react-context-consumer-hoc.svg)](https://www.npmjs.com/package/react-context-consumer-hoc) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Build Status](https://travis-ci.org/pgarciacamou/react-context-consumer-hoc.svg?branch=master)](https://travis-ci.org/pgarciacamou/react-context-consumer-hoc)

## Install

```bash
npm install --save react-context-consumer-hoc
```

## Simple example

```jsx
// MyComponent.js
import { withContext, withContextAsProps } from 'react-context-consumer-hoc'
import { ContextA } from './MyContextAProvider' // => { a: 1 }
import { ContextB } from './MyContextBProvider' // => { b: 2 }

function MyComponent({ a, b, c }) {
  c = c || a + b;
  console.log(c === 3); // => true
}

// passing all as props
export default withContextAsProps(ContextA, ContextB)(MyComponent)

// OR using mapContextToProps
export default withContext(
  [ContextA, ContextB],
  function mapContextToProps({ a, b }) {
    // this will only pass prop c and not a and b
    // pro tip: use reselect to use memoization
    return {
      c: a + b
    }
  }
)
```

## Usage

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
* `mapContextToProps: contextProps` (*Function | required*): This function is called with all the consumed context on every render and the object returned will be destructured/passed as props to the component.

  > Use `reselect` to efficiently compose selectors using memoization

## Code Samples

### Simple example using withContextAsProps

```jsx
// MyComponent.js
import { withContextAsProps } from 'react-context-consumer-hoc'
import { ContextA } from './MyContextAProvider' // => { a: 1 }
import { ContextB } from './MyContextBProvider' // => { b: 2 }

function MyComponent({ a, b }) { /* a === 1 && b === 2 //=> true */ }

export default withContextAsProps(ContextA, ContextB)(MyComponent)
```

### Simple example using withContext

```jsx
// MyComponent.js
import { withContext } from 'react-context-consumer-hoc'
import { ContextA } from './MyContextAProvider' // => { a: 1 }
import { ContextB } from './MyContextBProvider' // => { b: 2 }

function MyComponent({ c }) { /* c === 3 //=> true */ }

export default withContext(
  [ContextA, ContextB],
  function mapContextToProps({ a, b }) {
    return {
      c: a + b
    }
  }
)(MyComponent)
```

### Selectors with reselect

Selectors allow increasing rendering performance, for example, if a PureComponent only cares about a never changing property in a context that has multiple changing properties, then the use of a selector prevents unnecessary re-renders.

> Use `reselect` to efficiently compose selectors using memoization

```jsx
// ContextASelectors.js
import { createSelector } from 'reselect'
const getA = (context) => context.a
const getB = (context) => context.b
export const getSumOfAandB = createSelector(
  [getA, getB],
  (a, b) => a + b
)

// MyComponent.js
import { withContext } from 'react-context-consumer-hoc'
import { ContextA } from './MyContextAProvider' // => { a: 1, b: 2, c: 3 }
import * as ContextASelectors from './ContextASelectors'

function MyComponent({ a, b, c, sum }) {
  console.log(a === undefined); // true
  console.log(b === undefined); // true
  console.log(c === undefined); // true
  console.log(sum === 3); // true
  // ...
}

export default withContext(
  /**
   * This will only return "a" and "b" from ContextA ("c" will be undefined)
   */
  [ContextA],
  function mapContextToProps(context) {
    return {
      abSum: ContextSelectors.getSumOfAandB(context)
    }
  }
)(MyComponent)
```

### Namespacing with reselect (createStructuredSelector)

Let's say you want to reconstruct the `UNSAFE_withContext` API to wrap context in an object, e.g. `this.props.context`. Then, we can simply do the following: 

```js
import { createStructuredSelector } from 'reselect'
import { ContextA } from './MyContextAProvider' // => { a: 1 }
import { ContextB } from './MyContextBProvider' // => { b: 2 }
import * as ContextASelectors from '../selectors/ContextASelectors'
import * as ContextBSelectors from '../selectors/ContextBSelectors'
// ...

function MyComponent(props) {
  console.log(props) // { context: { a: 1 , b: 2 } }
  // ...
}

export default withContext(
  [ContextA, ContextB],
  // react-context-consumer-hoc will pass the context to the
  // structured selector and reselect will do the heavy lifting
  createStructuredSelector({
    context: createStructuredSelector({
      a: ContextASelectors.getA,
      b: ContextBSelectors.getB
    })
  })
)(MyComponent)
```

### Redux (connect)

```jsx
import { withContext } from "react-context-consumer-hoc"
import { connect } from "react-redux"
import { ContextA } from './MyContextAProvider' // => { a: 1, b: 2, c: 3 }

function MyComponent() { /* ... */ }

export default withContext(
  [ContextA],
  function mapContextToProps({ a }) {
    return { a }
  }
)(
  connect(
    function mapStateToProps(state, ownProps) { /* ... */ }
  )(MyComponent)
)
```

Or using withContextAsProps

```jsx
import { withContextAsProps } from "react-context-consumer-hoc"
import { connect } from "react-redux"
import { ContextA } from './MyContextAProvider' // => { a: 1, b: 2, c: 3 }

function MyComponent() { /* ... */ }

export default withContextAsProps(ContextA)(
  connect(
    function mapStateToProps(state, ownProps) { /* ... */ }
  )(MyComponent)
)
```

### Full example

```jsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withContextAsProps } from 'react-context-consumer-hoc'

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
//   export default withContextAsProps(ContextA, ContextB)(SomeComponent)
const Consumer = withContextAsProps(ContextA, ContextB)(SomeComponent)

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
pablo_garcia pgarciacamou https://twitter.com/pgarciacamou/ author contributor
Contributors END -->
<!-- Contributors table START -->
| <img src="https://avatars.githubusercontent.com/pgarciacamou?s=100" width="100" alt="pablo garcia" /><br />[<sub>pablo garcia</sub>](https://twitter.com/pgarciacamou/)<br />💻 📖 💡 |
| :---: |
<!-- Contributors table END -->
This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.
