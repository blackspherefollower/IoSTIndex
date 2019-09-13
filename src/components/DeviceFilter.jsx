import React from "react"
import { Form, Navbar, NavDropdown } from "react-bootstrap"
import NavLink from "react-bootstrap/NavLink"

class DeviceFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    if (this.props.filter.urlData !== undefined) {
      switch (this.props.filter.field) {
        case `Brand`:
        case `Device`:
          this.handleSearchChange({
            target: { value: decodeURI(this.props.filter.urlData) },
          })
          break

        case `ButtplugSupport`:
          if (!isNaN(parseInt(this.props.filter.urlData, 10))) {
            this.handleBpChange(
              { target: { checked: true } },
              parseInt(this.props.filter.urlData, 10)
            )
          }
          break
      }
    }
  }

  handleFieldChange = event => {
    this.props.onChange(this.props.ident, { field: event.target.value })
  }

  doTextFilter = (data, filter) =>
    data[filter.field].match(new RegExp(filter.search, `i`)) !== null

  handleSearchChange = event => {
    this.props.onChange(this.props.ident, {
      field: this.props.filter.field,
      search: event.target.value,
      filterData: this.doTextFilter,
      toUrl: () => encodeURI(this.props.filter.search),
    })
  }

  doBpFilter = (data, filter) =>
    (data.Buttplug.ButtplugSupport & filter.bpSupport) !== 0

  handleBpChange = (event, mode) => {
    this.props.onChange(this.props.ident, {
      field: this.props.filter.field,
      bpSupport:
        (this.props.filter.bpSupport &= ~mode) |
        (event.target.checked ? mode : 0),
      filterData: this.doBpFilter,
      toUrl: () => this.props.filter.bpSupport,
    })
  }

  doFeatureFilter = (data, filter) => {
    for (let i of filter.features.Inputs) {
      if (
        data.Features.Inputs[i] === undefined ||
        data.Features.Inputs[i] === null ||
        data.Features.Inputs[i] === 0 ||
        data.Features.Inputs[i] === `0` ||
        data.Features.Inputs[i].length === 0
      ) {
        return false
      }
    }
    for (let i of filter.features.Outputs) {
      if (
        data.Features.Outputs[i] === undefined ||
        data.Features.Outputs[i] === null ||
        data.Features.Outputs[i] === 0 ||
        data.Features.Outputs[i] === `0` ||
        data.Features.Outputs[i].length === 0
      ) {
        return false
      }
    }
    return true
  }

  handleFeatureChange = (event, type, feature) => {
    let features = { Inputs: [], Outputs: [] }
    if (this.props.filter.features !== undefined) {
      features.Inputs = [...this.props.filter.features.Inputs]
      features.Outputs = [...this.props.filter.features.Outputs]
    }
    let pos = features[type].indexOf(feature)
    if (pos === -1) {
      features[type].push(feature)
    } else {
      features[type].splice(pos, 1)
    }

    this.props.onChange(this.props.ident, {
      field: this.props.filter.field,
      features: features,
      filterData: this.doFeatureFilter,
    })
  }

  render() {
    return (
      <Navbar>
        <Navbar.Collapse>
          <Navbar.Text>
            <Form.Control
              as="select"
              value={this.props.filter.field}
              onChange={e => this.handleFieldChange(e)}
            >
              <option value={`none`}>Choose a field:</option>
              <option value={`Brand`}>Brand</option>
              <option value={`Device`}>Device Name</option>
              <option value={`Availability`}>Availability</option>
              <option value={`Connection`}>Connectivity</option>
              <option value={`Type`}>Form Factor</option>
              <option value={`ButtplugSupport`}>Buttplug Support</option>
              <option value={`Features`}>`Features</option>
            </Form.Control>
          </Navbar.Text>
          {(this.props.filter.field === `Brand` ||
            this.props.filter.field === `Device`) && (
            <Navbar.Text>
              <Form.Control
                as="input"
                value={this.props.filter.search ? this.props.filter.search : ``}
                onChange={e => this.handleSearchChange(e)}
              />
            </Navbar.Text>
          )}
          {this.props.filter.field === `ButtplugSupport` && (
            <Navbar.Text>
              <Form.Check
                inline
                label="C#"
                onChange={e => this.handleBpChange(e, 1)}
                checked={this.props.filter.bpSupport & 1}
              />
              <Form.Check
                inline
                label="JS"
                onChange={e => this.handleBpChange(e, 2)}
                checked={this.props.filter.bpSupport & 2}
              />
            </Navbar.Text>
          )}
          {this.props.filter.field === `Features` && (
            <NavDropdown title="Outputs" id="nav-out-dropdown">
              {this.props.filterData.Features !== undefined &&
                this.props.filterData.Features.Outputs.map((feat, i) => (
                  <NavDropdown.Item
                    key={i}
                    onClick={e => this.handleFeatureChange(e, `Outputs`, feat)}
                  >
                    {this.props.filter.features !== undefined &&
                      this.props.filter.features.Outputs.find(
                        x => x == feat
                      ) !== undefined && (
                        <span
                          className="oi oi-check"
                          title="icon check"
                          aria-hidden="true"
                        />
                      )}
                    {feat}
                  </NavDropdown.Item>
                ))}
            </NavDropdown>
          )}
          {this.props.filter.field === `Features` && (
            <NavDropdown title="Inputs" id="nav-in-dropdown">
              {this.props.filterData.Features !== undefined &&
                this.props.filterData.Features.Inputs.map((feat, i) => (
                  <NavDropdown.Item
                    key={i}
                    onClick={e => this.handleFeatureChange(e, `Inputs`, feat)}
                  >
                    {this.props.filter.features !== undefined &&
                      this.props.filter.features.Inputs.find(x => x == feat) !==
                        undefined && (
                        <span
                          className="oi oi-check"
                          title="icon check"
                          aria-hidden="true"
                        />
                      )}
                    {feat}
                  </NavDropdown.Item>
                ))}
            </NavDropdown>
          )}
          <NavLink onClick={() => this.props.onRemove(this.props.ident)}>
            <span className="oi oi-circle-x" title="Close" aria-hidden="true" />
          </NavLink>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default DeviceFilter
