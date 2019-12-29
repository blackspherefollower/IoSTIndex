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

const DebouncedTextField = debouncedInput(TextField, { timeout: 200 })

const useStyles = makeStyles(theme => {
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

  console.log(props)

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
            .forEach(f => {
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
      }
    }
  }, [])

  const handleFieldChange = event => {
    props.onChange(props.ident, { field: event.target.value })
  }

  const doTextFilter = (data, filter) =>
    data[filter.field].match(new RegExp(filter.search, `i`)) !== null

  const handleSearchChange = event => {
    props.onChange(props.ident, {
      field: props.filter.field,
      search: event.target.value,
      filterData: doTextFilter,
      toUrl: () => encodeURI(event.target.value),
    })
  }

  const doBpFilter = (data, filter) =>
    (data.Buttplug.ButtplugSupport & filter.bpSupport) !== 0

  const handleBpChange = (event, mode) => {
    const bpSupport =
      (props.filter.bpSupport &= ~mode) | (event.target.checked ? mode : 0)
    props.onChange(props.ident, {
      field: props.filter.field,
      bpSupport,
      filterData: doBpFilter,
      toUrl: () => bpSupport,
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

  const handleFeatureChange = (event, type, feature) => {
    let features = { Inputs: [], Outputs: [] }
    if (type === `preset`) {
      features = feature
    } else {
      if (props.filter.Features !== undefined) {
        features.Inputs = [...props.filter.Features.Inputs]
        features.Outputs = [...props.filter.Features.Outputs]
      }
      features[type] = event.target.value
    }

    props.onChange(props.ident, {
      field: props.filter.field,
      Features: features,
      filterData: doFeatureFilter,
      toUrl: () => {
        const data = []
        data.push(features.Inputs.map(i => `Inputs${i}`))
        data.push(features.Outputs.map(o => `Outputs${o}`))
        return encodeURI(data.flat().join(`,`))
      },
    })
  }

  const doSelectFilter = (data, filter) => {
    if (filter[filter.field].length === 0) {
      return true
    }
    return filter[filter.field].includes(data[filter.field])
  }

  const handleTypeChange = (event, type) => {
    let types = []
    if (Array.isArray(type)) {
      types = types.concat(type)
    } else {
      types = event.target.value
    }

    props.onChange(props.ident, {
      field: props.filter.field,
      Type: types,
      filterData: doSelectFilter,
      toUrl: () => encodeURI(types.join(`,`)),
    })
  }

  const handleAvailabilityChange = (event, availability) => {
    let data = []
    if (Array.isArray(availability)) {
      data = data.concat(availability)
    } else {
      data = event.target.value
    }

    props.onChange(props.ident, {
      field: props.filter.field,
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

  const handleConnectionChange = (event, connection) => {
    let data = []
    if (Array.isArray(connection)) {
      data = data.concat(connection)
    } else {
      data = event.target.value
    }

    props.onChange(props.ident, {
      field: props.filter.field,
      Connection: data,
      filterData: doConnectFilter,
      toUrl: () => encodeURI(data.join(`,`)),
    })
  }

  // Sanitise data
  if (props.filter === undefined || props.filter.field === undefined) {
    props.filter.field = `none`
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
        <Select value={props.filter.field} onChange={handleFieldChange}>
          <MenuItem value={`none`}>None</MenuItem>
          <MenuItem value={`Brand`}>Brand</MenuItem>
          <MenuItem value={`Device`}>Device Name</MenuItem>
          <MenuItem value={`Availability`}>Availability</MenuItem>
          <MenuItem value={`Connection`}>Connectivity</MenuItem>
          <MenuItem value={`Type`}>Form Factor</MenuItem>
          <MenuItem value={`ButtplugSupport`}>Buttplug Support</MenuItem>
          <MenuItem value={`Features`}>Features</MenuItem>
        </Select>
      </FormControl>
      {(props.filter.field === `Brand` || props.filter.field === `Device`) && (
        <FormControl className={classes.formControl}>
          <DebouncedTextField
            label={`Search ${props.filter.field}`}
            type="search"
            className={classes.textField}
            value={props.filter.search ? props.filter.search : ``}
            onChange={e => handleSearchChange(e)}
          />
        </FormControl>
      )}
      {props.filter.field === `ButtplugSupport` && (
        <FormControlLabel
          control={
            <Checkbox
              onChange={e => handleBpChange(e, 1)}
              checked={props.filter.bpSupport & 1}
            />
          }
          label="C#"
        />
      )}
      {props.filter.field === `ButtplugSupport` && (
        <FormControlLabel
          control={
            <Checkbox
              onChange={e => handleBpChange(e, 2)}
              checked={props.filter.bpSupport & 2}
            />
          }
          label="JS"
        />
      )}
      {props.filter.field === `Features` && (
        <FormControl className={classes.formControl}>
          <InputLabel>Outputs</InputLabel>
          <Select
            multiple
            value={props.filter.Features.Outputs}
            input={<Input />}
            renderValue={selected => selected.join(`, `)}
            MenuProps={MenuProps}
            onChange={e => handleFeatureChange(e, `Outputs`)}
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
            renderValue={selected => selected.join(`, `)}
            MenuProps={MenuProps}
            onChange={e => handleFeatureChange(e, `Inputs`)}
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
            renderValue={selected => selected.join(`, `)}
            MenuProps={MenuProps}
            onChange={handleTypeChange}
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
            renderValue={selected => selected.join(`, `)}
            onChange={handleAvailabilityChange}
            MenuProps={MenuProps}
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
            renderValue={selected => selected.join(`, `)}
            MenuProps={MenuProps}
          >
            {[`Bluetooth 2`, `Bluetooth 4 LE`, `USB`, `Other`].map((a, i) => (
              <MenuItem key={i} value={a}>
                <Checkbox checked={props.filter.Connection.includes(a)} />
                <ListItemText primary={a} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <IconButton
        className={classes.button}
        aria-label="delete"
        onClick={() => props.onRemove(props.ident)}
      >
        <DeleteIcon />
      </IconButton>
    </FormGroup>
  )
}
