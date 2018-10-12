# react-context-consumer-hoc v2.x

> React context consumer hoc. A 2KB lib that consumes context as props.

[![NPM](https://img.shields.io/npm/v/react-context-consumer-hoc.svg)](https://www.npmjs.com/package/react-context-consumer-hoc) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Build Status](https://travis-ci.org/pgarciacamou/react-context-consumer-hoc.svg?branch=master)](https://travis-ci.org/pgarciacamou/react-context-consumer-hoc) [![Package Quality](http://npm.packagequality.com/shield/react-context-consumer-hoc.svg)](http://packagequality.com/#?package=react-context-consumer-hoc)

## Install

```bash
npm install --save react-context-consumer-hoc
```

## Documentation

- [The Gist](#the-gist)
- [Full example](#full-example)
- [API](#api)
  - [`withContextAsProps(Context1[, Context2, ..., ContextN])`](#withcontextasprops)
  - [`withContext(contextList, mapContextToProps)`](#withcontext)
  - [`UNSAFE_withContext(Context1[, Context2, ..., ContextN])`](#unsafe_withcontext)
- [Issues with react-redux](#issues-with-react-redux)
  - [Wrap connected component](#wrap-connected-component)
  - [`noRef`](#noref)
- [Contributors](#author)

## The Gist
[back to top](#documentation)

Using `withContextAsProps`
```jsx
// ContextA == { a: 1 } && ContextB == { b: 1 }
const InnerComponent = ({ a, b, ...ownProps }) => { /* ... */ }
const MyComponent = withContextAsProps(ContextA, ContextB)(InnerComponent)
```

Using `withContext`
```jsx
// ContextA == { a: 1 } && ContextB == { b: 1 }
const InnerComponent = ({ c, ...ownProps }) => { /* ... */ }
const MyComponent = withContext(
  [ContextA, ContextB],
  (context, ownProps) => ({ c: context.a + context.b }) // mapContextToProps
)(InnerComponent)
```

Using `reselect -> createSelector()`
```jsx
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

Namespaces with `reselect -> createStructuredSelector()`
```jsx
import { createStructuredSelector, createSelector } from 'reselect'

const getA = (context) => context.a
const getB = (context) => context.b
const getSum = createSelector(getA, getB, (a, b) => (a + b))
const contextStructuredSelector = createStructuredSelector({
  context: createStructuredSelector({ a: getA, b: getB, sum: getSum })
})

// ContextA == { a: 1 } && ContextB == { b: 1 }
const InnerComponent = ({ context: { a, b, sum }, ...ownProps }) => { /* ... */ }
const MyComponent = withContext(
  [ContextA, ContextB],
  contextStructuredSelector // will receive context and ownProps same as mapContextToProps
)(InnerComponent)
```

### Full example
[back to top](#documentation)

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

class SomeComponent extends Component {
  static propTypes = {
    a: PropTypes.number.isRequired,
    b: PropTypes.number.isRequired
  }

  render() {
    return (
      <div>
        <div>{this.props.a}</div>
        <div>{this.props.b}</div>
      </div>
    )
  }
}

export default withContextAsProps(ContextA, ContextB)(SomeComponent)

// App.js
import React, { Component } from 'react'
import ProviderA from './ProviderA'
import ProviderB from './ProviderB'

export default class App extends Component {
  render () {
    return (
      <ProviderA>
        <ProviderB>
          <div className='stuff'>some other content</div>
          <div className='nested element'>
            <Consumer />
          </div>
        </ProviderB>
      </ProviderA>
    )
  }
}
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

### Issue with react-redux
[back to top](#documentation)

There is a bug with react-redux and React.forwardRef, see issue [#6](https://github.com/pgarciacamou/react-context-consumer-hoc/issues/6) for more information. 

Basically, `react-context-consumer-hoc` uses `React.forwardRef` which returns an object and we currently can't pass an object to `react-redux -> connect()(/* here */)`. Don't worry, `react-redux` is aware of this issue and they are working on it.

There are 2 workarounds which will most likely break option `withRef` of `react-redux -> connect()`.

#### Wrap connected component
[back to top](#documentation)

```jsx
// The same thing can be done using withContextAsProps and UNSAFE_withContext
export default withContext(
  [...],
  function mapContextToProps(context, ownProps) { /* ... */ }
)(
  connect(
    function mapStateToProps(state, ownProps) { /* ... */ }
  )(MyComponent)
)
```

#### noRef
[back to top](#documentation)

`[withContext|withContextAsProps|UNSAFE_withContext].noRef`

`noRef` is a simple wrapper built on top of all APIs which wraps the topmost consumer with a stateless function component (a function). to work around the `react-redux -> connect()` bug with React.forwardRef, see issue #6 for more information.

```jsx
export default connect(
  function mapStateToProps(state, ownProps) { /* ... */ }
)(
  withContextAsProps.noRef(...)(MyComponent)
  // or withContext.noRef([...], mapContextToProps)(MyComponent)
  // or UNSAFE_withContext.noRef(...)(MyComponent)
)
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
