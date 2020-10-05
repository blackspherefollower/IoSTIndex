import React, { useState, useEffect } from "react"
import localforage from "localforage"
import * as moment from "moment"
import axios from "axios"
import TableBody from "@material-ui/core/TableBody"
import Table from "@material-ui/core/Table"
import TableRow from "@material-ui/core/TableRow"
import TableHead from "@material-ui/core/TableHead"
import TableCell from "@material-ui/core/TableCell"
import AffiliateLink from "../components/AffiliateLink"
import { Link } from "gatsby"
import { encode } from "../components/DeviceList"
import Alert from "@material-ui/lab/Alert"
import { makeStyles } from "@material-ui/core/styles"
import SEO from "../components/seo"

const useStyles = makeStyles((theme) => {
  return {
    alert: {
      margin: theme.spacing(2),
    },
  }
})

export default function ComparePage() {
  const [compares, setCompares] = useState([])
  const [errors, setErrors] = useState([])
  const classes = useStyles()

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
        if (res != null) {
          devices = res.data
          localforage
            .setItem(`devices`, devices)
            .then(() => localforage.setItem(`devicesDate`, moment().valueOf()))
            .catch((err) => console.error(err))
        }

        const params = new URLSearchParams(location.search)
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
          path: `compare?${location.search}`,
          title: `IoST Index: Compare devices`,
          description: `Comparing:\n${compares
            .map((d) => d.Brand + ` - ` + d.Device)
            .join(`\n`)}`,
        }}
      />
      {errors.length !== 0 && (
        <div className={errors}>
          {errors.map((e, i) => (
            <Alert severity="error" key={i} className={classes.alert}>
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
                <Link
                  to={`/devices/` + encode(d.Brand) + `/` + encode(d.Device)}
                >
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
      </Table>
    </div>
  )
}
