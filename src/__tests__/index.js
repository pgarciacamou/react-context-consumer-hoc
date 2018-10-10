import * as index from "../index";

describe('index.js', () => {
  it('exposes correct APIs', () => {
    const {
      // Top-level API
      withContext,
      withContextAsProps,
      UNSAFE_withContext,

      // Inner utilities
      createContextConsumerChain,

      // Check that no unneeded APIs are exposed
      ...thisShouldBeEmpty
    } = index

    expect(withContext).not.toBeUndefined()
    expect(withContextAsProps).not.toBeUndefined()
    expect(UNSAFE_withContext).not.toBeUndefined()
    expect(createContextConsumerChain).not.toBeUndefined()
    expect(thisShouldBeEmpty).toEqual({})
  })
})
