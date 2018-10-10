import React from 'react'
import renderer from 'react-test-renderer'
import { createContextConsumerChain } from '../createContextConsumerChain'

describe('createContextConsumerChain', () => {
  it('calls the render function prop with the context', () => {
    const childContextA = { a: 1 }
    const ContextA = React.createContext(childContextA)
    const ConsumerChain = createContextConsumerChain([ContextA])

    const tree = renderer.create(
      <ContextA.Provider value={childContextA}>
        <ConsumerChain
          render={context => {
            expect(context).toEqual(childContextA)
            return (
              <div {...context} />
            )
          }}
        />
      </ContextA.Provider>
    )

    expect(tree.toJSON()).toMatchSnapshot()
  })

  it('creates a chain of consumers', () => {
    const childContextA = { a: 1 }
    const childContextB = { b: 1 }
    const ContextA = React.createContext(childContextA)
    const ContextB = React.createContext(childContextB)
    const ConsumerChain = createContextConsumerChain([ContextA, ContextB])

    const tree = renderer.create(
      <ContextA.Provider value={childContextA}>
        <ContextB.Provider value={childContextB}>
          <ConsumerChain
            render={context => {
              expect(context).toEqual({
                ...childContextA,
                ...childContextB
              })
              return (
                <div {...context} />
              )
            }}
          />
        </ContextB.Provider>
      </ContextA.Provider>
    )

    expect(tree.toJSON()).toMatchSnapshot()
  })
})
