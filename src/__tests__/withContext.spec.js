import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import renderer from 'react-test-renderer'
import { createSelector } from 'reselect'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import withContext from '../withContext'

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
    const Consumer = withContext(
      ContextA,
      ContextB
    )(NakedPureComponent)

    class App extends Component {
      constructor(props) {
        super(props)
        this.state = {
          childContextB: { b: props.b }
        }

        // Keep reference to sabe context object to prevent re-renders
        this.childContextA = { a: 1 } // a doesn't change in this example
      }

      componentDidUpdate(prevProps) {
        if(this.props.b !== prevProps.b) {
        }
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

  it('allows creating namespace selectors for individual context', () => {
    const contextA = { a: 1 }
    const contextB = { b: 2 }

    const ContextA = React.createContext()
    const ContextB = React.createContext()

    function NakedComponent (props) {
      return (
        <div className='component' {...props} />
      )
    }

    const App = withContext(
      [ContextA, 'awrap'], // same as: (context) => ({ awrap: context })
      ContextB
    )(NakedComponent)

    const wrapper = mount(
      <ContextA.Provider value={contextA}>
        <ContextB.Provider value={contextB}>
          <App />
        </ContextB.Provider>
      </ContextA.Provider>
    )

    const component = wrapper.find('.component')

    expect(component.prop('awrap')).toEqual(contextA)
    expect(component.prop('b')).toEqual(2)
  })

  it('allows creating a function selector for individual context', () => {
    const contextA = { a: 1 }
    const contextB = { b: 2 }

    const ContextA = React.createContext()
    const ContextB = React.createContext()

    const NakedComponent = (props) => (
      <div className='component' {...props} />
    )

    const App = withContext(
      [ContextA, (context) => ({ awrap: context })],
      ContextB
    )(NakedComponent)

    const wrapper = mount(
      <ContextA.Provider value={contextA}>
        <ContextB.Provider value={contextB}>
          <App />
        </ContextB.Provider>
      </ContextA.Provider>
    )

    const component = wrapper.find('.component')

    expect(component.prop('awrap')).toEqual(contextA)
    expect(component.prop('b')).toEqual(2)
  })

  it('allows using memoization with reselect', () => {
    const spy = jest.fn()

    // selectors
    const _getPropA = (context) => context.a
    const _getPropB = (context) => context.b
    const getA = createSelector([_getPropA], (a) => ({ a }))

    // simple example
    const contextA = { a: 1, b: 2, c: 3 }
    const ContextA = React.createContext(contextA)

    const NakedComponent = (props) => {
      spy(props)
      return (
        <div className='component' {...props} />
      )
    }

    const App = withContext([ContextA, getA])(NakedComponent)

    const wrapper = mount(
      <ContextA.Provider value={contextA}>
        <App />
      </ContextA.Provider>
    )

    const component = wrapper.find('.component')

    expect(component.prop('a')).toEqual(contextA.a)
    expect(component.prop('b')).toBeUndefined()
    expect(component.prop('c')).toBeUndefined()
    expect(spy).toHaveBeenCalledWith(getA(contextA))
  })

  it('allows using memoization with reselect 2 (test using PureComponent)', () => {
    const spy = jest.fn()

    // selectors
    const _getPropA = (context) => context.a
    const _getPropB = (context) => context.b
    const getAandB = createSelector([_getPropA, _getPropB], (a, b) => ({ a, b }))

    // simple example
    const contextA = { a: 1, b: 2, c: 3 }
    const ContextA = React.createContext(contextA)

    // Because naked component doesn't care about prop 'c',
    // it only renders if 'a' or 'b' change, as expected.
    class NakedComponent extends PureComponent {
      render() {
        spy(this.props)
        return (
          <div className='component' {...this.props} />
        )
      }
    }

    const App = withContext(
      [ContextA, getAandB]
    )(NakedComponent)

    const Root = (props) => (
      <ContextA.Provider value={{ ...contextA, ...props }}>
        <App />
      </ContextA.Provider>
    )
    const wrapper = mount(
      <Root c={3} />
    )

    wrapper.setProps({ c: 4 })

    const component = wrapper.find('.component')

    expect(component.prop('a')).toEqual(contextA.a)
    expect(component.prop('b')).toEqual(contextA.b)
    expect(component.prop('c')).toBeUndefined()
    expect(spy).toHaveBeenCalledWith(getAandB(contextA))
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should throw if arguments are not correct', () => {
    expect(() => {
      withContext()('div') // wrong number of arguments
    }).toThrow('Looks like you forgot to pass a ContextAPI to react-context-consumer-hoc.')
    expect(() => {
      withContext(
        React.createContext()
      )() // not valid Component
    }).toThrow('Looks like you forgot to pass a Component to react-context-consumer-hoc.')
    expect(() => {
      withContext(
        {} // not valid context
      )('div')
    }).toThrow('Expected a valid context but got "undefined".')
    expect(() => {
      withContext(
        [] // not valid context
      )('div')
    }).toThrow('Expected a valid context but got "undefined".')
    expect(() => {
      withContext(
        [React.createContext(), null] // not valid consumer
      )('div')
    }).toThrow('Expected selector to be a function or a string but got "object".')
    expect(() => {
      withContext(
        [3] // not valid consumer
      )('div')
    }).toThrow('Expected a valid context but got "3".')
  })

})
