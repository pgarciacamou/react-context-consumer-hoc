import React from 'react'

function consumeContext(ChildConsumer, ContextAPI) {
  // eslint-disable-next-line
  return function Consumer({ context: parentContext = {}, ...props }) {
    return (
      <ContextAPI.Consumer>
        {context => (
          <ChildConsumer
            {...props}
            context={{
              ...parentContext,
              ...context
            }}
          />
        )}
      </ContextAPI.Consumer>
    )
  }
}

function ContextConsumerHOC(...ContextAPIs) {
  return ComposedComponent => {
    // Recursively consume the APIs only once.
    return ContextAPIs.reduce(consumeContext, ComposedComponent)
  }
}

export default ContextConsumerHOC
