import React from "react"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import DeleteIcon from "@mui/icons-material/Delete"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Input from "@mui/material/Input"
import ListItemText from "@mui/material/ListItemText"
import IconButton from "@mui/material/IconButton"
import debouncedInput from "./debouncedInput"
import { theme } from "../layouts/theme"
import styled from "@emotion/styled"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"

const DebouncedTextField = debouncedInput(TextField, 500)

const StyledFormControl = styled(FormControl)(({ theme }) => {
  return {
    margin: theme.spacing(1),
    minWidth: 120,
  }
})
const StyledDebouncedTextField = styled(DebouncedTextField)(({ theme }) => {
  return {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  }
})

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 8.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const doTextFilter = (data, filter) =>
  data[filter.field].match(new RegExp(filter.search, `i`)) !== null

const doBpFilter = (data, filter) =>
  filter.bpSupport === undefined ||
  (filter.bpSupport === 0 &&
    (data.Buttplug.ButtplugSupport === 0 ||
      isNaN(data.Buttplug.ButtplugSupport))) ||
  (filter.bpSupport !== 0 &&
    (data.Buttplug.ButtplugSupport & filter.bpSupport) !== 0)

const validateBpFilter = (filter) => {
  const errors = []
  if (
    filter.field === `ButtplugSupport` &&
    (filter.bpSupport !== 0 || filter.bpSupport === undefined)
  ) {
    if ((filter.bpSupport & 1) !== 0) {
      errors.push(
        `Buttplug C# has been deprecated in favour of Buttplug Rust and FFI based wrappers. ` +
          `Consider resetting the Buttplug Support filter.`
      )
    }
    if ((filter.bpSupport & 2) !== 0) {
      errors.push(
        `Buttplug JS has been deprecated in favour of Buttplug Rust and WASM bindings. ` +
          `Consider resetting the Buttplug Support filter.`
      )
    }
  }
  return errors
}

const doXtoysFilter = (data, filter) =>
  filter.xtoysSupport === undefined ||
  data.XToys.XToysSupport === filter.xtoysSupport

const doFeatureFilter = (data, filter) => {
  if (
    filter.Features.Inputs.length === 0 &&
    filter.Features.Outputs.length === 0
  ) {
    return true
  }

  let potential = false
  for (const j of filter.Features.Inputs) {
    let i = j
    let mustHave = false
    if (i.endsWith(`!`)) {
      mustHave = true
      i = i.substr(0, i.length - 1)
    }
    if (
      data.Features.Inputs[i] === undefined ||
      data.Features.Inputs[i] === null ||
      data.Features.Inputs[i] === 0 ||
      data.Features.Inputs[i] === `0` ||
      data.Features.Inputs[i].length === 0
    ) {
      if (mustHave) {
        return false
      }
    } else if (!mustHave) {
      return true
    } else {
      potential = true
    }
  }
  for (const j of filter.Features.Outputs) {
    let i = j
    let mustHave = false
    if (i.endsWith(`!`)) {
      mustHave = true
      i = i.substr(0, i.length - 1)
    }
    if (
      data.Features.Outputs[i] === undefined ||
      data.Features.Outputs[i] === null ||
      data.Features.Outputs[i] === 0 ||
      data.Features.Outputs[i] === `0` ||
      data.Features.Outputs[i].length === 0
    ) {
      if (mustHave) {
        return false
      }
    } else if (!mustHave) {
      return true
    } else {
      potential = true
    }
  }
  return potential
}

const doImagesFilter = (data, filter) =>
  filter.hasImages === undefined ||
  (filter.hasImages === 1 && data.images.length > 0) ||
  (filter.hasImages === 0 && data.images.length === 0)

const doInPossessionFilter = (data, filter) => {
  const inPossession =
    data.In_Possession !== undefined &&
    data.In_Possession !== `0` &&
    data.In_Possession !== ``
  return (
    filter.inPossession === undefined ||
    (filter.inPossession === 1 && inPossession) ||
    (filter.inPossession === 0 && !inPossession)
  )
}

