import React from 'react'
import renderer from 'react-test-renderer'
import { consumeContext } from '../consumeContext'

describe('createContextConsumerChain', () => {
  it('matches snapshot', () => {
    const previousContext = { b: 2 }
    const childContextA = { a: 1 }
    const ContextA = React.createContext(childContextA)

    const Consumer = consumeContext(
      function InnerConsumer({ context, render, ...thisShouldBeEmpty }) {
        expect(thisShouldBeEmpty).toEqual({})
        return (<div {...context} render={render} {...thisShouldBeEmpty} />)
      },
      ContextA
    )

    const tree = renderer.create(
      <ContextA.Provider value={childContextA}>
        <Consumer context={previousContext} render={() => {}} />
      </ContextA.Provider>
    )

    expect(tree).toMatchSnapshot()
  })

  it('renders inner consumer with context and passes render function', () => {
    const spy = jest.fn((context) => null)
    const previousContext = { b: 2 }
    const childContextA = { a: 1 }
    const consumedContext = { ...previousContext, ...childContextA }
    const ContextA = React.createContext(childContextA)

    const Consumer = consumeContext(
      function InnerConsumer({ context, render }) {
        expect(context).toEqual(consumedContext) // passes and adds context
        expect(render).toEqual(spy) // passes render
        return render(context)
      },
      ContextA
    )

    renderer.create(
      <ContextA.Provider value={childContextA}>
        <Consumer context={previousContext} render={spy} />
      </ContextA.Provider>
    )

    expect(spy).toHaveBeenCalledTimes(1) // must render the InnerConsumer
    expect(spy).toHaveBeenCalledWith(consumedContext) // render fn executed correctly
  })

  it('it will not override context but add it up', () => {
    const previousContext = { b: 2 }
    const childContextA = { a: 1 }
    const ContextA = React.createContext(childContextA)

    const InnerConsumer = ({ context }) => {
      expect(context).not.toEqual(previousContext) // did not override context prop
      expect(context).not.toEqual(childContextA) // did not override context prop
      return null
    }
    const Consumer = consumeContext(InnerConsumer, ContextA)

    renderer.create(
      <ContextA.Provider value={childContextA}>
        <Consumer context={previousContext} />
      </ContextA.Provider>
    )
  })
})
