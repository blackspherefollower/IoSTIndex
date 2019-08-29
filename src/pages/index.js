import "bootstrap/dist/css/bootstrap.css"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import "open-iconic/font/css/open-iconic-bootstrap.css"
import { graphql } from "gatsby"
import React from "react"
import { Navbar } from "react-bootstrap"
import BootstrapTable from "react-bootstrap-table-next"
import filterFactory, {
  textFilter,
  multiSelectFilter,
  Comparator,
} from "react-bootstrap-table2-filter"
import { Link } from "gatsby-plugin-modal-routing"

function urlFormatter(cell) {
  return <>{cell.length > 0 && <a href={cell}>{cell}</a>}</>
}

const availabilityOptions = {
  Available: `Available`,
  DIY: `DIY`,
  Discontinued: `Discontinued`,
  Unreleased: `Unreleased`,
  "Existence unknown": `Existence unknown`,
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

const buttplugOptions = {
  1: `C#`,
  2: `JS`,
}

const columns = [
  {
    dataField: `id`,
    text: `ID`,
    hidden: true,
  },
  {
    dataField: `node.Brand`,
    text: `Brand`,
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: `node.Device`,
    text: `Device`,
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: `node.Availability`,
    text: `Availability`,
    filter: multiSelectFilter({
      options: availabilityOptions,
      comparator: Comparator.LIKE,
      defaultValue: [`Available`, `DIY`],
    }),
    sort: true,
  },
  {
    dataField: `node.Connection`,
    text: `Connectivity`,
    filter: multiSelectFilter({
      options: connectionOptions,
      comparator: Comparator.LIKE,
    }),
    sort: true,
  },
  {
    dataField: `node.Type`,
    text: `Form Factor`,
    sort: true,
  },
  {
    dataField: `node.ButtplugSupport`,
    text: `Buttplug.io Support`,
    sort: true,
    filter: multiSelectFilter({
      options: buttplugOptions,
      onFilter: (filterVal, data) => {
        if (filterVal) {
          let match = 0
          filterVal.forEach(f => (match |= f))
          return data.filter(row => row.node.ButtplugSupport & match)
        }
        return data
      },
    }),
    formatter: (cellContent, row) => (
      <div>
        {(row.node.ButtplugSupport & 1 && <span> C#</span>) || ``}
        {(row.node.ButtplugSupport & 2 && <span> JS</span>) || ``}
      </div>
    ),
  },
  {
    dataField: `node.Detail`,
    text: `Url`,
    formatter: urlFormatter,
  },
]

class IndexComponent extends React.Component {
  constructor(props) {
    super(props)
    const devices = this.props.data.allDevicesCsv.edges
    const bpSupp = this.props.data.allBpsupportCsv.edges

    function cmpDev(left, right) {
      const b = left.node.Brand.localeCompare(right.node.Brand, `en`, {
        sensitivity: `base`,
      })
      if (b !== 0) return b

      return left.node.Device.localeCompare(right.node.Device, `en`, {
        sensitivity: `base`,
      })
    }

    function copyBpSupp(dev, bp) {
      dev.node.Buttplug_C_ = bp ? bp.node.Buttplug_C_ : ``
      dev.node.Buttplug_JS = bp ? bp.node.Buttplug_JS : ``
      dev.node.BpNotes = bp ? bp.node.Notes : ``
      dev.node.Win7 = bp ? bp.node.Win7 : ``
      dev.node.Win8 = bp ? bp.node.Win8 : ``
      dev.node.Win10_14939 = bp ? bp.node.Win10_14939 : ``
      dev.node.Win10_15063 = bp ? bp.node.Win10_15063 : ``
      dev.node.macOS = bp ? bp.node.macOS : ``
      dev.node.Linux = bp ? bp.node.Linux : ``
      dev.node.ChromeOS = bp ? bp.node.ChromeOS : ``
      dev.node.iOS = bp ? bp.node.iOS : ``
      dev.node.Android = bp ? bp.node.Android : ``

      const cs = dev.node.Buttplug_C_.length > 0 && dev.node.Buttplug_C_ !== `0`
      const js = dev.node.Buttplug_JS.length > 0 && dev.node.Buttplug_JS !== `0`
      dev.node.ButtplugSupport = 0
      if (cs) dev.node.ButtplugSupport |= 1
      if (js) dev.node.ButtplugSupport |= 2
    }

    let l = 0
    let r = 0
    while (l >= 0 || r >= 0) {
      const c =
        devices[l] && bpSupp[r]
          ? cmpDev(devices[l], bpSupp[r])
          : devices[l]
          ? -1
          : 1
      if (c === 0) {
        // Join
        copyBpSupp(devices[l], bpSupp[r])
        l++
        r++
      } else if (c < 0) {
        // Skip left
        copyBpSupp(devices[l])
        l++
      } else if (c > 0) {
        // Skip right
        r++
      }
      if (!devices[l]) l = -1
      if (!bpSupp[r]) r = -1
    }

    this.state = { devices }
  }

  expandRow = {
    renderer: () => (
      <div style={{ width: `100%`, height: `20px` }}>Content</div>
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

  setInputText(text) {}

  render() {
    const data = this.state.devices
    data.map((row, i) => (row.id = i))
    return (
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="#home">IoST Index</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
        <Navbar bg="light" expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" />
        </Navbar>
        <BootstrapTable
          bootstrap4
          striped
          bordered
          hover
          keyField="id"
          columns={columns}
          data={this.state.devices}
          expandRow={this.expandRow}
          filter={filterFactory()}
          noDataIndication="No matching devices found"
        />
      </div>
    )
  }
}

export default IndexComponent

export const IndexQuery = graphql`
  query {
    allDevicesCsv(sort: { fields: [Brand, Device] }) {
      edges {
        node {
          id
          Brand
          Device
          Detail
          Availability
          Connection
          Type
          Notes
        }
      }
    }
    allBpsupportCsv(sort: { fields: [Brand, Device] }) {
      edges {
        node {
          id
          Brand
          Device
          Buttplug_C_
          Buttplug_JS
          Notes
          Win10_14939
          Win10_15063
          Win7
          Win8
          iOS
          macOS
          Linux
          ChromeOS
          Android
        }
      }
    }
  }
`
