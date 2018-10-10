import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import renderer from 'react-test-renderer'
import UNSAFE_withContext from '../UNSAFE_withContext'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

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
  //   export default UNSAFE_withContext(ContextA, ContextB)(SomeComponent)
  const Consumer = UNSAFE_withContext(ContextA, ContextB)(SomeComponent)

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

  it('shows that PureComponents break because of the context wrapper', () => {
    const spy = jest.fn()
    const ContextA = React.createContext()
    const ContextB = React.createContext()

    class NakedPureComponent extends PureComponent {
      render() {
        spy() // should run once but runs twice
        return (
          <div />
        )
      }
    }
    const Consumer = UNSAFE_withContext(
      ContextA,
      ContextB
    )(NakedPureComponent)

    class MyHeavyComponent extends Component {
      constructor(props) {
        super(props)
        this.state = { random: 0 }

        // This proves that even if the context doesn't change it will re-render.
        this.childContextA = { a: 1 }
        this.childContextB = { b: 2 }
      }
      render() {
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

    const wrapper = mount(
      <MyHeavyComponent />
    )

    wrapper.setState({ random: 1 })

    // evidently, it is called 2 times
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
