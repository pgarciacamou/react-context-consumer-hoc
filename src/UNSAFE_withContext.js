import React from 'react'

/**
 * DEPRECATED
 * ==========
 *
 * This implementation has been deprecated since v2.0.0.
 * This implementation should be completely removed in v3.x.
 *
 * WARNING:
 *
 * Deconstructing the context into a new object causes issues with PureComponents
 * where it expects the object not to be mutated if nothing has changed.
 *
 * Furthermore, creating a new object is not flexible and can break immutability
 * of some projects that use ImmutableJS (or alike), as well as memoization.
 *
 * Use the new implementation of `withContext` (> v1.x) where you can specify
 * a selector function mapContextToProps.
 */

function consumeContext(ChildConsumer, ContextAPI) {
  return React.forwardRef(({ context: parentContext = {}, ...props }, ref) => (
    <ContextAPI.Consumer>
      {context => (
        <ChildConsumer
          {...props}
          ref={ref}
          context={{
            ...parentContext,
            ...context
          }}
        />
      )}
    </ContextAPI.Consumer>
  ))
}

// eslint-disable-next-line camelcase
function UNSAFE_withContext(...ContextAPIs) {
  return ComposedComponent => {
    // Recursively consume the APIs only once.
    return ContextAPIs.reduce(consumeContext, ComposedComponent)
  }
}

/**
 * Temporary workaround to fix react-redux issue with forwardRef.
 * This workaround will be removed on v3.
 *
 * Issue: https://github.com/pgarciacamou/react-context-consumer-hoc/issues/6
 */
function noRef(...ContextAPIs) {
  return ComposedComponent => {
    const Component = UNSAFE_withContext(...ContextAPIs)(ComposedComponent)
    return props => (<Component {...props} />)
  }
}

UNSAFE_withContext.noRef = noRef
// eslint-disable-next-line camelcase
export default UNSAFE_withContext
