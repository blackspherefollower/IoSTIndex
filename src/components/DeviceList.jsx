import React from "react"
import TableRow from "@material-ui/core/TableRow"
import TableSortLabel from "@material-ui/core/TableSortLabel"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import { makeStyles } from "@material-ui/core/styles"
import AddIcon from "@material-ui/icons/Add"
import LazyLoad from "react-lazyload"
import { Link } from "gatsby"

function encode(string) {
  return encodeURIComponent(string)
    .replace(/%20/g, ` `)
    .replace(/%2F/g, `_`)
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
    formatter: (cellContent, row) => (
      <div>
        {(row.Buttplug.ButtplugSupport & 1 && <span> C#</span>) || ``}
        {(row.Buttplug.ButtplugSupport & 2 && <span> JS</span>) || ``}
      </div>
    ),
  },
  {
    dataField: `Detail`,
    text: `Url`,
    formatter: (cellContent, row) => (
      <div>
        {cellContent.length > 0 && (
          <a
            href={cellContent}
            title={`Product link: ${row.Brand} - ${row.Device}`}
          >
            {cellContent}
          </a>
        )}
      </div>
    ),
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

const useStyles = makeStyles(theme => {
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
            {data.map(row => (
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
