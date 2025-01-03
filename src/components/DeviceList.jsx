import React, { useState } from "react"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import AddIcon from "@mui/icons-material/Add"
import InfoIcon from "@mui/icons-material/Info"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import CompareIcon from "@mui/icons-material/Compare"
import {
  LazyLoadImage,
  trackWindowScroll,
} from "react-lazy-load-image-component"
import { Link, navigate } from "gatsby"
import AffiliateLink from "./AffiliateLink"
import LightTooltip from "./LightTooltip"
import Snackbar from "@mui/material/Snackbar"
import Button from "@mui/material/Button"
import CloseIcon from "@mui/icons-material/Close"
import IconButton from "@mui/material/IconButton"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import HelpIcon from "@mui/icons-material/Help"
import ErrorIcon from "@mui/icons-material/Error"
import Container from "@mui/material/Container"

export function encode(string) {
  return encodeURIComponent(string)
    .replace(/%20/g, ` `)
    .replace(/%[0-9A-Fa-f]{2}/g, `_`)
    .toLowerCase()
}

const columns = [
  {
    dataField: `id`,
    hidden: true,
  },
  {
    dataField: `images`,
    text: `Image`,
    formatter: (cellContent, row, scrollPosition) => (
      <div>
        {cellContent && cellContent.length > 0 && (
          <LazyLoadImage
            height={50}
            width={50}
            src={`devices/${encode(row.Brand)}/${encode(
              row.Device
            )}/thumb.jpeg`}
            sx={{
              "object-fit": `cover`,
              width: `50px`,
              height: `50px`,
            }}
            alt={`${row.Brand} - ${row.Device} - Thumbnail`}
            scrollPosition={scrollPosition}
          />
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
    notes: (
      <React.Fragment>
        Devices are marked as supported when supported by the latest release of
        {` `}
        <a href="https://intiface.com/central/">Intiface Central</a>
      </React.Fragment>
    ),
    formatter: (cellContent, row) => (
      <div
        style={{
          display: `flex`,
          alignItems: `center`,
          "& span": {
            margin: 5,
          },
        }}
      >
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
          <LightTooltip title={row.Buttplug.Buttplug_Support_Notes}>
            <InfoIcon />
          </LightTooltip>
        )}
      </div>
    ),
  },
  {
    dataField: `XToys.XToysSupport`,
    text: `XToys.app Support`,
    sort: true,
    formatter: (cellContent, row) => (
      <Container
        sx={{
          display: `flex`,
          alignItems: `center`,
          "& span": {
            margin: 5,
          },
        }}
      >
        {row.XToys.XToysSupport === 1 ? (
          <CheckCircleIcon style={{ color: `green` }} />
        ) : (
          <HighlightOffIcon color="error" />
        )}
        {row.XToys.XToys_Support_Notes.length > 0 && (
          <LightTooltip title={row.XToys.XToys_Support_Notes}>
            <InfoIcon />
          </LightTooltip>
        )}
      </Container>
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
              padding={col.disablePadding ? `none` : `normal`}
            >
              {col.sort ? (
                <TableSortLabel>
                  {col.text}
                  {col.notes && (
                    <React.Fragment>
                      {` `}
                      <LightTooltip title={col.notes}>
                        <InfoIcon />
                      </LightTooltip>
                    </React.Fragment>
                  )}
                </TableSortLabel>
              ) : (
                <span>
                  {col.text}
                  {col.notes && (
                    <React.Fragment>
                      {` `}
                      <LightTooltip title={col.notes}>
                        <InfoIcon />
                      </LightTooltip>
                    </React.Fragment>
                  )}
                </span>
              )}
            </TableCell>
          )
        )}
      </TableRow>
    </TableHead>
  )
}

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
          <IconButton aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </React.Fragment>
      }
    />
  )
}

function DeviceListInternal(props) {
  const data = props.data
  const scrollPosition = props.scrollPosition
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
            style={{ color: `black` }}
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
              ? col.formatter(row[col.dataField], row, scrollPosition)
              : row[col.dataField]}
          </TableCell>
        )
      )}
    </TableRow>
  ))

  return (
    <div
      style={{
        width: `100%`,
      }}
    >
      <CompareSnackbar
        compareMode={props.compareMode}
        setCompareMode={props.setCompareMode}
        setCompares={setCompares}
        compareCount={compares.length}
        doCompare={doCompare}
      />
      <div style={{ overflowX: `auto` }}>
        <Table sx={{ minWidth: `750px` }} aria-label="device table">
          <EnhancedTableHead
            compareMode={props.compareMode}
            setCompareMode={props.setCompareMode}
            setCompares={setCompares}
          />
          <TableBody>{rows}</TableBody>
        </Table>
      </div>
    </div>
  )
}

export default trackWindowScroll(DeviceListInternal)
