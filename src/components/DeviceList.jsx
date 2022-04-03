import React, { useState } from "react"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import { makeStyles } from "@mui/styles"
import AddIcon from "@mui/icons-material/Add"
import InfoIcon from "@mui/icons-material/Info"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import CompareIcon from "@mui/icons-material/Compare"
import LazyLoad from "react-lazyload"
import { Link } from "gatsby"
import Tooltip from "@mui/material/Tooltip"
import AffiliateLink from "./AffiliateLink"
import Snackbar from "@mui/material/Snackbar"
import Button from "@mui/material/Button"
import CloseIcon from "@mui/icons-material/Close"
import IconButton from "@mui/material/IconButton"
import { navigate } from "gatsby-link"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import HelpIcon from "@mui/icons-material/Help"
import ErrorIcon from "@mui/icons-material/Error"

export function encode(string) {
  return encodeURIComponent(string)
    .replace(/%20/g, ` `)
    .replace(/%[0-9A-Fa-f]{2}/g, `_`)
}

const columns = [
  {
    dataField: `id`,
    hidden: true,
  },
  {
    dataField: `images`,
    text: `Image`,
    formatter: (cellContent, row, classes) => (
      <div>
        {cellContent && cellContent.length > 0 && (
          <LazyLoad height={50}>
            <img
              src={`devices/${encode(row.Brand)}/${encode(
                row.Device
              )}/thumb.jpeg`}
              className={classes.thumbnail}
              alt={`${row.Brand} - ${row.Device} - Thumbnail`}
            />
          </LazyLoad>
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
    formatter: (cellContent, row, classes) => (
      <div className={classes.bpsupp}>
        {(row.Buttplug.ButtplugSupport & 4) === 4 &&
        row.Buttplug.Buttplug_Rust === `Issues` ? (
          <ErrorIcon style={{ color: `orange` }} />
        ) : (row.Buttplug.ButtplugSupport & 4) === 4 &&
          row.Buttplug.Buttplug_Rust === `Untested` ? (
          <HelpIcon style={{ color: `blue` }} />
        ) : (row.Buttplug.ButtplugSupport & 4) === 4 ? (
          <CheckCircleIcon style={{ color: `green` }} />
        ) : row.Buttplug.ButtplugSupport !== 0 ? (
          <HighlightOffIcon style={{ color: `grey` }} />
        ) : (
          <HighlightOffIcon color="error" />
        )}
        {(row.Buttplug.ButtplugSupport & 4 && (
          <span>
            {row.Buttplug.Buttplug_Rust === `Untested` && ` (Untested)`}
            {row.Buttplug.Buttplug_Rust === `Issues` && ` (Known Issues)`}
          </span>
        )) ||
          (row.Buttplug.ButtplugSupport & 3 && (
            <span>
              Deprecated support:
              {(row.Buttplug.ButtplugSupport & 1 && ` C#`) || ``}
              {(row.Buttplug.ButtplugSupport & 1 &&
                row.Buttplug.Buttplug_CSharp === `Untested` &&
                ` (Untested)`) ||
                ``}
              {(row.Buttplug.ButtplugSupport & 1 &&
                row.Buttplug.Buttplug_CSharp === `Issues` &&
                ` (Known Issues)`) ||
                ``}
              {(row.Buttplug.ButtplugSupport & 2 && ` JS`) || ``}
              {((row.Buttplug.ButtplugSupport & 2 &&
                row.Buttplug.Buttplug_JS === `Untested`) ||
                ``) &&
                ` (Untested)`}
              {((row.Buttplug.ButtplugSupport & 2 &&
                row.Buttplug.Buttplug_JS === `Issues`) ||
                ``) &&
                ` (Known Issues)`}
            </span>
          )) ||
          ``}
        {row.Buttplug.Buttplug_Support_Notes.length > 0 && (
          <Tooltip
            interactive
            title={row.Buttplug.Buttplug_Support_Notes}
            classes={{ tooltip: classes.tooltip }}
          >
            <InfoIcon />
          </Tooltip>
        )}
      </div>
    ),
  },
  {
    dataField: `XToys.XToysSupport`,
    text: `XToys.app Support`,
    sort: true,
    formatter: (cellContent, row, classes) => (
      <div className={classes.bpsupp}>
        {row.XToys.XToysSupport === 1 ? (
          <CheckCircleIcon style={{ color: `green` }} />
        ) : (
          <HighlightOffIcon color="error" />
        )}
        {row.XToys.XToys_Support_Notes.length > 0 && (
          <Tooltip
            interactive
            title={row.XToys.XToys_Support_Notes}
            classes={{ tooltip: classes.tooltip }}
          >
            <InfoIcon />
          </Tooltip>
        )}
      </div>
    ),
  },
  {
    dataField: `Detail`,
    text: `Url`,
    formatter: (cellContent, row) => <AffiliateLink device={row} />,
  },
]

function EnhancedTableHead(props) {
  return (
    <TableHead>
      <TableRow>
        <TableCell>
          {(props.compareMode && <CompareIcon />) || <InfoIcon />}
        </TableCell>
        {columns.map((col, id) =>
          col.hidden ? null : (
            <TableCell
              key={id}
              align={col.numeric ? `right` : `left`}
              padding={col.disablePadding ? `none` : `default`}
            >
              {col.sort ? (
                <TableSortLabel>{col.text}</TableSortLabel>
              ) : (
                col.text
              )}
            </TableCell>
          )
        )}
      </TableRow>
    </TableHead>
  )
}

const useStyles = makeStyles((theme) => {
  return {
    devList: {
      width: `100%`,
      marginTop: theme.spacing(3),
    },
    table: {
      minWidth: 750,
    },
    tableWrapper: {
      overflowX: `auto`,
    },
    visuallyHidden: {
      border: 0,
      clip: `rect(0 0 0 0)`,
      height: 1,
      margin: -1,
      overflow: `hidden`,
      padding: 0,
      position: `absolute`,
      top: 20,
      width: 1,
    },
    thumbnail: {
      "object-fit": `cover`,
      width: `50px`,
      height: `50px`,
    },
    tooltip: {
      maxWidth: 500,
      fontSize: theme.typography.pxToRem(12),
      backgroundColor: `#ffffff`,
      color: `#000000`,
    },
    bpsupp: {
      display: `flex`,
      alignItems: `center`,
      "& span": {
        margin: 5,
      },
    },
    tooltipcolumn: {
      display: `flex`,
      alignItems: `center`,
    },
    close: {
      padding: theme.spacing(0.5),
    },
    notalink: {
      color: `black`,
    },
  }
})

function toggleCompare(dev, compares, setCompares) {
  const idx = compares.indexOf(dev)
  if (idx === -1) {
    compares.push(dev)
  } else {
    compares.splice(idx, 1)
  }
  setCompares(compares)
}

function CompareSnackbar(props) {
  const handleClose = (event, reason) => {
    if (reason === `clickaway`) {
      return
    }

    props.setCompareMode(false)
    props.setCompares([])
  }

  return (
    <Snackbar
      open={props.compareMode}
      onClose={handleClose}
      message={
        props.compareCount < 2
          ? `Select at least 2 devices to compare`
          : `Compare ${props.compareCount} devices`
      }
      action={
        <React.Fragment>
          {props.compareCount > 1 && (
            <Button color="inherit" size="small" onClick={props.doCompare}>
              Compare
            </Button>
          )}
          <IconButton
            aria-label="close"
            color="inherit"
            className={props.classes.close}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </React.Fragment>
      }
    />
  )
}

export default function DeviceList(props) {
  const classes = useStyles()
  const data = props.data
  const [compares, setCompares] = useState([])

  const doCompare = () => {
    navigate(`/compare?` + compares.join(`&`))
  }

  const rows = data.map((row) => (
    <TableRow hover tabIndex={-1} key={row.id}>
      <TableCell>
        {!props.compareMode && row.path !== undefined && (
          <Link to={`/devices/${row.path}`}>
            <AddIcon />
          </Link>
        )}
        {!props.compareMode && row.path === undefined && (
          <Link to={`/devices/${encode(row.Brand)}/${encode(row.Device)}`}>
            <AddIcon />
          </Link>
        )}
        {props.compareMode && (
          <a
            href={location.pathname + location.search + `#compare`}
            onClick={() =>
              toggleCompare(
                row.path !== undefined
                  ? row.path
                  : `${encode(row.Brand)}/${encode(row.Device)}`,
                [...compares],
                setCompares
              )
            }
            className={classes.notalink}
          >
            {(compares.includes(row.path) && <CheckBoxIcon />) || (
              <CheckBoxOutlineBlankIcon />
            )}
          </a>
        )}
      </TableCell>
      {columns.map((col, id) =>
        col.hidden ? null : (
          <TableCell key={id}>
            {col.formatter
              ? col.formatter(row[col.dataField], row, classes)
              : row[col.dataField]}
          </TableCell>
        )
      )}
    </TableRow>
  ))

  return (
    <div className={classes.devList}>
      <CompareSnackbar
        compareMode={props.compareMode}
        setCompareMode={props.setCompareMode}
        setCompares={setCompares}
        compareCount={compares.length}
        doCompare={doCompare}
        classes={classes}
      />
      <div className={classes.tableWrapper}>
        <Table className={classes.table} aria-label="device table">
          <EnhancedTableHead
            compareMode={props.compareMode}
            setCompareMode={props.setCompareMode}
            setCompares={setCompares}
            classes={classes}
          />
          <TableBody>{rows}</TableBody>
        </Table>
      </div>
    </div>
  )
}
