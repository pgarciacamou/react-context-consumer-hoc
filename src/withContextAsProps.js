import withContext from "./withContext"

const contextAsIs = context => context;

function withContextAsProps(...ContextAPIs) {
  return withContext(ContextAPIs, contextAsIs)
}

/**
 * Temporary workaround to fix react-redux issue with forwardRef.
 * This workaround will be removed on v3.
 *
 * Issue: https://github.com/pgarciacamou/react-context-consumer-hoc/issues/6
 */
function noRef(...ContextAPIs) {
  return ComposedComponent => {
    const Component = withContext(ContextAPIs, contextAsIs)(ComposedComponent)
    return (props) => (
      <Component {...props} />
    )
  }
}

withContextAsProps.noRef = noRef
export default withContextAsProps
