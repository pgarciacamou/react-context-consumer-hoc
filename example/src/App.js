import React, { Component } from 'react'

import ExampleComponent from 'react-context-consumer-hoc'

export default class App extends Component {
  render () {
    return (
      <div>
        <ExampleComponent text='Modern React component module' />
      </div>
    )
  }
}
