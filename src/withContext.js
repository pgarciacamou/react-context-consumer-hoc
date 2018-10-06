import React from 'react'
import invariant from 'invariant'
import * as ReactIs from 'react-is'
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
  invariant(
    ContextAPIs.length > 0,
    'Looks like you forgot to pass a ContextAPI to react-context-consumer-hoc.'
  )

  return ComposedComponent => {
    invariant(
      !!ComposedComponent &&
      ReactIs.isValidElementType(ComposedComponent),
      'Looks like you forgot to pass a Component to react-context-consumer-hoc.'
    )

    // Recursively consume the APIs only once.
    return ContextAPIs.reduce(consumeContext, ComposedComponent)
  }
}

export default withContext;
