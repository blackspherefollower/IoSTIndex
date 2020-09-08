/* eslint-disable no-invalid-this */
// Sourced from https://gist.github.com/laytong/e2aeecf32283c3a1ab6edf8e38a78903#gistcomment-2881609
import React, { Component } from "react"
import debounce from "lodash/debounce"

export default function debouncedInput(
  WrappedComponent,
  config = { timeout: 500 }
) {
  return class DebouncedTextField extends Component {
    constructor(props) {
      super(props)
      this.state = {
        value: this.props.value,
      }
      this.sendTextChange = debounce(this.sendTextChange, config.timeout)
    }

    handleTextChange = (e) => {
      this.setState({ value: e.target.value })
      this.sendTextChange({ target: { value: e.target.value } })
    }

    sendTextChange = (e) => {
      this.props.onChange(e)
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          value={this.state.value}
          onChange={this.handleTextChange.bind(this)}
        />
      )
    }
  }
}
