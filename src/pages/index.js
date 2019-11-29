import React from "react"
import axios from "axios"
import DeviceFilter from "../components/DeviceFilter"
import DeviceList from "../components/DeviceList"
import { initializeReactUrlState } from "react-url-state"
import * as localforage from "localforage"
import * as moment from "moment"
import Fab from "@material-ui/core/Fab"
import FilterListIcon from "@material-ui/icons/FilterList"
import SEO from "../components/seo"
import { forceCheck } from "react-lazyload"

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
    let devDate = null
    let devices = null
    localforage
      .getItem(`devices`)
      .then(value => {
        devices = value
        return localforage.getItem(`devicesDate`)
      })
      .then(dateValue => (devDate = moment(dateValue)))
      .then(() => {
        console.info(devDate, moment())
        if (
          devices === null ||
          devDate === null ||
          moment()
            .subtract(30, `m`)
            .isAfter(devDate)
        ) {
          return axios.get(`/devices.json`)
        }
        return null
      })
      .then(res => {
        if (res != null) {
          devices = res.data
          localforage
            .setItem(`devices`, devices)
            .then(() => localforage.setItem(`devicesDate`, moment().valueOf()))
            .catch(err => console.error(err))
        }

        const filterData = { Features: { Inputs: [], Outputs: [] } }
        if (devices.length > 0) {
          filterData.Features.Inputs = Object.getOwnPropertyNames(
            devices[0].Features.Inputs
          )
          filterData.Features.Outputs = Object.getOwnPropertyNames(
            devices[0].Features.Outputs
          )
        }
        const fields = [`Availability`, `Type`]
        devices.forEach(d => {
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
          devices,
          data: devices,
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
    forceCheck()
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
        <SEO />
        <div>
          <Fab
            variant="extended"
            color="primary"
            size="medium"
            style={{ margin: `8px` }}
            onClick={this.addFilter}
          >
            <FilterListIcon />
            Add Filter
          </Fab>
          <span>{this.state.data.length} devices found</span>
        </div>
        {filterNavs}
        <DeviceList data={this.state.data} />
      </div>
    )
  }
}

export default IndexComponent
