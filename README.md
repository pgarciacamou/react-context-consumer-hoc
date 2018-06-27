# react-context-consumer-hoc

> React context consumer hoc which injects as props

[![NPM](https://img.shields.io/npm/v/react-context-consumer-hoc.svg)](https://www.npmjs.com/package/react-context-consumer-hoc) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-context-consumer-hoc
```

## Usage

```jsx
import consume from 'react-context-consumer-hoc'

function Component(props) {
  const { context: { a, b } } = props;
  return [
    <div key='a' id='context-a'>
      {a}
    </div>,
    <div key='b' id='context-b'>
      {b}
    </div>
  ]
}

const ContextA = React.createContext()
const ContextB = React.createContext()
const Consumer = consume(ContextA, ContextB)(Component)

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

1. Instead of adding the context into "context", just inject consumed objects into props.
  - e.g. instead of `this.props.context.somePropFromContext` => `this.props.somePropFromContext`
2. [after implementing step #1] remove lodash dependency (not really needed).
3. Namespacing: allow passing an options object the HOC so that we can name the consumed objects.
  - e.g. ContextConsumerHOC({ someContext: ContextA })(SomeComponent) // this.props.someContext

## License

MIT © [pgarciacamou](https://github.com/pgarciacamou)
