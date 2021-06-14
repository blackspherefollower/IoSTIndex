/* eslint-disable no-invalid-this */
// Sourced from https://gist.github.com/laytong/e2aeecf32283c3a1ab6edf8e38a78903#gistcomment-2881609
import React, { useState } from "react"
import debounce from "lodash/debounce"

const debouncedInput =
  (Component, timeout = 500) =>
  ({ onChange, value, ...props }) => {
    const [debouncedValue, setValue] = useState(value)
    const handleTextChange = (e) => {
      setValue(e.target.value)
      sendTextChange(e)
    }
    const sendTextChange = debounce((newValue) => onChange(newValue), timeout)

    return (
      <Component
        {...props}
        onChange={handleTextChange}
        value={debouncedValue}
      />
    )
  }

export default debouncedInput
