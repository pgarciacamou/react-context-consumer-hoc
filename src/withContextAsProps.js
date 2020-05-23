import withContext from './withContext'

const mapContextToProps = (context) => context

function withContextAsProps(...ContextAPIs) {
  return withContext(ContextAPIs, mapContextToProps)
}

export default withContextAsProps
