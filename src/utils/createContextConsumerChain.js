import { consumeContext } from './consumeContext'

// Component that executes the render function with the consumed context
const InnermostComponent = ({ context, render }) => render(context)

// Recursively create a chain of consumers
export function createContextConsumerChain(ContextAPIs) {
  return ContextAPIs.reduce(consumeContext, InnermostComponent)
}
