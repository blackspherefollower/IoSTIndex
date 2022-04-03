import React from "react"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import TableHead from "@mui/material/TableHead"
import Table from "@mui/material/Table"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import SEO from "../components/seo"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import AffiliateLink from "../components/AffiliateLink"
import ErrorIcon from "@mui/icons-material/Error"
import HelpIcon from "@mui/icons-material/Help"
import Tooltip from "@mui/material/Tooltip"
import InfoIcon from "@mui/icons-material/Info"

import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from "react-responsive-carousel"
import { Typography } from "@mui/material"
import TableBody from "@mui/material/TableBody"
import { theme } from "../layouts/theme"

/* const useStyles = makeStyles((theme) => {
  return {
    root: {},
    content: {
      paddingTop: theme.spacing(4),
      flex: `1 1 100%`,
      position: `relative`,
      maxWidth: `100%`,
      margin: `0 auto`,
    },
    flexbox: {
      display: `flex`,
      "flex-wrap": `wrap`,
      "justify-content": `space-evenly`,
      paddingBottom: theme.spacing(2),
    },
    gallery: {
      overflow: `hidden`,
      marginLeft: -2,
      marginRight: -2,
      flex: `1 1 auto`,
    },
    galleryimage: {
      backgroundColor: `#eee`,
      boxSizing: `border-box`,
      display: `inline-block`,
      margin: -2,
      overflow: `hidden`,
      paddingBottom: `15%`,
      position: `relative`,
      width: `calc(20% - 4px)`,
      "&:hover": {
        opacity: 0.9,
      },
      "& img": {
        cursor: `pointer`,
        position: `absolute`,
        maxWidth: `100%`,
      },
    },
    table: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      flex: 1,
      width: `40%`,
      paddingBottom: theme.spacing(2),
    },
    notes: {
      paddingTop: theme.spacing(2),
      width: `100%`,
    },
    "@media (max-width: 800px)": {
      flexbox: {
        display: `block`,
      },
      table: {
        width: `100%`,
      },
    },
    tooltipcolumn: {
      display: `flex`,
      alignItems: `center`,
    },
  }
})*/

function featureSort(a, b) {
  const valA = parseInt(a[1], 10)
  const valB = parseInt(b[1], 10)

  if ((valA === 0) !== (valB === 0)) {
    return valB - valA
  }
  return a[0].localeCompare(b[0])
}

