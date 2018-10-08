import React from 'react'

function consumeContext(InnerConsumer, ContextAPI) {
  // Ignore falsy values to prevent unhandled errors.
  // Only Arrays and React Context are allowed.
  if (!ContextAPI) {
    return InnerConsumer;
  }

  return React.forwardRef(({
    __context_accum__: parentContext = {},
    ...props
  }, ref) => (
    <ContextAPI.Consumer>
      {context => (
        <InnerConsumer
          {...props}
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

function withContext(ContextAPIs, selector) {
  return ComposedComponent => {
    // Recursively consume the APIs only once.
    return ContextAPIs.reduce(
      consumeContext,
      React.forwardRef(({ __context_accum__: raw, ...props }, ref) => (
        <ComposedComponent
          {...props}
          {...selector(raw)}
          ref={ref}
        />
      ))
    )
  }
}

export default withContext;
