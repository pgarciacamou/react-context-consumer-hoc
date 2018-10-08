import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withContextAsProps } from 'react-context-consumer-hoc'

// Context A
const ContextA = React.createContext()
function ContextAProvider(props) {
  return (
    <ContextA.Provider value={{ someValue: Math.random() }}>
      {/* eslint-disable-next-line */}
      {props.children}
    </ContextA.Provider>
  )
}

// Context B
const ContextB = React.createContext()
function ContextBProvider(props) {
  return (
    <ContextB.Provider value={{ someOtherValue: Math.random() }}>
      {/* eslint-disable-next-line */}
      {props.children}
    </ContextB.Provider>
  )
}

// Consumer of Context A and B
class RandomConsumer extends Component {
  static propTypes = {
    someValue: PropTypes.number.isRequired,
    someOtherValue: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)

    // do something in the state
    this.state = {
      color: props.someValue > 0.5 ? 'white' : 'black'
    }
  }

  render() {
    const { someValue, someOtherValue } = this.props

    return (
      <p>
        Black or white? {someValue > 0.5 ? 'white' : 'black'}
        <br />
        This is a random number: {someOtherValue}
      </p>
    )
  }
}

const WrappedConsumer = withContextAsProps(ContextA, ContextB)(RandomConsumer)

export default class App extends Component {
  render() {
    return (
      <ContextAProvider>
        <ContextBProvider>
          <WrappedConsumer />
        </ContextBProvider>
      </ContextAProvider>
    )
  }
}
