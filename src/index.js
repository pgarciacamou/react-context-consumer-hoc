import React from 'react'

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

function ContextConsumerHOC(...ContextAPIs) {
  return ComposedComponent => {
    // Recursively consume the APIs only once.
    return ContextAPIs.reduce(consumeContext, ComposedComponent)
  }
}

export default ContextConsumerHOC
