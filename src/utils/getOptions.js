import isString from 'lodash.isstring';

export function getOptions(ContextAPI) {
  const hasOptions = Array.isArray(ContextAPI)

  if (hasOptions) {
    return {
      consumer: ContextAPI[0].Consumer,
      selector: isString(ContextAPI[1])
        ? context => ({ [ContextAPI[1]]: context })
        : ContextAPI[1]
    };
  } else {
    return {
      consumer: ContextAPI.Consumer,
      selector: context => context
    };
  }
}
