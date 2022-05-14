import { createBrowserHistory, createMemoryHistory } from "history"
import * as queryString from "query-string"

const history =
  typeof window !== `undefined` ? createBrowserHistory() : createMemoryHistory()

const isPrimitiveType = function (a) {
  return (
    typeof a === `string` || typeof a === `number` || typeof a === `boolean`
  )
}

const getIdResolverPromise = function (
  urlState,
  resolvers,
  state,
  resolve,
  index = 0
) {
  if (state == null) {
    state = {}
  }
  if (resolve == null) {
    return new Promise(function (resolve) {
      return getIdResolverPromise(urlState, resolvers, state, resolve, index)
    })
  }
  let currentState = Object.assign({}, state)
  const currentUrlState = Object.assign({}, urlState)
  if (Object.keys(currentUrlState).length <= index) {
    resolve(currentState)
  } else {
    const key = Object.keys(currentUrlState)[index]
    if (typeof resolvers === `function`) {
      resolvers(key, currentUrlState[key], currentState).then(function (
        newState
      ) {
        currentState = newState
        getIdResolverPromise(
          currentUrlState,
          resolvers,
          currentState,
          resolve,
          index + 1
        )
      })
    } else if (resolvers[key] == null) {
      getIdResolverPromise(
        currentUrlState,
        resolvers,
        currentState,
        resolve,
        index + 1
      )
    } else if (typeof resolvers[key] === `function`) {
      resolvers[key](currentUrlState[key]).then(function (value) {
        currentState[key] = value
        getIdResolverPromise(
          currentUrlState,
          resolvers,
          currentState,
          resolve,
          index + 1
        )
      })
    }
  }
}

const getSearchString = function (state, toIdMappers) {
  if (Object.keys(state).length === 0) {
    return ``
  }
  return (
    `?` +
    Object.keys(state)
      .map(function (key) {
        if (typeof toIdMappers === `function`) {
          return toIdMappers(key, state)
        } else if (toIdMappers[key] == null) {
          if (isPrimitiveType(state[key])) {
            return (
              key +
              `=` +
              encodeURIComponent(state[key] != null ? state[key] : ``)
            )
          } else {
            throw `No id mapper provided for ${key}! You always need to provide a mapper if the value is not a primitive data type`
          }
        } else if (typeof toIdMappers[key] !== `function`) {
          throw `Id mapper of ${key} has to be a function!`
        } else {
          const value = toIdMappers[key](state[key])
          return key + `=` + encodeURIComponent(value != null ? value : ``)
        }
      })
      .filter((p) => p !== undefined && p !== null)
      .join(`&`)
  )
}

const convertToHistory = function (state, pathname, toIdMappers) {
  return {
    pathname: pathname,
    search: getSearchString(state, toIdMappers),
  }
}

const getCombinedUrlState = function (previousState, newUrlState) {
  const combinedUrlState = Object.assign({}, previousState)
  Object.keys(newUrlState).forEach(function (key) {
    combinedUrlState[key] = newUrlState[key]
  })
  return combinedUrlState
}

const initializedReactUrlState = function (options, callback) {
  const context = this
  if (options == null) {
    throw (
      `No options defined in initializeReactUrlState! ` +
      `You have to call the function by using currying like so: initializeReactUrlState(this)(options)`
    )
  }

  if (options.fromIdResolvers == null) {
    options.fromIdResolvers = {}
  }

  if (options.toIdMappers == null) {
    options.toIdMappers = {}
  }

  const setUrlState = function (urlState, callback) {
    if (options.debug) {
      console.log(
        `react-url-state: setting state: `,
        urlState,
        ` callback: `,
        callback
      )
    }
    context.setState(urlState, function () {
      const urlStateWithPreviousState = getCombinedUrlState(
        queryString.parse(history.location.search),
        urlState
      )
      const pathname = options.pathname || window.location.pathname
      history.push(
        convertToHistory(
          urlStateWithPreviousState,
          pathname,
          options.toIdMappers
        )
      )
      if (typeof callback === `function`) {
        callback.apply(context)
      }
    })
  }

  const urlState = Object.assign({}, queryString.parse(history.location.search))
  const state = {}
  Object.keys(context.state).forEach(function (key) {
    state[key] = context.state[key]
  })

  if (options.debug) {
    console.log(`react-url-state: getting id resolver promises..`)
  }

  getIdResolverPromise(urlState, options.fromIdResolvers).then((newState) => {
    if (options.leavestate === true) {
      callback.apply(context, [newState])
    } else {
      setUrlState(newState, callback)
    }
  })

  return {
    setUrlState: setUrlState,
  }
}

export const initializeReactUrlState = function (context) {
  return initializedReactUrlState.bind(context)
}
