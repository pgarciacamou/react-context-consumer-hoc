import React from 'react'

function consumeContext(InnerConsumer, ContextAPI) {
  // Ignore falsy values to prevent unhandled errors.
  // Only Arrays and React Context are allowed.
  if (!ContextAPI) {
    return InnerConsumer;
  }

  return React.forwardRef(({
    __context_accum__: parentContext = {},
    ...ownProps
  }, ref) => (
    <ContextAPI.Consumer>
      {context => (
        <InnerConsumer
          {...ownProps}
          __context_accum__={{
            ...parentContext,
            ...context
          }}
          ref={ref}
        />
      )}
    </ContextAPI.Consumer>
  ))
}

function withContext(ContextAPIs, mapContextToProps) {
  return ComposedComponent => {
    // Recursively consume the APIs only once.
    return ContextAPIs.reduce(
      consumeContext,
      React.forwardRef(({
        __context_accum__: raw,
        ...ownProps
      }, ref) => (
        <ComposedComponent
          {...ownProps}
          {...mapContextToProps(raw, ownProps)}
          ref={ref}
        />
      ))
    )
  }
}

/**
 * Temporary workaround to fix react-redux issue with forwardRef.
 * This workaround will be removed on v3.
 *
 * Issue: https://github.com/pgarciacamou/react-context-consumer-hoc/issues/6
 */
function noRef(ContextAPIs, mapContextToProps) {
  return ComposedComponent => {
    const Component = withContext(ContextAPIs, mapContextToProps)(ComposedComponent)
    return props => (<Component {...props} />)
  }
}

withContext.noRef = noRef
export default withContext
