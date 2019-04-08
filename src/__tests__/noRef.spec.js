/**
 * NOTE:
 * This file does not test "noRef.js" but all noRef workarounds across the library.
 *    - withContext.noRef
 *    - withContextAsProps.noRef
 *    - UNSAFE_withContext.noRef
 */

import React from 'react'
import { connect } from 'react-redux'
// eslint-disable-next-line camelcase
import UNSAFE_withContext from '../UNSAFE_withContext'
import withContext from '../withContext'
import withContextAsProps from '../withContextAsProps'

describe('noRef', () => {
  describe('withContext', () => {
    it('should forward the reference', () => {
      const ContextA = React.createContext({ a: 1 })
      const MyComponent = (props) => (<div {...props} />)

      expect(() => {
        connect()(
          withContext([ContextA], context => context)(MyComponent)
        )
      }).toThrow('You must pass a component to the function returned by connect. Instead received {}')
    })

    it('should not forward the reference', () => {
      const ContextA = React.createContext({ a: 1 })
      const MyComponent = (props) => (<div {...props} />)

      expect(() => {
        connect()(
          withContext.noRef([ContextA], context => context)(MyComponent)
        )
      }).not.toThrow()
    })
  })

  describe('withContextAsProps', () => {
    it('should forward the reference', () => {
      const ContextA = React.createContext({ a: 1 })
      const MyComponent = (props) => (<div {...props} />)

      expect(() => {
        connect()(
          withContextAsProps(ContextA)(MyComponent)
        )
      }).toThrow('You must pass a component to the function returned by connect. Instead received {}')
    })

    it('should not forward the reference', () => {
      const ContextA = React.createContext({ a: 1 })
      const MyComponent = (props) => (<div {...props} />)

      expect(() => {
        connect()(
          withContextAsProps.noRef(ContextA)(MyComponent)
        )
      }).not.toThrow()
    })
  })

  describe('UNSAFE_withContext', () => {
    it('should forward the reference', () => {
      const ContextA = React.createContext({ a: 1 })
      const MyComponent = (props) => (<div {...props} />)

      expect(() => {
        connect()(
          UNSAFE_withContext(ContextA)(MyComponent)
        )
      }).toThrow('You must pass a component to the function returned by connect. Instead received {}')
    })

    it('should not forward the reference', () => {
      const ContextA = React.createContext({ a: 1 })
      const MyComponent = (props) => (<div {...props} />)

      expect(() => {
        connect()(
          UNSAFE_withContext.noRef(ContextA)(MyComponent)
        )
      }).not.toThrow()
    })
  })
})
