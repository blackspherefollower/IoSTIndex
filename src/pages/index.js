/* @jsx glam */
// eslint-disable-next-line no-unused-vars
import glam from "glam"
import "bootstrap/dist/css/bootstrap.css"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import "open-iconic/font/css/open-iconic-bootstrap.css"
import React, { Fragment } from "react"
import { Navbar, Col, Container, Row, Table } from "react-bootstrap"
import BootstrapTable from "react-bootstrap-table-next"
import filterFactory, {
  multiSelectFilter,
  Comparator,
} from "react-bootstrap-table2-filter"
import { Link } from "gatsby-plugin-modal-routing"
import NavLink from "react-bootstrap/NavLink"
import Carousel, { Modal, ModalGateway } from "react-images"
import axios from "axios"
import DeviceFilter from "../components/DeviceFilter"

import { initializeReactUrlState } from "react-url-state"

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
    dataField: `images`,
    text: `Image`,
    formatter: (cellContent, row) => (
      <div>
        {row.images && row.images.length > 0 && (
          <img
            src={row.images[0]}
            css={{ "object-fit": `cover`, width: `50px`, height: `50px` }}
          />
        )}
      </div>
    ),
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
    formatter: (cellContent, row) => (
      <div>
        {cellContent.length > 0 && <a href={cellContent}>{cellContent}</a>}
      </div>
    ),
  },
]

const reactUrlStateOptions = {
  fromIdResolvers: async (param, value, oldState) => {
    const newState = { ...oldState }
    const found = param.match(/filter(\d+)([A-Za-z].+)/)
    if (found !== null) {
      const fId = parseInt(found[1], 10)
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

export class DetailBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = { currentModal: null }
  }

  toggleModal(index = null) {
    this.setState({ currentModal: index })
  }

  render() {
    return (
      <Fragment>
        <Container>
          <Row>
            <Col>
              <h1>
                {this.props.device.Brand} - {this.props.device.Device}
              </h1>
              <span>{this.props.device.Notes}</span>
            </Col>
          </Row>
          <Row>
            <Gallery>
              {this.props.device.images.map((img, i) => (
                <Image onClick={() => this.toggleModal(i)} key={i}>
                  <img
                    src={img}
                    css={{
                      cursor: `pointer`,
                      position: `absolute`,
                      maxWidth: `100%`,
                    }}
                  />
                </Image>
              ))}
            </Gallery>
            {Number.isInteger(this.state.currentModal) && (
              <ModalGateway>
                <Modal
                  allowFullscreen={false}
                  closeOnBackdropClick={false}
                  onClose={() => this.toggleModal()}
                >
                  <Carousel
                    currentIndex={this.state.currentModal}
                    frameProps={{ autoSize: `height` }}
                    views={this.props.device.images.map(img => {
                      return { src: img }
                    })}
                  />
                </Modal>
              </ModalGateway>
            )}
          </Row>
          <Row>
            <Col>
              <Table>
                <thead>
                  <tr>
                    <th>Input</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(this.props.device.Features.Inputs).map(
                    (feat, i) => (
                      <tr key={i}>
                        <td>{feat}</td>
                        <td>{this.props.device.Features.Inputs[feat]}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </Col>
            <Col>
              <Table>
                <thead>
                  <tr>
                    <th>Output</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(this.props.device.Features.Outputs).map(
                    (feat, i) => (
                      <tr key={i}>
                        <td>{feat}</td>
                        <td>{this.props.device.Features.Outputs[feat]}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </Fragment>
    )
  }
}

class IndexComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      devices: [],
      data: [],
      filters: [],
      filterData: {},
    }
    this.handleFilterRemove = this.handleFilterRemove.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
    this.addFilter = this.addFilter.bind(this)
  }

  componentDidMount() {
    axios.get(`/devices.json`).then(res => {
      const filterData = { Features: { Inputs: [], Outputs: [] } }
      if (res.data.length > 0) {
        filterData.Features.Inputs = Object.getOwnPropertyNames(
          res.data[0].Features.Inputs
        )
        filterData.Features.Outputs = Object.getOwnPropertyNames(
          res.data[0].Features.Outputs
        )
      }
      const fields = [`Availability`, `Type`]
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
    renderer: row => <DetailBox device={row} />,
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

  handleTableChange(type, { sortField, sortOrder }) {
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
      if (f.filterData !== undefined) {
        data = data.filter(d => f.filterData(d, f))
      }
    })
    this.reactUrlState.setUrlState({ data, filters })
  }

  addFilter() {
    const filters = this.state.filters
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

const gutter = 2

const Gallery = props => (
  <div
    css={{
      overflow: `hidden`,
      marginLeft: -gutter,
      marginRight: -gutter,
      flex: `auto`,
    }}
    {...props}
  />
)

const Image = props => (
  <div
    css={{
      backgroundColor: `#eee`,
      boxSizing: `border-box`,
      display: `inline-block`,
      margin: gutter,
      overflow: `hidden`,
      paddingBottom: `15%`,
      position: `relative`,
      width: `calc(25% - ${gutter * 2}px)`,

      ":hover": {
        opacity: 0.9,
      },
    }}
    {...props}
  />
)
