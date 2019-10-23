import React from "react"
import { Form, Navbar, NavDropdown } from "react-bootstrap"
import NavLink from "react-bootstrap/NavLink"

class DeviceFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.handleAvailabilityChange = this.handleAvailabilityChange.bind(this)
    this.handleBpChange = this.handleBpChange.bind(this)
    this.handleFeatureChange = this.handleFeatureChange.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleTypeChange = this.handleTypeChange.bind(this)
    this.handleConnectionChange = this.handleConnectionChange.bind(this)
  }

  componentDidMount() {
    const features = { Inputs: [], Outputs: [] }
    let tmp = []
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

        case `Features`:
          if (this.props.filter.features !== undefined) {
            features.Inputs = [...this.props.filter.features.Inputs]
            features.Outputs = [...this.props.filter.features.Outputs]
          }
          decodeURI(this.props.filter.urlData)
            .split(`,`)
            .forEach(f => {
              const match = f.match(new RegExp(`(Inputs|Outputs)(.*)`))
              if (match !== null) {
                features[match[1]].push([match[2]])
              }
            })
          this.handleFeatureChange(null, `preset`, features)
          break

        case `Type`:
          if (this.props.filter.Type !== undefined) {
            tmp = [...this.props.filter.Type]
          }
          tmp = tmp.concat(decodeURI(this.props.filter.urlData).split(`,`))
          this.handleTypeChange(null, tmp)
          break

        case `Availability`:
          if (this.props.filter.Availability !== undefined) {
            tmp = [...this.props.filter.Availability]
          }
          tmp = tmp.concat(decodeURI(this.props.filter.urlData).split(`,`))
          this.handleAvailabilityChange(null, tmp)
          break

        case `Connection`:
          if (this.props.filter.Connection !== undefined) {
            tmp = [...this.props.filter.Connection]
          }
          tmp = tmp.concat(decodeURI(this.props.filter.urlData).split(`,`))
          this.handleConnectionChange(null, tmp)
          break
      }
    }
  }

  handleFieldChange(event) {
    this.props.onChange(this.props.ident, { field: event.target.value })
  }

  doTextFilter = (data, filter) =>
    data[filter.field].match(new RegExp(filter.search, `i`)) !== null

  handleSearchChange(event) {
    this.props.onChange(this.props.ident, {
      field: this.props.filter.field,
      search: event.target.value,
      filterData: this.doTextFilter,
      toUrl: () => encodeURI(this.props.filter.search),
    })
  }

  doBpFilter = (data, filter) =>
    (data.Buttplug.ButtplugSupport & filter.bpSupport) !== 0

  handleBpChange(event, mode) {
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
    for (const i of filter.features.Inputs) {
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
    for (const i of filter.features.Outputs) {
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

  handleFeatureChange(event, type, feature) {
    let features = { Inputs: [], Outputs: [] }
    if (this.props.filter.features !== undefined) {
      features.Inputs = [...this.props.filter.features.Inputs]
      features.Outputs = [...this.props.filter.features.Outputs]
    }
    if (type === `preset`) {
      features = feature
    } else {
      const pos = features[type].indexOf(feature)
      if (pos === -1) {
        features[type].push(feature)
      } else {
        features[type].splice(pos, 1)
      }
    }

    this.props.onChange(this.props.ident, {
      field: this.props.filter.field,
      features: features,
      filterData: this.doFeatureFilter,
      toUrl: () => {
        const data = []
        data.push(features.Inputs.map(i => `Inputs${i}`))
        data.push(features.Outputs.map(o => `Outputs${o}`))
        return encodeURI(data.flat().join(`,`))
      },
    })
  }

  doSelectFilter = (data, filter) => {
    if (filter[filter.field].length === 0) {
      return true
    }
    return filter[filter.field].includes(data[filter.field])
  }

  handleTypeChange(event, type) {
    let types = []
    if (this.props.filter.Type !== undefined) {
      types = [...this.props.filter.Type]
    }
    if (Array.isArray(type)) {
      types = types.concat(type)
    } else {
      const pos = types.indexOf(type)
      if (pos === -1) {
        types.push(type)
      } else {
        types.splice(pos, 1)
      }
    }

    this.props.onChange(this.props.ident, {
      field: this.props.filter.field,
      Type: types,
      filterData: this.doSelectFilter,
      toUrl: () => encodeURI(types.join(`,`)),
    })
  }

  handleAvailabilityChange(event, availability) {
    let data = []
    if (this.props.filter.Availability !== undefined) {
      data = [...this.props.filter.Availability]
    }
    if (Array.isArray(availability)) {
      data = data.concat(availability)
    } else {
      const pos = data.indexOf(availability)
      if (pos === -1) {
        data.push(availability)
      } else {
        data.splice(pos, 1)
      }
    }

    this.props.onChange(this.props.ident, {
      field: this.props.filter.field,
      Availability: data,
      filterData: this.doSelectFilter,
      toUrl: () => encodeURI(data.join(`,`)),
    })
  }

  doConnectFilter = (data, filter) => {
    if (filter[filter.field].length === 0) {
      return true
    }
    if (
      filter[filter.field].includes(`Bluetooth 2`) &&
      data[filter.field].includes(`BT2`)
    ) {
      return true
    }
    if (
      filter[filter.field].includes(`Bluetooth 4 LE`) &&
      data[filter.field].includes(`BT4LE`)
    ) {
      return true
    }
    if (
      filter[filter.field].includes(`USB`) &&
      data[filter.field].includes(`USB`)
    ) {
      return true
    }
    if (filter[filter.field].includes(`Other`)) {
      const bits = data[filter.field].split(`,`)
      return (
        bits.filter(
          v => !v.includes(`USB`) && !v.includes(`BT2`) && !v.includes(`BT4LE`)
        ).length > 0
      )
    }
    return false
  }

  handleConnectionChange(event, connection) {
    let data = []
    if (this.props.filter.Connection !== undefined) {
      data = [...this.props.filter.Connection]
    }
    if (Array.isArray(connection)) {
      data = data.concat(connection)
    } else {
      const pos = data.indexOf(connection)
      if (pos === -1) {
        data.push(connection)
      } else {
        data.splice(pos, 1)
      }
    }

    this.props.onChange(this.props.ident, {
      field: this.props.filter.field,
      Connection: data,
      filterData: this.doConnectFilter,
      toUrl: () => encodeURI(data.join(`,`)),
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
              <option value={`Features`}>Features</option>
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
                      this.props.filter.features.Outputs.includes(feat) && (
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
                      this.props.filter.features.Inputs.includes(feat) && (
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
          {this.props.filter.field === `Type` && (
            <NavDropdown title="Form Factors" id="nav-out-dropdown">
              {this.props.filterData.Type !== undefined &&
                this.props.filterData.Type.map((type, i) => (
                  <NavDropdown.Item
                    key={i}
                    onClick={e => this.handleTypeChange(e, type)}
                  >
                    {this.props.filter.Type !== undefined &&
                      this.props.filter.Type.includes(type) && (
                        <span
                          className="oi oi-check"
                          title="icon check"
                          aria-hidden="true"
                        />
                      )}
                    {type}
                  </NavDropdown.Item>
                ))}
            </NavDropdown>
          )}
          {this.props.filter.field === `Availability` && (
            <NavDropdown title="Options" id="nav-out-dropdown">
              {this.props.filterData.Availability !== undefined &&
                this.props.filterData.Availability.map((a, i) => (
                  <NavDropdown.Item
                    key={i}
                    onClick={e => this.handleAvailabilityChange(e, a)}
                  >
                    {this.props.filter.Availability !== undefined &&
                      this.props.filter.Availability.includes(a) && (
                        <span
                          className="oi oi-check"
                          title="icon check"
                          aria-hidden="true"
                        />
                      )}
                    {a}
                  </NavDropdown.Item>
                ))}
            </NavDropdown>
          )}
          {this.props.filter.field === `Connection` && (
            <NavDropdown title="Options" id="nav-out-dropdown">
              {[`Bluetooth 2`, `Bluetooth 4 LE`, `USB`, `Other`].map((a, i) => (
                <NavDropdown.Item
                  key={i}
                  onClick={e => this.handleConnectionChange(e, a)}
                >
                  {this.props.filter.Connection !== undefined &&
                    this.props.filter.Connection.includes(a) && (
                      <span
                        className="oi oi-check"
                        title="icon check"
                        aria-hidden="true"
                      />
                    )}
                  {a}
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
