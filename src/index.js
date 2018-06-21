import React, { Component } from 'react'
import _ from 'lodash'

export default function ContextConsumerHOC(...ContextAPIs) {
  return ComposedComponent => {
    class ComponentEnhancedWithContextConsumerHOC extends Component {
      consumerReducer = (ChildComponent, ContextAPI) => {
        return NewComponent => {
          const { context: parentContext = {}, ...props } = NewComponent
          return (
            <ContextAPI.Consumer>
              {context => (
                <ChildComponent
                  {...props}
                  context={_.extend({}, parentContext, context)}
                />
              )}
            </ContextAPI.Consumer>
          )
        }
      };

      render() {
        // Recursively consume the APIs.
        const ContextWrappedComponent = _.reduce(
          ContextAPIs,
          this.consumerReducer,
          ComposedComponent
        )

        return <ContextWrappedComponent {...this.props} />
      }
    }

    return ComponentEnhancedWithContextConsumerHOC
  }
}
