import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import renderer from 'react-test-renderer'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import withContextAsProps from '../withContextAsProps'

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
      a: PropTypes.number.isRequired, // injected from ContextA
      b: PropTypes.number.isRequired, // injected from ContextB
      c: PropTypes.number.isRequired
    }

    render() {
      const { a, b, c } = this.props
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
  //   export default withContextAsProps(ContextA, ContextB)(SomeComponent)
  const Consumer = withContextAsProps(ContextA, ContextB)(SomeComponent)

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

  it('should not re-render PureComponents if props did not change', () => {
    const spy = jest.fn()
    const ContextA = React.createContext()
    const ContextB = React.createContext()

    class NakedPureComponent extends PureComponent {
      render() {
        spy() // should run once
        return (
          <div />
        )
      }
    }
    const Consumer = withContextAsProps(
      ContextA,
      ContextB
    )(NakedPureComponent)

    class App extends Component {
      constructor(props) {
        super(props)
        this.state = {
          // eslint-disable-next-line react/prop-types
          childContextB: { b: props.b }
        }

        // Keep reference to sabe context object to prevent re-renders
        this.childContextA = { a: 1 } // a doesn't change in this example
      }

      render() {
        return (
          <ContextA.Provider value={this.childContextA}>
            <ContextB.Provider value={this.state.childContextB}>
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
      <App b={2} />
    )

    wrapper.setState({ random: 1 })

    // evidently, it is called 1 times
    expect(spy).toHaveBeenCalledTimes(1)

    wrapper.setState({
      childContextB: {
        b: 22
      }
    })

    // called 2 times because there is an update in the PureComponent' props
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
