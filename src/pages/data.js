import React from "react"
import TableBody from "@mui/material/TableBody"
import Table from "@mui/material/Table"
import TableRow from "@mui/material/TableRow"
import TableHead from "@mui/material/TableHead"
import TableCell from "@mui/material/TableCell"
import { useStaticQuery, graphql } from "gatsby"
import PageHead from "../components/PageHead"
import { Typography } from "@mui/material"
import { theme } from "../layouts/theme"

export function Head({ data, ...props }) {
  return (
    <PageHead
      meta={{
        path: `data`,
        title: `IoST Index: Raw links`,
        description: `Page used for link checking`,
      }}
    />
  )
}

export default function DataPage() {
  const devices = useStaticQuery(graphql`
    query {
      allDevicesCsv(sort: [{ Brand: ASC }, { Device: ASC }]) {
        edges {
          node {
            Brand
            Device
            Availability
            Detail
            Affiliate_Link
          }
        }
      }
    }
  `)

  return (
    <div>
      <Typography variant="h1" hidden={true}>
        IoST Index: Raw links
      </Typography>
      <Table sx={{ margin: theme.spacing(2) }}>
        <TableHead>
          <TableRow>
            <TableCell>Brand</TableCell>
            <TableCell>Device</TableCell>
            <TableCell>Availability</TableCell>
            <TableCell>Url</TableCell>
            <TableCell>Affiliate link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.allDevicesCsv.edges.map((device) => (
            <TableRow>
              <TableCell>{device.node.Brand}</TableCell>
              <TableCell>{device.node.Device}</TableCell>
              <TableCell>{device.node.Availability}</TableCell>
              <TableCell>
                {device.node.Detail.length > 0 && (
                  <a href={device.node.Detail}>{device.node.Detail}</a>
                )}
              </TableCell>
              <TableCell>
                {device.node.Affiliate_Link.length > 0 && (
                  <a href={device.node.Affiliate_Link}>
                    {device.node.Affiliate_Link}
                  </a>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
