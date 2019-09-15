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

export default withContext