const doSelectFilter = (data, filter) => {
  if (filter[filter.field].length === 0) {
    return true
  }
  const f = filter.filterOn === undefined ? filter.field : filter.filterOn
  if (Array.isArray(data[f])) {
    for (let i = 0; i < data[f].length; i++) {
      if (filter[filter.field].includes(data[f][i])) return true
    }
    return false
  } else if (filter.csvField === true) {
    const arr = String(data[f]).split(`,`)
    for (let i = 0; i < arr.length; i++) {
      if (filter[filter.field].includes(arr[i].trim())) return true
    }
    return false
  }
  return filter[filter.field].includes(data[f])
}

const doConnectFilter = (data, filter) => {
  if (filter[filter.field].length === 0) {
    return true
  }
  if (
    filter[filter.field].includes(`Digital`) &&
    Array.from(data[filter.field].toString().split(`,`)).filter(
      (b) => !b.includes(`Audio`)
    ).length > 0
  ) {
    return true
  }
  if (
    filter[filter.field].includes(`Analogue`) &&
    data[filter.field].includes(`Audio`)
  ) {
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
        (v) => !v.includes(`USB`) && !v.includes(`BT2`) && !v.includes(`BT4LE`)
      ).length > 0
    )
  }
  return false
}

export function initialiseFilter(filter) {
  const features = { Inputs: [], Outputs: [] }
  let tmp = []
  if (filter.urlData !== undefined) {
    switch (filter.field) {
      case `Brand`:
      case `Device`:
        filter.search = filter.urlData
        filter.filterData = doTextFilter
        filter.toUrl = () => encodeURI(filter.urlData)
        break

      case `ButtplugSupport`:
        if (!isNaN(parseInt(filter.urlData, 10))) {
          const bpSupport = parseInt(filter.urlData, 10)
          filter.bpSupport = bpSupport
          filter.filterData = doBpFilter
          filter.toUrl = () => bpSupport
          filter.validateFilter = validateBpFilter
        }
        break

      case `Features`:
        if (filter.features !== undefined) {
          features.Inputs = [...filter.Features.Inputs]
          features.Outputs = [...filter.Features.Outputs]
        }
        decodeURI(filter.urlData)
          .split(`,`)
          .forEach((f) => {
            const match = f.match(new RegExp(`(Inputs|Outputs)(.*)`))
            if (match !== null) {
              features[match[1]].push(match[2])
            }
          })
        if (features[`Inputs`] === undefined) {
          features.Inputs = []
        }
        if (features[`Outputs`] === undefined) {
          features.Outputs = []
        }

        filter.Features = features
        filter.filterData = doFeatureFilter
        filter.toUrl = () => {
          const data = []
          data.push(features.Inputs.map((i) => `Inputs${i}`))
          data.push(features.Outputs.map((o) => `Outputs${o}`))
          return encodeURI(data.flat().join(`,`))
        }
        break

      case `Type`:
        if (filter.Type !== undefined) {
          tmp = [...filter.Type]
        }
        tmp = tmp.concat(decodeURI(filter.urlData).split(`,`))

        filter.Type = tmp
        filter.csvField = true
        filter.filterData = doSelectFilter
        filter.toUrl = () => encodeURI(tmp.join(`,`))
        break

      case `Availability`:
        if (filter.Availability !== undefined) {
          tmp = [...filter.Availability]
        }
        tmp = tmp.concat(decodeURI(filter.urlData).split(`,`))

        filter.Availability = tmp
        filter.filterData = doSelectFilter
        filter.toUrl = () => encodeURI(tmp.join(`,`))
        break

      case `Connection`:
        if (filter.Connection !== undefined) {
          tmp = [...filter.Connection]
        }
        tmp = tmp.concat(decodeURI(filter.urlData).split(`,`))
        filter.Connection = tmp
        filter.filterData = doConnectFilter
        filter.toUrl = () => encodeURI(tmp.join(`,`))
        break

      case `Images`:
        if (!isNaN(parseInt(filter.urlData, 10))) {
          const hasImages = parseInt(filter.urlData, 10)
          filter.hasImages = hasImages
          filter.filterData = doImagesFilter
          filter.toUrl = () => hasImages
        }
        break

      case `InPossession`:
        if (!isNaN(parseInt(filter.urlData, 10))) {
          const inPossession = parseInt(filter.urlData, 10)
          filter.inPossession = inPossession
          filter.filterData = doInPossessionFilter
          filter.toUrl = () => inPossession
        }
        break

      case `XToysSupport`:
        if (!isNaN(parseInt(filter.urlData, 10))) {
          const xtoysSupport = parseInt(filter.urlData, 10)
          filter.xtoysSupport = xtoysSupport
          filter.filterData = doXtoysFilter
          filter.toUrl = () => xtoysSupport
        }
        break

      case `MarketedAs`:
        if (filter.Class !== undefined) {
          tmp = [...filter.Class]
        }
        tmp = tmp.concat(decodeURI(filter.urlData).split(`,`))
        filter.MarketedAs = tmp
        filter.filterOn = `Class`
        filter.filterData = doSelectFilter
        filter.toUrl = () => encodeURI(tmp.join(`,`))
        break

      case `TargetAnatomy`:
        if (filter.Anatomy !== undefined) {
          tmp = [...filter.Anatomy]
        }
        tmp = tmp.concat(decodeURI(filter.urlData).split(`,`))

        filter.TargetAnatomy = tmp
        filter.filterOn = `Anatomy`
        filter.csvField = true
        filter.filterData = doSelectFilter
        filter.toUrl = () => encodeURI(tmp.join(`,`))
        break

      case `Apps`:
        if (filter.Apps !== undefined) {
          tmp = [...filter.Apps]
        }
        tmp = tmp.concat(decodeURI(filter.urlData).split(`,`))

        filter.Apps = tmp
        filter.filterOn = `Apps`
        filter.csvField = true
        filter.filterData = doSelectFilter
        filter.toUrl = () => encodeURI(tmp.join(`,`))
        filter.extraColumns = tmp.map((a) => {
          return {
            dataField: `Apps`,
            text: `${a} Support`,
            sort: false,
            formatter: (cellContent, row) => (
              <div>
                {row[`Apps`].includes(a) === true ? (
                  <CheckCircleIcon style={{ color: `green` }} />
                ) : (
                  <HighlightOffIcon color="error" />
                )}
              </div>
            ),
          }
        })
        break
    }
  }
  return filter
}

