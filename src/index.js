import React from 'react'
import _ from 'lodash'

function consumeContext(ChildConsumer, ContextAPI) {
  // eslint-disable-next-line
  return function Consumer({ context: parentContext = {}, ...props }) {
    return (
      <ContextAPI.Consumer>
        {context => (
          <ChildConsumer
            {...props}
            context={_.extend({}, parentContext, context)}
          />
        )}
      </ContextAPI.Consumer>
    )
  }
}

function ContextConsumerHOC(...ContextAPIs) {
  return ComposedComponent => {
    // Recursively consume the APIs only once.
    const ContextWrappedComponent = _.reduce(
      ContextAPIs,
      consumeContext,
      ComposedComponent
    )

    return function ComponentEnhancedWithContextConsumerHOC(props) {
      return <ContextWrappedComponent {...props} />
    }
  }
}

export default ContextConsumerHOC
