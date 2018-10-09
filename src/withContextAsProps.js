import withContext from "./withContext"

const mapContextToProps = context => context;

function withContextAsProps(...ContextAPIs) {
  return withContext(ContextAPIs, mapContextToProps)
}

/**
 * Temporary workaround to fix react-redux issue with forwardRef.
 * This workaround will be removed on v3.
 *
 * Issue: https://github.com/pgarciacamou/react-context-consumer-hoc/issues/6
 */
function noRef(...ContextAPIs) {
  return ComposedComponent => {
    const Component = withContext(ContextAPIs, mapContextToProps)(ComposedComponent)
    return (props) => (
      <Component {...props} />
    )
  }
}

withContextAsProps.noRef = noRef
export default withContextAsProps
