import React, { useState } from "react"
import TableRow from "@material-ui/core/TableRow"
import TableSortLabel from "@material-ui/core/TableSortLabel"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import { makeStyles } from "@material-ui/core/styles"
import AddIcon from "@material-ui/icons/Add"
import InfoIcon from "@material-ui/icons/Info"
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import CheckBoxIcon from "@material-ui/icons/CheckBox"
import CompareIcon from "@material-ui/icons/Compare"
import LazyLoad from "react-lazyload"
import { Link } from "gatsby"
import Tooltip from "@material-ui/core/Tooltip"
import AffiliateLink from "./AffiliateLink"
import Snackbar from "@material-ui/core/Snackbar"
import Button from "@material-ui/core/Button"
import CloseIcon from "@material-ui/icons/Close"
import IconButton from "@material-ui/core/IconButton"
import { navigate } from "gatsby-link"

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
              src={cellContent[0]}
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
        {(row.Buttplug.ButtplugSupport & 1 && (
          <span>
            {` C#`}
            {row.Buttplug.Buttplug_CSharp === `Untested` && ` (Untested)`}
            {row.Buttplug.Buttplug_CSharp === `Issues` && ` (Known Issues)`}
          </span>
        )) ||
          ``}
        {(row.Buttplug.ButtplugSupport & 2 && (
          <span>
            {` JS`}
            {row.Buttplug.Buttplug_JS === `Untested` && ` (Untested)`}
            {row.Buttplug.Buttplug_JS === `Issues` && ` (Known Issues)`}
          </span>
        )) ||
          ``}
        {(row.Buttplug.ButtplugSupport & 4 && (
          <span>
            {` Rust`}
            {row.Buttplug.Buttplug_Rust === `Untested` && ` (Untested)`}
            {row.Buttplug.Buttplug_Rust === `Issues` && ` (Known Issues)`}
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
    dataField: `Detail`,
    text: `Url`,
    formatter: (cellContent, row) => <AffiliateLink device={row} />,
  },
]

function EnhancedTableHead(props) {
  const baseUrl = typeof windows !== 'undefined' ? (window.location.pathname + window.location.search) : ""
  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <a
            href={
              baseUrl + props.compareMode ? `#compare` : ``
            }
            onClick={() => {
              props.setCompareMode(!props.compareMode)
              props.setCompares([])
            }}
            className={props.classes.notalink}
          >
            {(props.compareMode && <CompareIcon />) || <InfoIcon />}
          </a>
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
    console.log(reason)
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
  const [compareMode, setCompareMode] = useState(false)
  const [compares, setCompares] = useState([])

  const doCompare = () => {
    navigate(`/compare?` + compares.join(`&`))
  }

  return (
    <div className={classes.devList}>
      <CompareSnackbar
        compareMode={compareMode}
        setCompareMode={setCompareMode}
        setCompares={setCompares}
        compareCount={compares.length}
        doCompare={doCompare}
        classes={classes}
      />
      <div className={classes.tableWrapper}>
        <Table className={classes.table} aria-label="device table">
          <EnhancedTableHead
            compareMode={compareMode}
            setCompareMode={setCompareMode}
            setCompares={setCompares}
            classes={classes}
          />
          <TableBody>
            {data.map((row) => (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell>
                  {!compareMode && (
                    <Link
                      to={
                        `/devices/` +
                        encode(row.Brand) +
                        `/` +
                        encode(row.Device)
                      }
                    >
                      <AddIcon />
                    </Link>
                  )}
                  {compareMode && (
                    <a
                      href={location.pathname + location.search + `#compare`}
                      onClick={() =>
                        toggleCompare(
                          encode(row.Brand) + `/` + encode(row.Device),
                          [...compares],
                          setCompares
                        )
                      }
                      className={classes.notalink}
                    >
                      {(compares.includes(
                        encode(row.Brand) + `/` + encode(row.Device)
                      ) && <CheckBoxIcon />) || <CheckBoxOutlineBlankIcon />}
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
