import React from 'react'

/**
 * Wrap the inner consumer with the consumer from ContextAPI
 *
 * @param {Element} InnerConsumer
 * @param {Context} ContextAPI
 * @returns {Element} outer consumer
 */
export function consumeContext(InnerConsumer, ContextAPI) {
  // Ignore falsy values to prevent unhandled errors.
  if (!ContextAPI) {
    return InnerConsumer
  }

  return ({ context: parentContext = {}, render }) => (
    <ContextAPI.Consumer>
      {context => (
        <InnerConsumer
          render={render}
          context={{
            ...parentContext,
            ...context
          }}
        />
      )}
    </ContextAPI.Consumer>
  )
}
