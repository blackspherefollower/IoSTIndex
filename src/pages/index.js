import React from "react"
import axios from "axios"
import DeviceFilter, { initialiseFilter } from "../components/DeviceFilter"
import DeviceList, { encode } from "../components/DeviceList"
import { initializeReactUrlState } from "../components/react-url-state"
import * as localforage from "localforage"
import * as moment from "moment"
import Fab from "@mui/material/Fab"
import FilterListIcon from "@mui/icons-material/FilterList"
import CompareIcon from "@mui/icons-material/Compare"
import trackCustomEvent from "../components/trackCustomEvent"
import { Typography } from "@mui/material"
import Alert from "@mui/material/Alert"
import PageHead from "../components/PageHead"

export function Head() {
  return <PageHead />
}

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

    if (param === `locks`) {
      value.split(`,`).forEach((s) => {
        const i = parseInt(s, 10)
        if (!isNaN(i) && i < newState.filters.length) {
          newState.filters[i].lock = true
        }
      })
    }

    if (param === `noFilter`) {
      newState.noFilter = true
    }

    return newState
  },
  toIdMappers: (param, state) => {
    if (param === `filters`) {
      const locks = []
      return (
        state.filters
          .map((f, i) => {
            if (typeof f.toUrl === `function`) {
              if (f.lock) locks.push(i)
              return `filter${i}${f.field}=${f.toUrl()}`
            }
            return undefined
          })
          .filter((p) => p !== undefined && p !== null)
          .join(`&`) + (locks.length > 0 ? `&locks=${locks.join(`,`)}` : ``)
      )
    }
    if (param === `noFilter`) {
      return state.noFilter ? `noFilter` : undefined
    }
    return undefined
  },
  pathname: `/`,
  leavestate: true,
}

class IndexComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      devices: [],
      data: [],
      filters: [],
      filterData: {},
      compareMode: false,
      filtersChanged: false,
    }
    this.handleFilterRemove = this.handleFilterRemove.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
    this.addFilter = this.addFilter.bind(this)
    this.setCompareMode = this.setCompareMode.bind(this)
  }

  componentDidMount() {
    const fields = [`Availability`, `Type`, `Class`, `Anatomy`, `Apps`]
    const csv = [`Anatomy`, `Type`, `Apps`]
    const filterData = { Features: { Inputs: [], Outputs: [] } }
    fields.forEach((f) => {
      if (filterData[f] === undefined) {
        filterData[f] = []
      }
    })
    let filters = []

    this.reactUrlState = initializeReactUrlState(this)(
      reactUrlStateOptions,
      (newState) => {
        if (
          performance !== undefined &&
          typeof performance.getEntriesByType === `function`
        ) {
          if (
            performance
              .getEntriesByType(`navigation`)
              .findIndex(
                (pnt) => pnt.type === `reload` || pnt.type === `back_forward`
              ) !== -1 &&
            (newState?.devices || []).length > 0
          ) {
            return
          }
        } else if (performance !== undefined) {
          // noinspection JSDeprecatedSymbols
          if (
            performance.navigation.type ===
              performance.navigation.TYPE_RELOAD ||
            PerformanceNavigation.type ===
              performance.navigation.TYPE_BACK_FORWARD
          ) {
            return
          }
        }

        filters = newState?.filters || this.state.filters
        if (
          filters.length === 0 &&
          !this.state.filtersChanged &&
          !newState?.noFilter
        ) {
          filters = [
            { field: `Availability`, urlData: `Available,DIY` },
            { field: `Connection`, urlData: `Digital` },
          ]
        }
        filters.map((f) => initialiseFilter(f))

        let devDate = null
        let devices = null
        localforage
          .getItem(`devices`)
          .then((value) => {
            devices = value
            return localforage.getItem(`devicesDate`)
          })
          .then((dateValue) => {
            if (!isNaN(dateValue)) {
              devDate = moment(dateValue)
            }
          })
          .then(() => {
            if (
              devices === null ||
              devDate === null ||
              devDate.add(30, `m`).isBefore(moment())
            ) {
              return axios.get(
                `/devices.json?` + Math.floor(Math.random() * 1000)
              )
            }
            return null
          })
          .then((res) => {
            if (res != null) {
              devices = res.data
              devices.forEach((d) => {
                if (d.path === undefined) {
                  d.path = encode(d.Brand) + `/` + encode(d.Device)
                }
              })
              localforage
                .setItem(`devices`, devices)
                .then(() =>
                  localforage.setItem(`devicesDate`, moment().valueOf())
                )
                .catch((err) => console.error(err))
            } else {
              devices.forEach((d) => {
                if (d.path === undefined) {
                  d.path = encode(d.Brand) + `/` + encode(d.Device)
                }
              })
            }

            if (devices.length > 0) {
              filterData.Features.Inputs = Object.getOwnPropertyNames(
                devices[0].Features.Inputs
              )
              filterData.Features.Outputs = Object.getOwnPropertyNames(
                devices[0].Features.Outputs
              )
            }

            devices.forEach((d) => {
              fields.forEach((f) => {
                if (d[f] === undefined) {
                  return
                }
                if (csv.includes(f)) {
                  String(d[f])
                    .split(`,`)
                    .forEach((fb) => {
                      const fs = fb.trim()
                      if (fs.length !== 0 && !filterData[f].includes(fs)) {
                        filterData[f].push(fs)
                      }
                    })
                } else {
                  const fs = String(d[f]).trim()
                  if (fs.length !== 0 && !filterData[f].includes(fs)) {
                    filterData[f].push(fs)
                  }
                }
              })

              // Ensure data is complete or stubbed
              if (d.XToys === undefined) {
                d.XToys = {}
              }
              if (d.XToys.XToysSupport === undefined) {
                d.XToys.XToysSupport = 0
              }
              if (d.XToys.XToys_Support_Notes === undefined) {
                d.XToys.XToys_Support_Notes = ``
              }
            })
            fields.forEach((f) => {
              filterData[f].sort()
            })
            this.handleFilterChange(undefined, undefined, {
              devices,
              data: devices,
              filterData,
              filters,
            })
          })
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
    trackCustomEvent(`Filters`, `Removed`, `${filters[ident].field}`, ident)
    filters.splice(ident, 1)
    this.setState({ filters })
    this.handleFilterChange()
  }

  handleFilterChange(ident, filter, state) {
    const filters = state?.filters || this.state.filters
    if (ident !== undefined) {
      filters[ident] = filter
      if (
        typeof filter.field === `string` &&
        typeof filter.toUrl === `function`
      ) {
        trackCustomEvent(
          `Filters`,
          `Changed`,
          `${filter.field}: ${filter.toUrl()}`,
          ident
        )
      }
    }
    const data = (state?.devices || this.state.devices).filter((d) => {
      let res = true
      for (let i = 0; res === true && i < filters.length; i++) {
        const f = filters[i]
        if (f.filterData !== undefined) {
          res = f.filterData(d, f)
        }
      }
      return res
    })
    if (state === undefined) {
      this.reactUrlState.setUrlState({
        data,
        filters,
        noFilter: filters.length === 0,
      })
    } else {
      this.reactUrlState.setUrlState(
        Object.assign(state, {
          data,
          filters,
          noFilter: filters.length === 0,
        })
      )
    }
  }

  addFilter() {
    const filters = this.state.filters
    filters.push({})
    this.setState({ filters })
  }

  setCompareMode(mode) {
    this.setState({ compareMode: mode })
  }

  render() {
    const filterNavs = []
    const filterErrors = []
    this.state.filters.forEach((f, i) => {
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
      if (typeof f.validateFilter === `function`) {
        f.validateFilter(f).forEach((e) =>
          filterErrors.push(
            <Alert severity="error" key={filterErrors.length}>
              {e}
            </Alert>
          )
        )
      }
    })

    return (
      <div>
        <Typography variant="h1" hidden={true}>
          IoST Index: Device List
        </Typography>
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
          <Fab
            variant="extended"
            color="primary"
            size="medium"
            style={{ margin: `8px` }}
            onClick={() => this.setCompareMode(true)}
          >
            <CompareIcon />
            Compare Devices
          </Fab>
          <span>{this.state.data.length} devices found</span>
        </div>
        {filterNavs}
        {filterErrors}
        <DeviceList
          data={this.state.data}
          compareMode={this.state.compareMode}
          setCompareMode={this.setCompareMode}
        />
      </div>
    )
  }
}

export default IndexComponent
