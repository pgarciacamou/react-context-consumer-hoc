import withContext from "./withContext"

export default function withContextAsProps(...ContextAPIs) {
  return withContext(ContextAPIs, context => context)
}
