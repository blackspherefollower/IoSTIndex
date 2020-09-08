import React from "react"
import TableRow from "@material-ui/core/TableRow"
import TableSortLabel from "@material-ui/core/TableSortLabel"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import { makeStyles } from "@material-ui/core/styles"
import AddIcon from "@material-ui/icons/Add"
import InfoIcon from "@material-ui/icons/Info"
import LazyLoad from "react-lazyload"
import { Link } from "gatsby"
import Tooltip from "@material-ui/core/Tooltip"
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn"

function encode(string) {
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
    formatter: (cellContent, row, classes) => {
      const hasUrl = cellContent.length > 0
      const hasAUrl = row.Affiliate_Link.length > 0

      if (hasAUrl) {
        return (
          <div className={classes.tooltipcolumn}>
            <a
              href={row.Affiliate_Link}
              title={`Affiliate link: ${row.Brand} - ${row.Device}`}
            >
              {row.Affiliate_Link}
            </a>
            <Tooltip
              interactive
              title={
                <React.Fragment>
                  This URL is an affiliate link: purchases made via this link
                  contribute towards maintaining this site and buying devices
                  for more thorough technical reviews.
                  {hasUrl && (
                    <span>
                      {` `}
                      The direct link to the product is:{` `}
                      <a
                        href={cellContent}
                        title={`Product link: ${row.Brand} - ${row.Device}`}
                      >
                        {cellContent}
                      </a>
                    </span>
                  )}
                </React.Fragment>
              }
              classes={{ tooltip: classes.tooltip }}
            >
              <MonetizationOnIcon />
            </Tooltip>
          </div>
        )
      } else if (hasUrl) {
        return (
          <div>
            <a
              href={cellContent}
              title={`Product link: ${row.Brand} - ${row.Device}`}
            >
              {cellContent}
            </a>
          </div>
        )
      } else {
        return <div />
      }
    },
  },
]

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding={`checkbox`} />
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
  }
})

export default function DeviceList(props) {
  const classes = useStyles()
  const data = props.data

  return (
    <div className={classes.devList}>
      <div className={classes.tableWrapper}>
        <Table className={classes.table} aria-label="device table">
          <EnhancedTableHead />
          <TableBody>
            {data.map((row) => (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell>
                  <Link
                    to={
                      `/devices/` + encode(row.Brand) + `/` + encode(row.Device)
                    }
                  >
                    <AddIcon />
                  </Link>
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
