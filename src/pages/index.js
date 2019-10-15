import "bootstrap/dist/css/bootstrap.css"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import "open-iconic/font/css/open-iconic-bootstrap.css"
import React from "react"
import { Navbar, Col, Container, Row, Table, Image } from "react-bootstrap"
import BootstrapTable from "react-bootstrap-table-next"
import filterFactory, {
  multiSelectFilter,
  Comparator,
} from "react-bootstrap-table2-filter"
import { Link } from "gatsby-plugin-modal-routing"
import NavLink from "react-bootstrap/NavLink"
import axios from "axios"
import DeviceFilter from "../components/DeviceFilter"

import { initializeReactUrlState } from "react-url-state"

function urlFormatter(cell) {
  return <>{cell.length > 0 && <a href={cell}>{cell}</a>}</>
}

const connectionOptions = {
  BT: `Bluetooth (Any)`,
  "BT2 (Serial)": `Bluetooth (Serial)`,
  "BT2 (Audio)": `Bluetooth (Audio)`,
  "BT2 (HID)": `Bluetooth (HID)`,
  BT4: `Bluetooth LE`,
  USB: `USB`,
  Serial: `Serial`,
}

const columns = [
  {
    dataField: `id`,
    text: `ID`,
    hidden: true,
  },
  {
    dataField: `Brand`,
    text: `Brand Name`,
    sort: true,
  },
  {
    dataField: `Device`,
    text: `Device`,
    sort: true,
  },
  {
    dataField: `Availability`,
    text: `Availability`,
    sort: true,
  },
  {
    dataField: `Connection`,
    text: `Connectivity`,
    filter: multiSelectFilter({
      options: connectionOptions,
      comparator: Comparator.LIKE,
    }),
    sort: true,
  },
  {
    dataField: `Type`,
    text: `Form Factor`,
    sort: true,
  },
  {
    dataField: `Buttplug.ButtplugSupport`,
    text: `Buttplug.io Support`,
    sort: true,
    formatter: (cellContent, row) => (
      <div>
        {(row.Buttplug.ButtplugSupport & 1 && <span> C#</span>) || ``}
        {(row.Buttplug.ButtplugSupport & 2 && <span> JS</span>) || ``}
      </div>
    ),
  },
  {
    dataField: `Detail`,
    text: `Url`,
    formatter: urlFormatter,
  },
]

const reactUrlStateOptions = {
  fromIdResolvers: async (param, value, oldState) => {
    let newState = { ...oldState }
    let found = param.match(/filter(\d+)([A-Za-z].+)/)
    if (found !== null) {
      let fId = parseInt(found[1], 10)
      if (newState.filters === undefined) {
        newState.filters = new Array(fId + 1)
      } else {
        while (newState.filters.length < fId + 1) {
          newState.filters.push({})
        }
      }
      newState.filters[fId] = { field: found[2], urlData: value }
    }
    return newState
  },
  toIdMappers: (param, state) => {
    if (param === `filters`) {
      return state.filters
        .map((f, i) => {
          if (typeof f.toUrl === `function`) {
            return `filter${i}${f.field}=${f.toUrl()}`
          }
          return undefined
        })
        .filter(p => p !== undefined && p !== null)
        .join(`&`)
    }
    return undefined
  },
  pathname: `/`,
}

class IndexComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { devices: [], data: [], filters: [], filterData: {} }
    this.handleFilterRemove = this.handleFilterRemove.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  componentDidMount() {
    axios.get(`/devices.json`).then(res => {
      let filterData = { Features: { Inputs: [], Outputs: [] } }
      if (res.data.length > 0) {
        filterData.Features.Inputs = Object.getOwnPropertyNames(
          res.data[0].Features.Inputs
        )
        filterData.Features.Outputs = Object.getOwnPropertyNames(
          res.data[0].Features.Outputs
        )
      }
      let fields = [`Availability`, `Connection`, `Type`]
      res.data.forEach(d => {
        fields.forEach(f => {
          if (filterData[f] === undefined) {
            filterData[f] = []
          }
          if (!filterData[f].includes(d[f])) {
            filterData[f].push(d[f])
          }
        })
      })
      fields.forEach(f => {
        filterData[f].sort()
      })
      this.setState({
        devices: res.data,
        data: res.data,
        filterData,
      })
      this.handleFilterChange()
    })

    this.reactUrlState = initializeReactUrlState(this)(
      reactUrlStateOptions,
      () => {
        if (this.state.filters.length === 0) {
          this.setState({
            filters: [{ field: `Availability`, urlData: `Available,DIY` }],
          })
        }
      }
    )
  }

  expandRow = {
    renderer: row => (
      <div style={{ width: `100%` }}>
        <Container>
          <Row>
            <Col>
              <h1>
                {row.Brand} - {row.Device}
              </h1>
              <span>{row.Notes}</span>
            </Col>
          </Row>
          <Row>
            {row.images.map((img, i) => (
              <Col key={i}>
                <Image src={img} rounded />
              </Col>
            ))}
          </Row>
          <Row>
            <Col>
              <Table>
                <thead>
                  <td>Input</td>
                  <td>Count</td>
                </thead>
                {Object.keys(row.Features.Inputs).map((feat, i) => (
                  <tr key={i}>
                    <td>{feat}</td>
                    <td>{row.Features.Inputs[feat]}</td>
                  </tr>
                ))}
              </Table>
            </Col>
            <Col>
              <Table>
                <thead>
                  <td>Output</td>
                  <td>Count</td>
                </thead>
                {Object.keys(row.Features.Outputs).map((feat, i) => (
                  <tr key={i}>
                    <td>{feat}</td>
                    <td>{row.Features.Outputs[feat]}</td>
                  </tr>
                ))}
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    ),
    showExpandColumn: true,
    expandByColumnOnly: true,
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      if (isAnyExpands) {
        return (
          <span className="oi oi-minus" title="icon minus" aria-hidden="true" />
        )
      }
      return (
        <span className="oi oi-plus" title="icon plus" aria-hidden="true" />
      )
    },
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return (
          <span className="oi oi-minus" title="icon minus" aria-hidden="true" />
        )
      }
      return (
        <span className="oi oi-plus" title="icon plus" aria-hidden="true" />
      )
    },
  }

  handleTableChange = (type, { sortField, sortOrder }) => {
    if (!sortOrder || !sortOrder) return
    let result
    if (sortOrder === `asc`) {
      result = this.state.devices.sort((a, b) =>
        a[sortField].localeCompare(b[sortField], `en`, {
          sensitivity: `base`,
          caseFirst: false,
        })
      )
    } else {
      result = this.state.devices.sort((a, b) =>
        b[sortField].localeCompare(a[sortField], `en`, {
          sensitivity: `base`,
          caseFirst: false,
        })
      )
    }
    this.setState({ devices: result })
    this.handleFilterChange()
  }

  handleFilterRemove(ident) {
    const filters = this.state.filters
    filters.splice(ident, 1)
    this.setState({ filters })
    this.handleFilterChange()
  }

  handleFilterChange(ident, filter) {
    const filters = this.state.filters
    if (ident !== undefined) {
      filters[ident] = filter
    }
    let data = this.state.devices
    filters.forEach(f => {
      if (f.hasOwnProperty(`filterData`)) {
        data = data.filter(d => f.filterData(d, f))
      }
    })
    this.reactUrlState.setUrlState({ data, filters })
  }

  addFilter = () => {
    let filters = this.state.filters
    filters.push({})
    this.setState({ filters })
  }

  render() {
    const filterNavs = []
    this.state.filters.forEach((f, i) =>
      filterNavs.push(
        <DeviceFilter
          filter={f}
          key={i}
          ident={i}
          onChange={this.handleFilterChange}
          onRemove={this.handleFilterRemove}
          filterData={this.state.filterData}
        />
      )
    )

    return (
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="#home">IoST Index</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="left-navbar-nav">
            <NavLink variant="dark" onClick={this.addFilter}>
              Add Filter
            </NavLink>
          </Navbar.Collapse>
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Navbar.Text>
              <Link to="/about/" asModal>
                About
              </Link>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
        {filterNavs}
        <BootstrapTable
          bootstrap4
          striped
          bordered
          hover
          remote={{ sort: true }}
          keyField="id"
          columns={columns}
          expandRow={this.expandRow}
          filter={filterFactory()}
          noDataIndication="No matching devices found"
          data={this.state.data}
          onTableChange={this.handleTableChange}
        />
      </div>
    )
  }
}

export default IndexComponent
