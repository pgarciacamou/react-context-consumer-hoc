import React from 'react'
import * as ReactIs from 'react-is'
import invariant from 'invariant'
import isString from 'lodash.isstring'
import isFunction from 'lodash.isfunction'

export function checkArgumentsValidity(ContextAPI, hasOptions) {
  // Validate Consumer
  const Consumer = hasOptions
    ? ContextAPI[0] && ContextAPI[0].Consumer
    : ContextAPI.Consumer;
  invariant(
    !!Consumer,
    `Expected a valid context but got "${ContextAPI[0]}".`
  )
  invariant(
    ReactIs.isValidElementType(Consumer) &&
    ReactIs.isContextConsumer(<Consumer />),
    `Expected a valid consumer but got "${typeof Consumer}".`
  )

  // Validate selector
  const selector = hasOptions ? ContextAPI[1] : ''
  invariant(
    isFunction(selector) || isString(selector),
    `Expected selector to be a function or a string but got "${typeof selector}".`
  )
}
