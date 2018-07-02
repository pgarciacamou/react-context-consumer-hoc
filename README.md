# react-context-consumer-hoc

> React context consumer hoc. A 2KB lib that consumes context as props.

[![NPM](https://img.shields.io/npm/v/react-context-consumer-hoc.svg)](https://www.npmjs.com/package/react-context-consumer-hoc) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-context-consumer-hoc
```

## Usage

Just wrap your components on export.

```jsx
// MyComponent.js
import withContext from 'react-context-consumer-hoc'
import { ContextA } from './MyContextAProvider'
import { ContextB } from './MyContextBProvider'

function MyComponent({ context }) { /* ... */ }

export default withContext(ContextA, ContextB)(MyComponent);
```

A full example:

```jsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withContext from 'react-context-consumer-hoc'

class SomeComponent extends Component {
  static propTypes = {
    context: PropTypes.shape({
      a: PropTypes.number.isRequired,
      b: PropTypes.number.isRequired
    }).isRequired
  }

  render() {
    const { context: { a, b } } = this.props
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
  render () {
    return (
      <ContextA.Provider value={{ a: 1 }}>
        <ContextB.Provider value={{ b: 2 }}>
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

## What is next?

1. Instead of injecting into `props.context`, just inject as props.
    - e.g. `this.props.context.somePropFromContext` => `this.props.somePropFromContext`
2. Namespacing: allow passing an options object the HOC so that we can name the consumed objects.
    - e.g. `ContextConsumerHOC({ someContext: ContextA })(SomeComponent) // this.props.someContext`

## License

MIT © [pgarciacamou](https://github.com/pgarciacamou)
