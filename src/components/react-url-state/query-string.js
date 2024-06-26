const _slicedToArray = (function () {
  function sliceIterator(arr, i) {
    const _i = arr[Symbol.iterator]()
    let _s
    const _arr = []
    let _n = true
    let _d = false
    let _e = undefined
    try {
      for (; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value)
        if (i && _arr.length === i) break
      }
    } catch (err) {
      _d = true
      _e = err
    } finally {
      try {
        if (!_n && _i[`return`]) _i[`return`]()
      } finally {
        if (_d) throw _e
      }
    }
    return _arr
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i)
    } else {
      throw new TypeError(
        `Invalid attempt to destructure non-iterable instance`
      )
    }
  }
})()

const _typeof =
  typeof Symbol === `function` && typeof Symbol.iterator === `symbol`
    ? function (obj) {
        return typeof obj
      }
    : function (obj) {
        return obj &&
          typeof Symbol === `function` &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? `symbol`
          : typeof obj
      }

const strictUriEncode = require(`./strict-uri-encode`)
const decodeComponent = require(`decode-uri-component`)

function encoderForArrayFormat(options) {
  switch (options.arrayFormat) {
    case `index`:
      return function (key, value, index) {
        return value === null
          ? [encode(key, options), `[`, index, `]`].join(``)
          : [
              encode(key, options),
              `[`,
              encode(index, options),
              `]=`,
              encode(value, options),
            ].join(``)
      }
    case `bracket`:
      return function (key, value) {
        return value === null
          ? [encode(key, options), `[]`].join(``)
          : [encode(key, options), `[]=`, encode(value, options)].join(``)
      }
    default:
      return function (key, value) {
        return value === null
          ? encode(key, options)
          : [encode(key, options), `=`, encode(value, options)].join(``)
      }
  }
}

function parserForArrayFormat(options) {
  let result = void 0

  switch (options.arrayFormat) {
    case `index`:
      return function (key, value, accumulator) {
        result = /\[(\d*)\]$/.exec(key)

        key = key.replace(/\[\d*\]$/, ``)

        if (!result) {
          accumulator[key] = value
          return
        }

        if (accumulator[key] === undefined) {
          accumulator[key] = {}
        }

        accumulator[key][result[1]] = value
      }
    case `bracket`:
      return function (key, value, accumulator) {
        result = /(\[\])$/.exec(key)
        key = key.replace(/\[\]$/, ``)

        if (!result) {
          accumulator[key] = value
          return
        }

        if (accumulator[key] === undefined) {
          accumulator[key] = [value]
          return
        }

        accumulator[key] = [].concat(accumulator[key], value)
      }
    default:
      return function (key, value, accumulator) {
        if (accumulator[key] === undefined) {
          accumulator[key] = value
          return
        }

        accumulator[key] = [].concat(accumulator[key], value)
      }
  }
}

function encode(value, options) {
  if (options.encode) {
    return options.strict ? strictUriEncode(value) : encodeURIComponent(value)
  }

  return value
}

function decode(value, options) {
  if (options.decode) {
    return decodeComponent(value)
  }

  return value
}

function keysSorter(input) {
  if (Array.isArray(input)) {
    return input.sort()
  }

  if (
    (typeof input === `undefined` ? `undefined` : _typeof(input)) === `object`
  ) {
    return keysSorter(Object.keys(input))
      .sort(function (a, b) {
        return Number(a) - Number(b)
      })
      .map(function (key) {
        return input[key]
      })
  }

  return input
}

function extract(input) {
  const queryStart = input.indexOf(`?`)
  if (queryStart === -1) {
    return ``
  }
  return input.slice(queryStart + 1)
}

function parse(input, options) {
  const _iterator = input.split(`&`)[Symbol.iterator]()
  let _step
  options = Object.assign({ decode: true, arrayFormat: `none` }, options)

  const formatter = parserForArrayFormat(options)

  // Create an object with no prototype
  const ret = Object.create(null)

  if (typeof input !== `string`) {
    return ret
  }

  input = input.trim().replace(/^[?#&]/, ``)

  if (!input) {
    return ret
  }

  let _iteratorNormalCompletion = true
  let _didIteratorError = false
  let _iteratorError = undefined

  try {
    for (
      ;
      !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
      _iteratorNormalCompletion = true
    ) {
      const param = _step.value

      const _param$replace$split = param.replace(/\+/g, ` `).split(`=`)
      const _param$replace$split2 = _slicedToArray(_param$replace$split, 2)
      const key = _param$replace$split2[0]
      let value = _param$replace$split2[1]

      // Missing `=` should be `null`:
      // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters

      value = value === undefined ? null : decode(value, options)

      formatter(decode(key, options), value, ret)
    }
  } catch (err) {
    _didIteratorError = true
    _iteratorError = err
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return()
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError
      }
    }
  }

  return Object.keys(ret)
    .sort()
    .reduce(function (result, key) {
      const value = ret[key]
      if (
        Boolean(value) &&
        (typeof value === `undefined` ? `undefined` : _typeof(value)) ===
          `object` &&
        !Array.isArray(value)
      ) {
        // Sort object keys, not values
        result[key] = keysSorter(value)
      } else {
        result[key] = value
      }

      return result
    }, Object.create(null))
}

exports.extract = extract
exports.parse = parse

exports.stringify = function (obj, options) {
  const defaults = {
    encode: true,
    strict: true,
    arrayFormat: `none`,
  }

  options = Object.assign(defaults, options)

  if (options.sort === false) {
    options.sort = function () {}
  }

  const formatter = encoderForArrayFormat(options)

  return obj
    ? Object.keys(obj)
        .sort(options.sort)
        .map(function (key) {
          const value = obj[key]

          if (value === undefined) {
            return ``
          }

          if (value === null) {
            return encode(key, options)
          }

          if (Array.isArray(value)) {
            const result = []

            let _iteratorNormalCompletion2 = true
            let _didIteratorError2 = false
            let _iteratorError2 = undefined

            try {
              for (
                var _iterator2 = value.slice()[Symbol.iterator](), _step2;
                !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next())
                  .done);
                _iteratorNormalCompletion2 = true
              ) {
                const value2 = _step2.value

                if (value2 === undefined) {
                  continue
                }

                result.push(formatter(key, value2, result.length))
              }
            } catch (err) {
              _didIteratorError2 = true
              _iteratorError2 = err
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return()
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2
                }
              }
            }

            return result.join(`&`)
          }

          return encode(key, options) + `=` + encode(value, options)
        })
        .filter(function (x) {
          return x.length > 0
        })
        .join(`&`)
    : ``
}

exports.parseUrl = function (input, options) {
  return {
    url: input.split(`?`)[0] || ``,
    query: parse(extract(input), options),
  }
}
