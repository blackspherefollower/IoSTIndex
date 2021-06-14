import React from "react"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import makeStyles from "@material-ui/core/styles/makeStyles"
import TextField from "@material-ui/core/TextField"
import DeleteIcon from "@material-ui/icons/Delete"
import FormGroup from "@material-ui/core/FormGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import Input from "@material-ui/core/Input"
import ListItemText from "@material-ui/core/ListItemText"
import IconButton from "@material-ui/core/IconButton"
import debouncedInput from "./debouncedInput"

const DebouncedTextField = debouncedInput(TextField, 500)

const useStyles = makeStyles((theme) => {
  return {
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    button: {
      margin: theme.spacing(1),
    },
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

export default function DeviceFilter(props) {
  const classes = useStyles()

  React.useEffect(() => {
    const features = { Inputs: [], Outputs: [] }
    let tmp = []
    if (props.filter.urlData !== undefined) {
      switch (props.filter.field) {
        case `Brand`:
        case `Device`:
          handleSearchChange({
            target: { value: decodeURI(props.filter.urlData) },
          })
          break

        case `ButtplugSupport`:
          if (!isNaN(parseInt(props.filter.urlData, 10))) {
            handleBpChange(
              { target: { checked: true } },
              parseInt(props.filter.urlData, 10)
            )
          }
          break

        case `Features`:
          if (props.filter.features !== undefined) {
            features.Inputs = [...props.filter.Features.Inputs]
            features.Outputs = [...props.filter.Features.Outputs]
          }
          decodeURI(props.filter.urlData)
            .split(`,`)
            .forEach((f) => {
              const match = f.match(new RegExp(`(Inputs|Outputs)(.*)`))
              if (match !== null) {
                features[match[1]].push(match[2])
              }
            })
          handleFeatureChange(null, `preset`, features)
          break

        case `Type`:
          if (props.filter.Type !== undefined) {
            tmp = [...props.filter.Type]
          }
          tmp = tmp.concat(decodeURI(props.filter.urlData).split(`,`))
          handleTypeChange(null, tmp)
          break

        case `Availability`:
          if (props.filter.Availability !== undefined) {
            tmp = [...props.filter.Availability]
          }
          tmp = tmp.concat(decodeURI(props.filter.urlData).split(`,`))
          handleAvailabilityChange(null, tmp)
          break

        case `Connection`:
          if (props.filter.Connection !== undefined) {
            tmp = [...props.filter.Connection]
          }
          tmp = tmp.concat(decodeURI(props.filter.urlData).split(`,`))
          handleConnectionChange(null, tmp)
          break

        case `Images`:
          if (!isNaN(parseInt(props.filter.urlData, 10))) {
            handleImagesChange(
              { target: { checked: true } },
              parseInt(props.filter.urlData, 10)
            )
          }
          break

        case `XToysSupport`:
          if (!isNaN(parseInt(props.filter.urlData, 10))) {
            handleXtoysChange(
              { target: { checked: true } },
              parseInt(props.filter.urlData, 10)
            )
          }
          break
      }
    }
  }, [])

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
        const value = parseInt(props.filter.xtoysSupport, 10)
        handleImagesChange(
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

  const doTextFilter = (data, filter) =>
    data[filter.field].match(new RegExp(filter.search, `i`)) !== null

  const handleSearchChange = (event, field) => {
    props.onChange(props.ident, {
      field: field || props.filter.field,
      lock: props.filter.lock,
      search: event.target.value,
      filterData: doTextFilter,
      toUrl: () => encodeURI(event.target.value),
    })
  }

  const doBpFilter = (data, filter) =>
    filter.bpSupport === undefined ||
    (filter.bpSupport === 0 &&
      (data.Buttplug.ButtplugSupport === 0 ||
        isNaN(data.Buttplug.ButtplugSupport))) ||
    (filter.bpSupport !== 0 &&
      (data.Buttplug.ButtplugSupport & filter.bpSupport) === filter.bpSupport)

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
          `Buttplug C# has been deprecated in favour of Buttplug Rust and WASM bindings. ` +
            `Consider resetting the Buttplug Support filter.`
        )
      }
    }
    return errors
  }

  const handleBpChange = (event, mode, field) => {
    const bpSupport =
      (props.filter.bpSupport &= ~mode) | (event.target.checked ? mode : 0)
    props.onChange(props.ident, {
      field: field || props.filter.field,
      lock: props.filter.lock,
      bpSupport,
      filterData: doBpFilter,
      toUrl: () => bpSupport,
      validateFilter: validateBpFilter,
    })
  }

  const doXtoysFilter = (data, filter) =>
    filter.xtoysSupport === undefined ||
    data.XToys.XToysSupport === filter.xtoysSupport

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

  const doImagesFilter = (data, filter) =>
    filter.hasImages === undefined ||
    (filter.hasImages === 1 && data.images.length > 0) ||
    (filter.hasImages === 0 && data.images.length === 0)

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

  const doFeatureFilter = (data, filter) => {
    for (const i of filter.Features.Inputs) {
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
    for (const i of filter.Features.Outputs) {
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
      features[type] = event.target.value
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
    }
    return filter[filter.field].includes(data[f])
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
          (v) =>
            !v.includes(`USB`) && !v.includes(`BT2`) && !v.includes(`BT4LE`)
        ).length > 0
      )
    }
    return false
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
      csvField: `true`,
      filterData: doSelectFilter,
      toUrl: () => encodeURI(data.join(`,`)),
    })
  }

  // Sanitise data
  if (props.filter === undefined || props.filter.field === undefined) {
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
    <FormGroup row>
      <FormControl className={classes.formControl}>
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
        </Select>
      </FormControl>
      {(props.filter.field === `Brand` || props.filter.field === `Device`) && (
        <FormControl className={classes.formControl}>
          <DebouncedTextField
            label={`Search ${props.filter.field}`}
            type="search"
            className={classes.textField}
            value={props.filter.search ? props.filter.search : ``}
            onChange={(e) => handleSearchChange(e)}
            inputProps={{ readOnly: props.filter.lock }}
          />
        </FormControl>
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
        <FormControl className={classes.formControl}>
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
                    checked={props.filter.Features.Outputs.includes(a)}
                  />
                  <ListItemText primary={a} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}
      {props.filter.field === `Features` && (
        <FormControl className={classes.formControl}>
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
                    checked={props.filter.Features.Inputs.includes(a)}
                  />
                  <ListItemText primary={a} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}
      {props.filter.field === `Type` && (
        <FormControl className={classes.formControl}>
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
        </FormControl>
      )}
      {props.filter.field === `Availability` && (
        <FormControl className={classes.formControl}>
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
        </FormControl>
      )}
      {props.filter.field === `Connection` && (
        <FormControl className={classes.formControl}>
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
        </FormControl>
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
        <FormControl className={classes.formControl}>
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
        </FormControl>
      )}
      {props.filter.field === `TargetAnatomy` && (
        <FormControl className={classes.formControl}>
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
        </FormControl>
      )}
      {!props.filter.lock && (
        <IconButton
          className={classes.button}
          aria-label="delete"
          onClick={() => props.onRemove(props.ident)}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </FormGroup>
  )
}
