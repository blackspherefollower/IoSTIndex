import React, { useState, useEffect } from "react"
import localforage from "localforage"
import * as moment from "moment"
import axios from "axios"
import TableBody from "@mui/material/TableBody"
import Table from "@mui/material/Table"
import TableRow from "@mui/material/TableRow"
import TableHead from "@mui/material/TableHead"
import TableCell from "@mui/material/TableCell"
import AffiliateLink from "../components/AffiliateLink"
import LightTooltip from "../components/LightTooltip"
import { Link } from "gatsby"
import { encode } from "../components/DeviceList"
import Alert from "@mui/material/Alert"
import SEO from "../components/seo"
import { Typography } from "@mui/material"
import Box from "@mui/material/Box"
import ErrorIcon from "@mui/icons-material/Error"
import HelpIcon from "@mui/icons-material/Help"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import InfoIcon from "@mui/icons-material/Info"
import Container from "@mui/material/Container"

export default function ComparePage({ theme }) {
  const [compares, setCompares] = useState([])
  const [errors, setErrors] = useState([])

  const search = typeof window !== `undefined` ? window.location.search : ``

  useEffect(() => {
    let devDate = null
    let devices = null
    localforage
      .getItem(`devices`)
      .then((value) => {
        devices = value
        return localforage.getItem(`devicesDate`)
      })
      .then((dateValue) => (devDate = moment(dateValue)))
      .then(() => {
        if (
          devices === null ||
          devDate === null ||
          moment().subtract(30, `m`).isAfter(devDate)
        ) {
          return axios.get(`/devices.json`)
        }
        return null
      })
      .then((res) => {
        devices.forEach((d) => {
          if (d.path === undefined) {
            d.path = encode(d.Brand) + `/` + encode(d.Device)
          }
        })

        if (res != null) {
          devices = res.data
          localforage
            .setItem(`devices`, devices)
            .then(() => localforage.setItem(`devicesDate`, moment().valueOf()))
            .catch((err) => console.error(err))
        }

        const params = new URLSearchParams(search)
        const rawComps = []
        params.forEach((v, k) => {
          if (v.length === 0) {
            rawComps.push(k)
          } else if (k === `v`) {
            rawComps.push(v)
          }
        })

        const comps = []
        const errs = []
        rawComps.forEach((c) => {
          const bits = c.split(`/`)
          if (bits.length !== 2) {
            errs.push({ Device: c, Error: `Invalid identifier` })
            return
          }
          const idx = devices.findIndex(
            (d) => d.Brand === bits[0] && d.Device === bits[1]
          )
          if (idx === -1) {
            errs.push({ Device: c, Error: `Unknown device` })
            return
          }
          comps.push(devices[idx])
        })
        setErrors(errs)
        setCompares(comps)
      })
  }, [false])

  let inputs = []
  let outputs = []
  compares.forEach((d) => {
    Object.getOwnPropertyNames(d.Features.Inputs).forEach((i) => {
      if (
        inputs.includes(i) ||
        isNaN(d.Features.Inputs[i]) ||
        parseInt(d.Features.Inputs[i], 10) === 0
      ) {
        return
      }
      inputs.push(i)
    })
    Object.getOwnPropertyNames(d.Features.Outputs).forEach((o) => {
      if (
        outputs.includes(o) ||
        isNaN(d.Features.Outputs[o]) ||
        parseInt(d.Features.Outputs[o], 10) === 0
      ) {
        return
      }
      outputs.push(o)
    })
  })
  inputs = inputs.sort()
  outputs = outputs.sort()

  return (
    <div>
      <SEO
        post={{
          path: `compare?${search}`,
          title: `IoST Index: Compare devices`,
          description: `Comparing:\n${compares
            .map((d) => d.Brand + ` - ` + d.Device)
            .join(`\n`)}`,
        }}
      />
      <Typography variant="h1" hidden={true}>
        IoST Index: Compare devices
      </Typography>
      {errors.length !== 0 && (
        <div className={`errors`}>
          {errors.map((e, i) => (
            <Alert severity="error" key={i} sx={{ margin: theme.spacing(2) }}>
              {e.Error}: {e.Device}
            </Alert>
          ))}
        </div>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            {compares.map((d, i) => (
              <TableCell key={i}>
                <Link to={`/devices/${d.path}`}>
                  {d.Brand} - {d.Device}
                </Link>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>General </TableCell>
            {compares.map((d, i) => (
              <TableCell key={i} />
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Brand</TableCell>
            {compares.map((d, i) => (
              <TableCell key={i}>{d.Brand}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Device</TableCell>
            {compares.map((d, i) => (
              <TableCell key={i}>{d.Device}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>URL</TableCell>
            {compares.map((d, i) => (
              <TableCell key={i}>
                <AffiliateLink device={d} />
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Availability</TableCell>
            {compares.map((d, i) => (
              <TableCell key={i}>{d.Availability}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Form factor</TableCell>
            {compares.map((d, i) => (
              <TableCell key={i}>{d.Type}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Connectivity</TableCell>
            {compares.map((d, i) => (
              <TableCell key={i}>{d.Connection}</TableCell>
            ))}
          </TableRow>
        </TableBody>
        {outputs.length > 0 && (
          <TableBody>
            <TableRow>
              <TableCell>Outputs</TableCell>
              {compares.map((d, i) => (
                <TableCell key={i} />
              ))}
            </TableRow>
            {outputs.map((o, oi) => (
              <TableRow key={oi}>
                <TableCell>&gt; {o}</TableCell>
                {compares.map((d, i) => (
                  <TableCell key={i}>{d.Features.Outputs[o]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
        {inputs.length > 0 && (
          <TableBody>
            <TableRow>
              <TableCell>Inputs</TableCell>
              {compares.map((d, i) => (
                <TableCell key={i} />
              ))}
            </TableRow>
            {inputs.map((o, oi) => (
              <TableRow key={oi}>
                <TableCell>&gt; {o}</TableCell>
                {compares.map((d, i) => (
                  <TableCell key={i}>{d.Features.Inputs[o]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
        <TableRow>
          <TableCell>Buttplug.io Support</TableCell>
          {compares.map((d, i) => (
            <TableCell key={i}>
              <Container
                sx={{
                  display: `flex`,
                  "flex-wrap": `wrap`,
                  padding: `0px`,
                  "@media (min-width: 600px)": {
                    padding: `0px`,
                  },
                }}
              >
                <Box sx={{ display: `flex`, alignItems: `center` }}>
                  {(d.Buttplug.ButtplugSupport & 4) === 4 &&
                  d.Buttplug.Buttplug_Rust === `Issues` ? (
                    <ErrorIcon style={{ color: `orange` }} />
                  ) : (d.Buttplug.ButtplugSupport & 4) === 4 &&
                    d.Buttplug.Buttplug_Rust === `Untested` ? (
                    <HelpIcon style={{ color: `blue` }} />
                  ) : (d.Buttplug.ButtplugSupport & 4) === 4 ? (
                    <CheckCircleIcon style={{ color: `green` }} />
                  ) : d.Buttplug.ButtplugSupport !== 0 ? (
                    <HighlightOffIcon style={{ color: `grey` }} />
                  ) : (
                    <HighlightOffIcon color="error" />
                  )}
                  {(d.Buttplug.ButtplugSupport & 4 && (
                    <span>
                      {d.Buttplug.Buttplug_Rust === `Untested` && ` (Untested)`}
                      {d.Buttplug.Buttplug_Rust === `Issues` &&
                        ` (Known Issues)`}
                    </span>
                  )) ||
                    (d.Buttplug.ButtplugSupport & 3 && (
                      <span>
                        Deprecated support:
                        {(d.Buttplug.ButtplugSupport & 1 && ` C#`) || ``}
                        {(d.Buttplug.ButtplugSupport & 1 &&
                          d.Buttplug.Buttplug_CSharp === `Untested` &&
                          ` (Untested)`) ||
                          ``}
                        {(d.Buttplug.ButtplugSupport & 1 &&
                          d.Buttplug.Buttplug_CSharp === `Issues` &&
                          ` (Known Issues)`) ||
                          ``}
                        {(d.Buttplug.ButtplugSupport & 2 && ` JS`) || ``}
                        {((d.Buttplug.ButtplugSupport & 2 &&
                          d.Buttplug.Buttplug_JS === `Untested`) ||
                          ``) &&
                          ` (Untested)`}
                        {((d.Buttplug.ButtplugSupport & 2 &&
                          d.Buttplug.Buttplug_JS === `Issues`) ||
                          ``) &&
                          ` (Known Issues)`}
                      </span>
                    )) ||
                    ``}
                  {d.Buttplug.Buttplug_Support_Notes.length > 0 && (
                    <LightTooltip
                      interactive
                      title={d.Buttplug.Buttplug_Support_Notes}
                    >
                      <InfoIcon />
                    </LightTooltip>
                  )}
                </Box>
              </Container>
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>XToys.app Support</TableCell>
          {compares.map((d, i) => (
            <TableCell key={i}>
              <Container
                sx={{
                  display: `flex`,
                  "flex-wrap": `wrap`,
                  padding: `0px`,
                  "@media (min-width: 600px)": {
                    padding: `0px`,
                  },
                }}
              >
                <Box sx={{ display: `flex`, alignItems: `center` }}>
                  {d.XToys.XToysSupport === 1 ? (
                    <CheckCircleIcon style={{ color: `green` }} />
                  ) : (
                    <HighlightOffIcon color="error" />
                  )}
                  {d.XToys.XToys_Support_Notes.length > 0 && (
                    <LightTooltip
                      interactive
                      title={d.XToys.XToys_Support_Notes}
                    >
                      <InfoIcon />
                    </LightTooltip>
                  )}
                </Box>
              </Container>
            </TableCell>
          ))}
        </TableRow>
      </Table>
    </div>
  )
}
