# react-context-consumer-hoc v2.x

> React context consumer hoc. A 2KB lib that consumes context as props.

[![NPM](https://img.shields.io/npm/v/react-context-consumer-hoc.svg)](https://www.npmjs.com/package/react-context-consumer-hoc) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Build Status](https://travis-ci.org/pgarciacamou/react-context-consumer-hoc.svg?branch=master)](https://travis-ci.org/pgarciacamou/react-context-consumer-hoc) [![Package Quality](http://npm.packagequality.com/shield/react-context-consumer-hoc.svg)](http://packagequality.com/#?package=react-context-consumer-hoc)

## Install

```bash
npm install --save react-context-consumer-hoc
```

## Documentation

- [Simple Example](#simple-example)
- [API](#api)
  - [`withContextAsProps(Context1[, Context2, ..., ContextN])`](#withcontextasprops)
  - [`withContext(contextList, mapContextToProps)`](#withcontext)
  - [`UNSAFE_withContext(Context1[, Context2, ..., ContextN])`](#unsafe_withcontext)
- [Code Samples](#code-samples)
  - [Simple example using `withContextAsProps`](#simple-example-using-withcontextasprops)
  - [Simple example using `withContext`](#simple-example-using-withcontext)
  - [Simple example using `UNSAFE_withContext`](#simple-example-using-unsafe_withcontext)
  - [Selectors using `reselect`](#selectors-using-reselect)
    - [Namespacing using `createStructuredSelector`](#namespacing-using-createstructuredselector)
  - [Redux](#redux)
    - [Wrap connected component](#wrap-connected-component)
    - [`noRef`](#noref)
  - [Full example](#full-example)
- [Contributors](#author)

## Simple example
[back to top](#documentation)

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

## API
[back to top](#documentation)

### withContextAsProps
[back to top](#documentation)

`withContextAsProps(Context1[, Context2, ..., ContextN])(Component)`

Wraps the Component with dynamically created consumers and passes all consumed context as props. `withContextAsProps` is a facade around `withContext`, providing a convenient API for the most common use cases.

#### Arguments

* `Context1[, Context2, ..., ContextN]` (*Comma-separated context list | required*): At least 1 context API is needed. The component will be wrapped in consumers from each of the context passed to `withContextAsProps`.

  All `react-context-consumer-hoc` APIs wrap the new component once at export, i.e. there is no further computation done afterward.

  > Note: in advanced scenarios where you need more control over the rendering performance, it is recommended to use `withContext`. In this case, you can pass a `mapContextToProps` function where you can specify which props from the context to *select* for a particular component instance. Most apps will not need this as long as the context doesn't change too often. One scenario could be if one of the context gets recomputed on every render but only a few really care about the changes.

### withContext
[back to top](#documentation)

`withContext(contextList, mapContextToProps)(Component)`

Wraps the Component with dynamically created consumers and passes all consumed context as props.

#### Arguments

* `contextList` (*Array | required*): A list of context API with at least 1. The component will be wrapped in consumers from each of the context in the array.
* `mapContextToProps(context, ownProps): contextPropsObject` (*Function | required*): This function is called with 2 arguments and must return an object conatining the props that will be passed to the component. The first argument is the consumed context from the APIs and the second argument is the props that are being passed to the component. `mapContextToProps` must return an object Note that this function is called on every render and the object returned will be destructured/passed as props to the component.

  > Use `reselect` to efficiently compose selectors using memoization

### UNSAFE_withContext
[back to top](#documentation)

> WARNING: [**deprecated**] Will be removed in v3.
>   This method passes a new object everytime the top-most component is rendered, causing issues with `PureComponent`s, and anything that implements a shallow comparison (triple equal).

`UNSAFE_withContext(Context1[, Context2, ..., ContextN])(Component)`

Wraps the Component with dynamically created consumers and passes all consumed context wrapped in a new object called `context`. This method was kept to keep compatibility with the previous implementation but it is recommended not to use it.

**This method can be refactored to use [namespaces with `reselect`](#namespacing-using-createstructuredselector).**

#### Arguments

* `Context1[, Context2, ..., ContextN]` (*Comma-separated context list | required*): At least 1 context API is needed. The component will be wrapped in consumers from each of the context passed to `withContextAsProps`.

  All `react-context-consumer-hoc` APIs wrap the new component once at export, i.e. there is no further computation done afterward.

## Code Samples
[back to top](#documentation)

### Simple example using withContextAsProps
[back to top](#documentation)

```jsx
// MyComponent.js
import { withContextAsProps } from 'react-context-consumer-hoc'
import { ContextA } from './MyContextAProvider' // => { a: 1 }
import { ContextB } from './MyContextBProvider' // => { b: 2 }

function MyComponent({ a, b }) { /* a === 1 && b === 2 //=> true */ }

export default withContextAsProps(ContextA, ContextB)(MyComponent)
```

### Simple example using withContext
[back to top](#documentation)

```jsx
// MyComponent.js
import { withContext } from 'react-context-consumer-hoc'
import { ContextA } from './MyContextAProvider' // => { a: 1 }
import { ContextB } from './MyContextBProvider' // => { b: 2 }

function MyComponent({ c, d }) { /* c === (3 + d) //=> true */ }

export default withContext(
  [ContextA, ContextB],
  function mapContextToProps({ a, b }, ownProps) {
    return {
      c: a + b + ownProps.d // let's say d is a number
    }
  }
)(MyComponent)
```

### Simple example using UNSAFE_withContext
[back to top](#documentation)

```jsx
// MyComponent.js
import { UNSAFE_withContext } from 'react-context-consumer-hoc'
import { ContextA } from './MyContextAProvider' // => { a: 1 }
import { ContextB } from './MyContextBProvider' // => { b: 2 }

function MyComponent({ context: { a, b } }) { /* a === 1 && b === 2 //=> true */ }

export default UNSAFE_withContext(ContextA, ContextB)(MyComponent)
```

### Selectors using reselect
[back to top](#documentation)

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
  [ContextA],
  function mapContextToProps(context) {
    return {
      abSum: ContextSelectors.getSumOfAandB(context)
    }
  }
)(MyComponent)
```

#### Namespacing using createStructuredSelector
[back to top](#documentation)

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

### Redux
[back to top](#documentation)

There is a bug with react-redux and React.forwardRef, see issue #6 for more information. But basically, we currently cannot pass an object to `react-redux -> connect()(/* here */)`.

There are 2 workarounds:

#### Wrap connected component
[back to top](#documentation)

> NOTE: this will still most likely not work with `withRef` option from `react-redux -> connect()`.

```jsx
import { withContext } from "react-context-consumer-hoc"
import { connect } from "react-redux"
import { ContextA } from './MyContextAProvider' // => { a: 1, b: 2, c: 3 }

function MyComponent() { /* ... */ }

// The same thing can be done using withContextAsProps and UNSAFE_withContext
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

#### noRef
[back to top](#documentation)

`[withContext|withContextAsProps|UNSAFE_withContext].noRef`

`noRef` is a simple wrapper around the components returned by all the APIs to work around the `react-redux -> connect()` bug with React.forwardRef, see issue #6 for more information.

> NOTE: this will still most likely not work with `withRef` option from `react-redux -> connect()`.

```jsx
import { withContextAsProps } from "react-context-consumer-hoc"
import { connect } from "react-redux"
import { ContextA } from './MyContextAProvider' // => { a: 1, b: 2, c: 3 }

function MyComponent() { /* ... */ }

export default connect(
  function mapStateToProps(state, ownProps) { /* ... */ }
)(
  // The same thing can be done using withContext and UNSAFE_withContext
  withContextAsProps.noRef(ContextA)(MyComponent)
)
```

### Full example
[back to top](#documentation)

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
[back to top](#documentation)

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