export default function Template({ path, pageContext }) {
  const device = pageContext.device

  return (
    <Container>
      <SEO
        post={{
          path,
          title: `IoST Index: ${device.Brand} - ${device.Device}`,
          image: device.images.length > 0 ? device.images[0] : undefined,
        }}
      />
      <Container
        sx={{
          paddingTop: theme.spacing(4),
          flex: `1 1 100%`,
          position: `relative`,
          maxWidth: `100%`,
          margin: `0 auto`,
        }}
      >
        <Typography variant="h1" gutterBottom>
          {device.Brand} - {device.Device}
        </Typography>
        <Container
          sx={{
            display: `flex`,
            "flex-wrap": `wrap`,
            "justify-content": `space-evenly`,
            paddingBottom: theme.spacing(2),
          }}
        >
          <Box
            sx={{
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
              flex: 1,
              width: `40%`,
              paddingBottom: theme.spacing(2),
            }}
          >
            <b>Url:</b> <AffiliateLink device={device} />
          </Box>
          <Box
            sx={{
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
              flex: 1,
              width: `40%`,
              paddingBottom: theme.spacing(2),
            }}
          >
            <b>Availability:</b> {device.Availability}
          </Box>
          <Box
            sx={{
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
              flex: 1,
              width: `40%`,
              paddingBottom: theme.spacing(2),
            }}
          >
            <b>Form factor:</b> {device.Type}
          </Box>
          <Box
            sx={{
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
              flex: 1,
              width: `40%`,
              paddingBottom: theme.spacing(2),
            }}
          >
            <b>Connectivity:</b> {device.Connection}
          </Box>
          {device.Notes.length > 0 && (
            <Box
              sx={{
                paddingTop: theme.spacing(2),
                width: `100%`,
              }}
            >
              {device.Notes}
            </Box>
          )}
        </Container>
        <Typography variant="h4" gutterBottom>
          Product Images
        </Typography>
        <Carousel>
          {device.images.map((img, i) => (
            <div key={i}>
              <img
                src={img}
                alt={`${device.Brand} - ${device.Device} - Image ${i}`}
              />
            </div>
          ))}
        </Carousel>
        <Typography variant="h4" gutterBottom>
          Device Features
        </Typography>
        <Container
          sx={{
            display: `flex`,
            "flex-wrap": `wrap`,
            "justify-content": `space-evenly`,
            paddingBottom: theme.spacing(2),
            "@media (max-width: 800px)": {
              display: `block`,
            },
          }}
        >
          <Table
            sx={{
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
              flex: 1,
              width: `40%`,
              paddingBottom: theme.spacing(2),
              "@media (max-width: 800px)": {
                width: `100%`,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Input</TableCell>
                <TableCell>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(device.Features.Inputs)
                .sort(featureSort)
                .map((feat, i) => (
                  <TableRow key={i}>
                    <TableCell>{feat[0]}</TableCell>
                    <TableCell>{feat[1]}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Table
            sx={{
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
              flex: 1,
              width: `40%`,
              paddingBottom: theme.spacing(2),
              "@media (max-width: 800px)": {
                width: `100%`,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Output</TableCell>
                <TableCell>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(device.Features.Outputs)
                .sort(featureSort)
                .map((feat, i) => (
                  <TableRow key={i}>
                    <TableCell>{feat[0]}</TableCell>
                    <TableCell>{feat[1]}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Container>
        <Typography variant="h4" gutterBottom>
          Buttplug.io Support
        </Typography>
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
            {(device.Buttplug.ButtplugSupport & 4) === 4 &&
            device.Buttplug.Buttplug_Rust === `Issues` ? (
              <ErrorIcon style={{ color: `orange` }} />
            ) : (device.Buttplug.ButtplugSupport & 4) === 4 &&
              device.Buttplug.Buttplug_Rust === `Untested` ? (
              <HelpIcon style={{ color: `blue` }} />
            ) : (device.Buttplug.ButtplugSupport & 4) === 4 ? (
              <CheckCircleIcon style={{ color: `green` }} />
            ) : device.Buttplug.ButtplugSupport !== 0 ? (
              <HighlightOffIcon style={{ color: `grey` }} />
            ) : (
              <HighlightOffIcon color="error" />
            )}
            {(device.Buttplug.ButtplugSupport & 4 && (
              <span>
                {device.Buttplug.Buttplug_Rust === `Untested` && ` (Untested)`}
                {device.Buttplug.Buttplug_Rust === `Issues` &&
                  ` (Known Issues)`}
              </span>
            )) ||
              (device.Buttplug.ButtplugSupport & 3 && (
                <span>
                  Deprecated support:
                  {(device.Buttplug.ButtplugSupport & 1 && ` C#`) || ``}
                  {(device.Buttplug.ButtplugSupport & 1 &&
                    device.Buttplug.Buttplug_CSharp === `Untested` &&
                    ` (Untested)`) ||
                    ``}
                  {(device.Buttplug.ButtplugSupport & 1 &&
                    device.Buttplug.Buttplug_CSharp === `Issues` &&
                    ` (Known Issues)`) ||
                    ``}
                  {(device.Buttplug.ButtplugSupport & 2 && ` JS`) || ``}
                  {((device.Buttplug.ButtplugSupport & 2 &&
                    device.Buttplug.Buttplug_JS === `Untested`) ||
                    ``) &&
                    ` (Untested)`}
                  {((device.Buttplug.ButtplugSupport & 2 &&
                    device.Buttplug.Buttplug_JS === `Issues`) ||
                    ``) &&
                    ` (Known Issues)`}
                </span>
              )) ||
              ``}
            {device.Buttplug.Buttplug_Support_Notes.length > 0 && (
              <Tooltip
                interactive
                title={device.Buttplug.Buttplug_Support_Notes}
                classes={{
                  tooltip: { display: `flex`, alignItems: `center` },
                }}
              >
                <InfoIcon />
              </Tooltip>
            )}
          </Box>
        </Container>
        <Typography variant="h4" gutterBottom>
          XToys.app Support
        </Typography>
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
            {device.XToys.XToysSupport === 1 ? (
              <CheckCircleIcon style={{ color: `green` }} />
            ) : (
              <HighlightOffIcon color="error" />
            )}
            {device.XToys.XToys_Support_Notes.length > 0 && (
              <Tooltip
                interactive
                title={device.XToys.XToys_Support_Notes}
                classes={{
                  tooltip: { display: `flex`, alignItems: `center` },
                }}
              >
                <InfoIcon />
              </Tooltip>
            )}
          </Box>
        </Container>
      </Container>
    </Container>
  )
}
