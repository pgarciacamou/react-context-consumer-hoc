import React, { Component } from 'react'
import PropTypes from 'prop-types'
import renderer from 'react-test-renderer'
import withContext from '../'

function setup(propOverrides = {}) {
  const ref = React.createRef()
  const props = {
    ref,
    c: 3,
    ...propOverrides
  }

  class SomeComponent extends Component {
    static propTypes = {
      context: PropTypes.shape({
        a: PropTypes.number.isRequired,
        b: PropTypes.number.isRequired
      }).isRequired,
      c: PropTypes.number.isRequired
    }

    render() {
      const { context: { a, b }, c } = this.props
      return [
        <div key='a' id='context-a'>
          {a}
        </div>,
        <div key='b' id='context-b'>
          {b}
        </div>,
        <div key='c' id='props-c'>
          {c}
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

  const tree = renderer.create(
    <ContextA.Provider value={{ a: 1 }}>
      <ContextB.Provider value={{ b: 2 }}>
        <div className='stuff'>some other content</div>
        <div className='nested element'>
          <Consumer {...props} />
        </div>
      </ContextB.Provider>
    </ContextA.Provider>
  )

  return {
    props,
    SomeComponent,
    ContextA,
    ContextB,
    Consumer,
    tree
  }
}

describe('ContextConsumerHOC', () => {
  it('matches snapshot', () => {
    const { tree } = setup()
    expect(tree.toJSON()).toMatchSnapshot()
  })

  it('should forward the references', () => {
    const { SomeComponent, props } = setup()
    const { ref } = props
    expect(ref.current.constructor).toEqual(SomeComponent)
  })
})