export default function DeviceFilter(props) {
  const handleSearchChange = (event, field) => {
    props.onChange(props.ident, {
      field: field || props.filter.field,
      lock: props.filter.lock,
      search: event.target.value,
      filterData: doTextFilter,
      toUrl: () => encodeURI(event.target.value),
    })
  }

  const handleBpChange = (event, mode, field) => {
    const bpSupport = event.target.checked ? mode : 0
    props.onChange(props.ident, {
      field: field || props.filter.field,
      lock: props.filter.lock,
      bpSupport,
      filterData: doBpFilter,
      toUrl: () => bpSupport,
      validateFilter: validateBpFilter,
    })
  }

  const handleXtoysChange = (event, mode, field) => {
    const xtoysSupport = event.target.checked ? mode : 0
    props.onChange(props.ident, {
      field: field || props.filter.field,
      lock: props.filter.lock,
      xtoysSupport,
      filterData: doXtoysFilter,
      toUrl: () => xtoysSupport,
    })
  }

  const handleImagesChange = (event, mode, field) => {
    const hasImages = event.target.checked ? mode : 0
    props.onChange(props.ident, {
      field: field || props.filter.field,
      lock: props.filter.lock,
      hasImages,
      filterData: doImagesFilter,
      toUrl: () => hasImages,
    })
  }

  const handleInPossessionChange = (event, mode, field) => {
    const inPossession = event.target.checked ? mode : 0
    props.onChange(props.ident, {
      field: field || props.filter.field,
      lock: props.filter.lock,
      inPossession,
      filterData: doInPossessionFilter,
      toUrl: () => inPossession,
    })
  }

  const handleFeatureChange = (event, type, feature, field) => {
    let features = { Inputs: [], Outputs: [] }
    if (type === `preset`) {
      features = feature
      if (features[`Inputs`] === undefined) {
        features.Inputs = []
      }
      if (features[`Outputs`] === undefined) {
        features.Outputs = []
      }
    } else {
      if (props.filter.Features !== undefined) {
        features.Inputs = [...props.filter.Features.Inputs]
        features.Outputs = [...props.filter.Features.Outputs]
      }
      const mustHaves = []
      for (const f of features[type]) {
        if (f.endsWith(`!`)) {
          mustHaves.push(f.substring(0, f.length - 1))
        }
      }
      const removed = features[type].filter(
        (x) => !event.target.value.includes(x)
      )
      const added = event.target.value.filter(
        (x) => !features[type].includes(x)
      )
      if (removed.length + added.length === 1) {
        features[type] = event.target.value
        if (added.length === 1 && mustHaves.includes(added[0])) {
          features[type] = features[type].filter(
            (x) => x !== added[0] + `!` && x !== added[0]
          )
        } else if (removed.length === 1) {
          features[type].push(removed[0] + `!`)
        }
      } else {
        features[type] = event.target.value
      }
    }

    props.onChange(props.ident, {
      field: field || props.filter.field,
      lock: props.filter.lock,
      Features: features,
      filterData: doFeatureFilter,
      toUrl: () => {
        const data = []
        data.push(features.Inputs.map((i) => `Inputs${i}`))
        data.push(features.Outputs.map((o) => `Outputs${o}`))
        return encodeURI(data.flat().join(`,`))
      },
    })
  }

  const handleTypeChange = (event, type, field) => {
    let types = []
    if (Array.isArray(type)) {
      types = types.concat(type)
    } else {
      types = event.target.value
    }

    props.onChange(props.ident, {
      field: field || props.filter.field,
      lock: props.filter.lock,
      Type: types,
      csvField: true,
      filterData: doSelectFilter,
      toUrl: () => encodeURI(types.join(`,`)),
    })
  }

  const handleAvailabilityChange = (event, availability, field) => {
    let data = []
    if (Array.isArray(availability)) {
      data = data.concat(availability)
    } else {
      data = event.target.value
    }

    props.onChange(props.ident, {
      field: field || props.filter.field,
      lock: props.filter.lock,
      Availability: data,
      filterData: doSelectFilter,
      toUrl: () => encodeURI(data.join(`,`)),
    })
  }

  const handleConnectionChange = (event, connection, field) => {
    let data = []
    if (Array.isArray(connection)) {
      data = data.concat(connection)
    } else {
      data = event.target.value
    }

    props.onChange(props.ident, {
      field: field || props.filter.field,
      lock: props.filter.lock,
      Connection: data,
      filterData: doConnectFilter,
      toUrl: () => encodeURI(data.join(`,`)),
    })
  }

  const handleMarketedAsChange = (event, market, field) => {
    let data = []
    if (Array.isArray(market)) {
      data = data.concat(market)
    } else {
      data = event.target.value
    }

    props.onChange(props.ident, {
      field: field || props.filter.field,
      lock: props.filter.lock,
      MarketedAs: data,
      filterOn: `Class`,
      filterData: doSelectFilter,
      toUrl: () => encodeURI(data.join(`,`)),
    })
  }

  const handleTargetAnatomyChange = (event, anatomy, field) => {
    let data = []
    if (Array.isArray(anatomy)) {
      data = data.concat(anatomy)
    } else {
      data = event.target.value
    }

    props.onChange(props.ident, {
      field: field || props.filter.field,
      lock: props.filter.lock,
      TargetAnatomy: data,
      filterOn: `Anatomy`,
      csvField: true,
      filterData: doSelectFilter,
      toUrl: () => encodeURI(data.join(`,`)),
    })
  }

  const handleAppsChange = (event, apps, field) => {
    let data = []
    if (Array.isArray(apps)) {
      data = data.concat(apps)
    } else {
      data = event.target.value
    }

    props.onChange(props.ident, {
      field: field || props.filter.field,
      lock: props.filter.lock,
      Apps: data,
      filterOn: `Apps`,
      csvField: true,
      filterData: doSelectFilter,
      toUrl: () => encodeURI(data.join(`,`)),
      extraColumns: data.map((a) => {
        return {
          dataField: `Apps`,
          text: `${a} Support`,
          sort: false,
          formatter: (cellContent, row) => (
            <div>
              {row[`Apps`].includes(a) === true ? (
                <CheckCircleIcon style={{ color: `green` }} />
              ) : (
                <HighlightOffIcon color="error" />
              )}
            </div>
          ),
        }
      }),
    })
  }

  const handleFieldChange = (event) => {
    switch (event.target.value) {
      case `Brand`:
      case `Device`: {
        handleSearchChange(
          {
            target: { value: props.filter.search || `` },
          },
          event.target.value
        )
        break
      }

      case `ButtplugSupport`: {
        const value = parseInt(props.filter.bpSupport, 10)
        handleBpChange(
          { target: { checked: true } },
          isNaN(value) ? 4 : value,
          event.target.value
        )
        break
      }

      case `Features`: {
        const features = {}
        if (props.filter.features !== undefined) {
          features.Inputs = [...props.filter.Features.Inputs]
          features.Outputs = [...props.filter.Features.Outputs]
        }
        handleFeatureChange(null, `preset`, features, event.target.value)
        break
      }

      case `Type`: {
        let tmp = []
        if (props.filter.Type !== undefined) {
          tmp = [...props.filter.Type]
        }
        handleTypeChange(null, tmp, event.target.value)
        break
      }

      case `Availability`: {
        let tmp = []
        if (props.filter.Availability !== undefined) {
          tmp = [...props.filter.Availability]
        }
        handleAvailabilityChange(null, tmp, event.target.value)
        break
      }

      case `Connection`: {
        let tmp = []
        if (props.filter.Connection !== undefined) {
          tmp = [...props.filter.Connection]
        }
        handleConnectionChange(null, tmp, event.target.value)
        break
      }

      case `Images`: {
        const value = parseInt(props.filter.hasImages, 10)
        handleImagesChange(
          { target: { checked: true } },
          isNaN(value) ? 1 : value,
          event.target.value
        )
        break
      }

      case `InPossession`: {
        const value = parseInt(props.filter.inPossession, 10)
        handleInPossessionChange(
          { target: { checked: true } },
          isNaN(value) ? 1 : value,
          event.target.value
        )
        break
      }

      case `XToysSupport`: {
        const value = parseInt(props.filter.xtoysSupport, 10)
        handleXtoysChange(
          { target: { checked: true } },
          isNaN(value) ? 1 : value,
          event.target.value
        )
        break
      }

      case `MarketedAs`: {
        let tmp = []
        if (props.filter.MarketedAs !== undefined) {
          tmp = [...props.filter.MarketedAs]
        }
        handleMarketedAsChange(null, tmp, event.target.value)
        break
      }

      case `TargetAnatomy`: {
        let tmp = []
        if (props.filter.TargetAnatomy !== undefined) {
          tmp = [...props.filter.TargetAnatomy]
        }
        handleTargetAnatomyChange(null, tmp, event.target.value)
        break
      }

      default:
        props.onChange(props.ident, { field: event.target.value })
        break
    }
  }
  // Sanitise data
  if (!props.filter || !props.filter.field) {
    props.filter.field = `none`
  }

  if (props.filter.lock === undefined) {
    props.filter.lock = false
  }

  switch (props.filter.field) {
    case `Brand`:
    case `Device`:
      if (props.filter.search === undefined) {
        props.filter.search = ``
      }
      break

    case `ButtplugSupport`:
      if (props.filter[props.filter.field] === undefined) {
        props.filter[props.filter.field] = 0
      }
      break

    case `Features`:
      if (props.filter[props.filter.field] === undefined) {
        props.filter[props.filter.field] = { Inputs: [], Outputs: [] }
      }
      if (props.filterData[props.filter.field] === undefined) {
        props.filterData[props.filter.field] = { Inputs: [], Outputs: [] }
      }
      break

    case `Type`:
    case `Availability`:
    case `Connection`:
    case `TargetAnatomy`:
    case `MarketedAs`:
      if (props.filter[props.filter.field] === undefined) {
        props.filter[props.filter.field] = []
      }
      if (props.filterData[props.filter.field] === undefined) {
        props.filterData[props.filter.field] = []
      }
      break
  }

  return (
    <FormGroup row={true}>
      <StyledFormControl variant="standard">
        <InputLabel>Choose a field:</InputLabel>
        <Select
          value={props.filter.field}
          onChange={handleFieldChange}
          inputProps={{ readOnly: props.filter.lock }}
        >
          <MenuItem value={`none`}>None</MenuItem>
          <MenuItem value={`Brand`}>Brand</MenuItem>
          <MenuItem value={`Device`}>Device Name</MenuItem>
          <MenuItem value={`Availability`}>Availability</MenuItem>
          <MenuItem value={`Connection`}>Connectivity</MenuItem>
          <MenuItem value={`Type`}>Form Factor</MenuItem>
          <MenuItem value={`ButtplugSupport`}>Buttplug.io Support</MenuItem>
          <MenuItem value={`XToysSupport`}>XToys.app Support</MenuItem>
          <MenuItem value={`Features`}>Features</MenuItem>
          <MenuItem value={`TargetAnatomy`}>Vendor's Target Anatomy</MenuItem>
          <MenuItem value={`MarketedAs`}>Marketed As</MenuItem>
          {props.filter.field === `Apps` && (
            <MenuItem value={`Apps`}>Applications</MenuItem>
          )}
        </Select>
      </StyledFormControl>
      {(props.filter.field === `Brand` || props.filter.field === `Device`) && (
        <StyledFormControl variant="standard">
          <StyledDebouncedTextField
            label={`Search ${props.filter.field}`}
            type="search"
            value={props.filter.search ? props.filter.search : ``}
            onChange={(e) => handleSearchChange(e)}
            inputProps={{ readOnly: props.filter.lock }}
            variant="standard"
          />
        </StyledFormControl>
      )}
      {props.filter.field === `ButtplugSupport` && (
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => handleBpChange(e, 4)}
              checked={
                props.filter.bpSupport === undefined ||
                (props.filter.bpSupport & 4) !== 0
              }
              disabled={props.filter.lock}
            />
          }
          label="Supported"
        />
      )}
      {props.filter.field === `Features` && (
        <StyledFormControl variant="standard">
          <InputLabel>Outputs</InputLabel>
          <Select
            multiple
            value={props.filter.Features.Outputs}
            input={<Input />}
            renderValue={(selected) => selected.join(`, `)}
            MenuProps={MenuProps}
            onChange={(e) => handleFeatureChange(e, `Outputs`)}
            inputProps={{ readOnly: props.filter.lock }}
          >
            {props.filterData.Features !== undefined &&
              props.filterData.Features.Outputs.map((a, i) => (
                <MenuItem key={i} value={a}>
                  <Checkbox
                    checked={
                      props.filter.Features.Outputs.includes(a) ||
                      props.filter.Features.Outputs.includes(a + `!`)
                    }
                    indeterminate={props.filter.Features.Outputs.includes(a)}
                  />
                  <ListItemText primary={a} />
                </MenuItem>
              ))}
          </Select>
        </StyledFormControl>
      )}
      {props.filter.field === `Features` && (
        <StyledFormControl variant="standard">
          <InputLabel>Inputs</InputLabel>
          <Select
            multiple
            value={props.filter.Features.Inputs}
            input={<Input />}
            renderValue={(selected) => selected.join(`, `)}
            MenuProps={MenuProps}
            onChange={(e) => handleFeatureChange(e, `Inputs`)}
            inputProps={{ readOnly: props.filter.lock }}
          >
            {props.filterData.Features !== undefined &&
              props.filterData.Features.Inputs.map((a, i) => (
                <MenuItem key={i} value={a}>
                  <Checkbox
                    checked={
                      props.filter.Features.Inputs.includes(a) ||
                      props.filter.Features.Inputs.includes(a + `!`)
                    }
                    indeterminate={!props.filter.Features.Inputs.includes(a)}
                  />
                  <ListItemText primary={a} />
                </MenuItem>
              ))}
          </Select>
        </StyledFormControl>
      )}
      {props.filter.field === `Type` && (
        <StyledFormControl variant="standard">
          <InputLabel>Type</InputLabel>
          <Select
            multiple
            value={props.filter.Type}
            input={<Input />}
            renderValue={(selected) => selected.join(`, `)}
            MenuProps={MenuProps}
            onChange={handleTypeChange}
            inputProps={{ readOnly: props.filter.lock }}
          >
            {props.filterData.Type !== undefined &&
              props.filterData.Type.map((a, i) => (
                <MenuItem key={i} value={a}>
                  <Checkbox checked={props.filter.Type.includes(a)} />
                  <ListItemText primary={a} />
                </MenuItem>
              ))}
          </Select>
        </StyledFormControl>
      )}
      {props.filter.field === `Availability` && (
        <StyledFormControl variant="standard">
          <InputLabel>Availability</InputLabel>
          <Select
            multiple
            value={props.filter.Availability}
            input={<Input />}
            renderValue={(selected) => selected.join(`, `)}
            onChange={handleAvailabilityChange}
            MenuProps={MenuProps}
            inputProps={{ readOnly: props.filter.lock }}
          >
            {props.filterData.Availability.map((a, i) => (
              <MenuItem key={i} value={a}>
                <Checkbox checked={props.filter.Availability.includes(a)} />
                <ListItemText primary={a} />
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      )}
      {props.filter.field === `Connection` && (
        <StyledFormControl variant="standard">
          <InputLabel>Connectivity</InputLabel>
          <Select
            multiple
            value={props.filter.Connection}
            input={<Input />}
            onChange={handleConnectionChange}
            renderValue={(selected) => selected.join(`, `)}
            MenuProps={MenuProps}
            inputProps={{ readOnly: props.filter.lock }}
          >
            {[
              `Digital`,
              `Analogue`,
              `Bluetooth 2`,
              `Bluetooth 4 LE`,
              `USB`,
              `Other`,
            ].map((a, i) => (
              <MenuItem key={i} value={a}>
                <Checkbox checked={props.filter.Connection.includes(a)} />
                <ListItemText primary={a} />
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      )}
      {props.filter.field === `XToysSupport` && (
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => handleXtoysChange(e, 1)}
              checked={
                props.filter.xtoysSupport === undefined ||
                props.filter.xtoysSupport === 1
              }
              disabled={props.filter.lock}
            />
          }
          label="Supported"
        />
      )}
      {props.filter.field === `MarketedAs` && (
        <StyledFormControl variant="standard">
          <InputLabel>Marketed As</InputLabel>
          <Select
            multiple
            value={props.filter.MarketedAs}
            input={<Input />}
            renderValue={(selected) => selected.join(`, `)}
            onChange={handleMarketedAsChange}
            MenuProps={MenuProps}
            inputProps={{ readOnly: props.filter.lock }}
          >
            {props.filterData.Class !== undefined &&
              props.filterData.Class.map((a, i) => (
                <MenuItem key={i} value={a}>
                  <Checkbox checked={props.filter.MarketedAs.includes(a)} />
                  <ListItemText primary={a} />
                </MenuItem>
              ))}
          </Select>
        </StyledFormControl>
      )}
      {props.filter.field === `TargetAnatomy` && (
        <StyledFormControl variant="standard">
          <InputLabel>Anatomy</InputLabel>
          <Select
            multiple
            value={props.filter.TargetAnatomy}
            input={<Input />}
            renderValue={(selected) => selected.join(`, `)}
            onChange={handleTargetAnatomyChange}
            MenuProps={MenuProps}
            inputProps={{ readOnly: props.filter.lock }}
          >
            {props.filterData.Anatomy !== undefined &&
              props.filterData.Anatomy.map((a, i) => (
                <MenuItem key={i} value={a}>
                  <Checkbox checked={props.filter.TargetAnatomy.includes(a)} />
                  <ListItemText primary={a} />
                </MenuItem>
              ))}
          </Select>
        </StyledFormControl>
      )}
      {props.filter.field === `Apps` && (
        <StyledFormControl variant="standard">
          <InputLabel>Applications</InputLabel>
          <Select
            multiple
            value={props.filter.Apps}
            input={<Input />}
            renderValue={(selected) => selected.join(`, `)}
            onChange={handleAppsChange}
            MenuProps={MenuProps}
            inputProps={{ readOnly: props.filter.lock }}
          >
            {props.filterData.Apps !== undefined &&
              props.filterData.Apps.map((a, i) => (
                <MenuItem key={i} value={a}>
                  <Checkbox checked={props.filter.Apps.includes(a)} />
                  <ListItemText primary={a} />
                </MenuItem>
              ))}
          </Select>
        </StyledFormControl>
      )}
      {!props.filter.lock && (
        <IconButton
          sx={{ margin: theme.spacing(1) }}
          aria-label="delete"
          onClick={() => props.onRemove(props.ident)}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </FormGroup>
  )
}
