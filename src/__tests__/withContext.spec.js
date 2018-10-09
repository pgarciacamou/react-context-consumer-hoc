import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import renderer from 'react-test-renderer'
import { createSelector, createStructuredSelector } from 'reselect'
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
  //   export default withContext(...)(SomeComponent)
  const Consumer = withContext(
    [ContextA, ContextB],
    function mapContextToProps(context) {
      return context
    }
  )(SomeComponent)

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

  it('should pass ownProps to mapContextToProps', () => {
    const props = { b: 2 }
    const childContextA = { a: 1 }
    const ContextA = React.createContext(childContextA)
    const Consumer = withContext(
      [ContextA],
      (context, ownProps) => {
        expect(ownProps).toEqual(props)
        return {}
      }
    )((props) => (<div {...props} />))

    const tree = renderer.create(
      <ContextA.Provider value={childContextA}>
        <Consumer {...props} />
      </ContextA.Provider>
    )

    expect(tree.toJSON()).toMatchSnapshot()
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
      [ContextA, ContextB],
      function mapContextToProps(context) {
        return context;
      }
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
      [ContextA, ContextB],
      function mapContextToProps({ a, b }) {
        return {
          awrap: { a }, // WARNING: this creates a new object, use some type of memoization
          b
        }
      }
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
    const getA = (context) => context.a

    // simple example
    const contextA = { a: 1, b: 2, c: 3 }
    const ContextA = React.createContext(contextA)

    const NakedComponent = (props) => {
      spy(props)
      return (
        <div className='component' {...props} />
      )
    }

    const App = withContext(
      [ContextA],
      function mapContextToProps(context) {
        return {
          a: getA(context)
        }
      }
    )(NakedComponent)

    const wrapper = mount(
      <ContextA.Provider value={contextA}>
        <App />
      </ContextA.Provider>
    )

    const component = wrapper.find('.component')

    expect(component.prop('a')).toEqual(contextA.a)
    expect(component.prop('b')).toBeUndefined()
    expect(component.prop('c')).toBeUndefined()
    expect(spy).toHaveBeenCalledWith({ a: 1 })
  })

  it('allows using memoization with reselect 2 (test using PureComponent)', () => {
    const spy = jest.fn()

    // selectors
    const getB = (context) => context.b
    const getC = (context) => context.c
    const getD = createSelector([getB, getC], (b, c) => b + c)

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
      [ContextA],
      function mapContextToProps(context) {
        return {
          d: getD(context)
        }
      }
    )(NakedComponent)

    const Root = (props) => (
      <ContextA.Provider value={{ ...contextA, ...props }}>
        <App />
      </ContextA.Provider>
    )
    const wrapper = mount(
      <Root c={3} />
    )

    wrapper.setProps({ a: 2 })

    const component = wrapper.find('.component')

    expect(component.prop('a')).toBeUndefined()
    expect(component.prop('b')).toBeUndefined()
    expect(component.prop('c')).toBeUndefined()
    expect(component.prop('d')).toEqual(contextA.b + contextA.c)
    expect(spy).toHaveBeenCalledWith({ d: contextA.b + contextA.c })
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('allows using memoization with reselect 3 (namespaces with createStructuredSelector)', () => {
    const spy = jest.fn()

    // selectors
    const getB = (context) => context.b
    const getC = (context) => context.c
    const getD = createSelector([getB, getC], (b, c) => b + c)

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
      [ContextA],
      createStructuredSelector({
        context: createStructuredSelector({
          d: getD
        })
      })
    )(NakedComponent)

    const Root = (props) => (
      <ContextA.Provider value={{ ...contextA, ...props }}>
        <App />
      </ContextA.Provider>
    )
    const wrapper = mount(
      <Root c={3} />
    )

    wrapper.setProps({ a: 2 })

    const component = wrapper.find('.component')

    expect(component.prop('context').a).toBeUndefined()
    expect(component.prop('context').b).toBeUndefined()
    expect(component.prop('context').c).toBeUndefined()
    expect(component.prop('context').d).toEqual(contextA.b + contextA.c)
    expect(spy).toHaveBeenCalledWith({ context: { d: contextA.b + contextA.c } })
    expect(spy).toHaveBeenCalledTimes(1)
  })

})
