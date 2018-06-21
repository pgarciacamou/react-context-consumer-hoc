# react-context-consumer-hoc

> React context consumer hoc which injects as props

[![NPM](https://img.shields.io/npm/v/react-context-consumer-hoc.svg)](https://www.npmjs.com/package/react-context-consumer-hoc) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-context-consumer-hoc
```

## Usage

```jsx
// Context A
const ContextA = React.createContext()
function ContextAProvider(props) {
  return (
    <ContextA.Provider value={{ someValue: Math.random() }}>
      {props.children}
    </ContextA.Provider>
  )
}

// Context B
const ContextB = React.createContext()
function ContextBProvider(props) {
  return (
    <ContextB.Provider value={{ someOtherValue: Math.random() }}>
      {props.children}
    </ContextB.Provider>
  )
}

// Consumer of Context A and B
class RandomConsumer extends Component {
  static propTypes = {
    context: PropTypes.shape({
      someValue: PropTypes.number.isRequired,
      someOtherValue: PropTypes.number.isRequired
    }).isRequired
  }

  constructor(props) {
    super(props)

    // do something in the state
    this.state = {
      color: props.context.someValue > 0.5 ? 'white' : 'black'
    }
  }

  render() {
    const { context } = this.props

    return (
      <p>
        Black or white? {context.someValue > 0.5 ? 'white' : 'black'}
        <br />
        This is a random number: {context.someOtherValue}
      </p>
    )
  }
}

const WrappedConsumer = ContextConsumerHOC(ContextA, ContextB)(RandomConsumer)

export default class App extends Component {
  render () {
    return (
      <ContextAProvider>
        <ContextBProvider>
          <WrappedConsumer />
        </ContextBProvider>
      </ContextAProvider>
    )
  }
}
```

## What is next?

1. Instead of adding the context into "context", just inject consumed objects into props.
  - e.g. instead of `this.props.context.somePropFromContext` => `this.props.somePropFromContext`
2. [after implementing step #1] remove lodash dependency (not really needed).
3. Namespacing: allow passing an options object the HOC so that we can name the consumed objects.
  - e.g. ContextConsumerHOC({ someContext: ContextA })(SomeComponent) // this.props.someContext

## License

MIT © [pgarciacamou](https://github.com/pgarciacamou)
