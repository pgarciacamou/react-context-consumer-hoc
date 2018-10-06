import React from 'react'
import { getOptions } from './utils/getOptions';

function consumeContext(ChildConsumer, ContextAPI) {
  // Ignore falsy values to prevent unhandled errors.
  // Only Arrays and React Context are allowed.
  if (!ContextAPI) {
    return ChildConsumer;
  }

  const { selector, consumer: Consumer } = getOptions(ContextAPI);

  return React.forwardRef((props, ref) => (
    <Consumer>
      {context => (
        <ChildConsumer
          {...props}
          {...selector(context)}
          ref={ref}
        />
      )}
    </Consumer>
  ))
}

function withContext(...ContextAPIs) {
  return ComposedComponent => {
    // Recursively consume the APIs only once.
    return ContextAPIs.reduce(consumeContext, ComposedComponent)
  }
}

export default withContext;
