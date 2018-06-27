import React from 'react'
import consume from '../'
import renderer from 'react-test-renderer'

function setup() {
  function Component({ context: { a, b } }) {
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

  const tree = renderer.create(
    <ContextA.Provider value={{ a: 1 }}>
      <ContextB.Provider value={{ b: 2 }}>
        <div className='stuff'>some other content</div>
        <div className='nested element'>
          <Consumer />
        </div>
      </ContextB.Provider>
    </ContextA.Provider>
  )

  return {
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
})
