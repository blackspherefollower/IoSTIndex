import 'bootstrap/dist/css/bootstrap.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'open-iconic/font/css/open-iconic-bootstrap.css'
import { graphql } from "gatsby"
import React from "react"
import { Navbar } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter, multiSelectFilter, Comparator } from 'react-bootstrap-table2-filter';


function urlFormatter(cell, row, rowIndex, formatExtraData) {
  return (
    <>
    {cell.length > 0 &&
      <a href={cell}>{cell}</a>
    }
    </>
  );
}

const availabilityOptions = {
  'Available': 'Available',
  'DIY': 'DIY',
  'Discontinued': 'Discontinued',
  'Unreleased': 'Unreleased',
  'Existence unknown': 'Existence unknown',
};

const connectionOptions = {
  'BT': 'Bluetooth (Any)',
  'BT2 (Serial)': 'Bluetooth (Serial)',
  'BT2 (Audio)': 'Bluetooth (Audio)',
  'BT2 (HID)': 'Bluetooth (HID)',
  'BT4': 'Bluetooth LE',
  'USB': 'USB',
  'Serial': 'Serial',
};

const columns = [
  {
    dataField: 'id',
    text: 'ID',
    hidden: true
  }, {
    dataField: 'node.Brand',
    text: 'Brand',
    filter: textFilter(),
    sort: true,
  }, {
    dataField: 'node.Device',
    text: 'Device',
    filter: textFilter(),
    sort: true,
  }, {
    dataField: 'node.Availability',
    text: 'Availability',
    filter: multiSelectFilter({
      options: availabilityOptions,
      comparator: Comparator.LIKE,
      defaultValue: ['Available', 'DIY'],
    }),
    sort: true,
  }, {
    dataField: 'node.Connection',
    text: 'Connectivity',
    filter: multiSelectFilter({
      options: connectionOptions,
      comparator: Comparator.LIKE,
    }),
    sort: true,
  }, {
    dataField: 'node.Type',
    text: 'Form Factor',
    sort: true,
  }, {
    dataField: 'node.Detail',
    text: 'Url',
    formatter: urlFormatter,
  },
]

class IndexComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { devices: this.props.data.allDevicesCsv.edges };
  }

  expandRow = {
    renderer: () => (
      <div style={ { width: '100%', height: '20px' } }>Content</div>
    ),
    showExpandColumn: true,
    expandByColumnOnly: true,
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      if (isAnyExpands) {
        return <span className="oi oi-minus" title="icon minus" aria-hidden="true"></span>;
      }
      return <span className="oi oi-plus" title="icon plus" aria-hidden="true"></span>;
    },
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return (
          <span className="oi oi-minus" title="icon minus" aria-hidden="true"></span>
        );
      }
      return (
        <span className="oi oi-plus" title="icon plus" aria-hidden="true"></span>
      );
    }
  };

  setInputText(text) {};

  render() {
    const data = this.state.devices
    data.map( (row, i) => row.id = i )
    return (
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="#home">IoST Index</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          </Navbar.Collapse>
        </Navbar>
        <Navbar bg="light" expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          </Navbar.Collapse>
        </Navbar>
        <BootstrapTable
          bootstrap4
          striped
          bordered
          hover
          keyField='id'
          columns={columns}
          data={ this.state.devices }
          expandRow={ this.expandRow }
          filter={ filterFactory() }
          noDataIndication="No matching devices found"/>
      </div>
    )
  }
}

export default IndexComponent

export const IndexQuery = graphql`
  query {
    allDevicesCsv(sort:{fields:[Brand,Device]}) {
      edges {
        node {
          id
          Brand
          Device
          Detail
          Availability
          Connection
          Type
        }
      }
    }
  }
`
