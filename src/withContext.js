import React from 'react'
import { createContextConsumerChain } from './utils/createContextConsumerChain'

function withContext(ContextAPIs, mapContextToProps) {
  const ConsumerChain = createContextConsumerChain(ContextAPIs)

  return ComposedComponent => React.forwardRef((props, ref) => (
    <ConsumerChain
      // This prop is passed down through the consumer chain and will only
      // be executed by the InnermostComponent this way we use React forwardRef
      // only once at the top level.
      render={context => (
        <ComposedComponent
          {...props}
          {...mapContextToProps(context, props)}
          ref={ref}
        />
      )}
    />
  ))
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
