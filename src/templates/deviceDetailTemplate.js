import React, { useState } from "react"
import Carousel, { Modal, ModalGateway } from "react-images"
import { makeStyles, TableBody, Typography } from "@material-ui/core"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import TableHead from "@material-ui/core/TableHead"
import Table from "@material-ui/core/Table"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import HighlightOffIcon from "@material-ui/icons/HighlightOff"
import SEO from "../components/seo"
import Container from "@material-ui/core/Container"
import Box from "@material-ui/core/Box"
import AffiliateLink from "../components/AffiliateLink"

const useStyles = makeStyles((theme) => {
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
})

const galleryStyles = {
  blanket: (base) => {
    return {
      ...base,
      zIndex: 2000,
    }
  },
  positioner: (base) => {
    return {
      ...base,
      zIndex: 2000,
    }
  },
}

function featureSort(a, b) {
  const valA = parseInt(a[1], 10)
  const valB = parseInt(b[1], 10)

  if ((valA === 0) !== (valB === 0)) {
    return valB - valA
  }
  return a[0].localeCompare(b[0])
}

export default function Template({ path, pageContext }) {
  const classes = useStyles()
  const device = pageContext.device
  const [currentModal, setCurrentModal] = useState()

  return (
    <Container className={classes.root}>
      <SEO
        post={{
          path,
          title: `IoST Index: ${device.Brand} - ${device.Device}`,
          image: device.images.length > 0 ? device.images[0] : undefined,
        }}
      />
      <Container className={classes.content}>
        <Typography variant="h3" gutterBottom>
          {device.Brand} - {device.Device}
        </Typography>
        <Container className={classes.flexbox}>
          <Box className={classes.table}>
            <b>Url:</b> <AffiliateLink device={device} />
          </Box>
          <Box className={classes.table}>
            <b>Availability:</b> {device.Availability}
          </Box>
          <Box className={classes.table}>
            <b>Form factor:</b> {device.Type}
          </Box>
          <Box className={classes.table}>
            <b>Connectivity:</b> {device.Connection}
          </Box>
          {device.Notes.length > 0 && (
            <Box className={classes.notes}>{device.Notes}</Box>
          )}
        </Container>
        <Typography variant="h4" gutterBottom>
          Product Images
        </Typography>
        <Gallery classes={classes}>
          {device.images.map((img, i) => (
            <Image onClick={() => setCurrentModal(i)} key={i} classes={classes}>
              <img
                src={img}
                alt={`${device.Brand} - ${device.Device} - Image ${i}`}
                className={classes.galleryimageimg}
              />
            </Image>
          ))}
        </Gallery>
        {Number.isInteger(currentModal) && (
          <ModalGateway>
            <Modal
              styles={galleryStyles}
              allowFullscreen={false}
              closeOnBackdropClick={false}
              onClose={() => setCurrentModal(null)}
            >
              <Carousel
                currentIndex={currentModal}
                frameProps={{ autoSize: `height` }}
                views={device.images.map((img) => {
                  return { src: img }
                })}
              />
            </Modal>
          </ModalGateway>
        )}
        <Typography variant="h4" gutterBottom>
          Device Features
        </Typography>
        <Container className={classes.flexbox}>
          <Table className={classes.table}>
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
          <Table className={classes.table}>
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
        <Container className={classes.flexbox}>
          <Box className={[classes.table, classes.tooltipcolumn]}>
            Buttplug-C#:&nbsp;
            {(device.Buttplug.ButtplugSupport & 1) === 1 ? (
              <CheckCircleIcon style={{ color: `green` }} />
            ) : (
              <HighlightOffIcon color="error" />
            )}
          </Box>
          <Box className={[classes.table, classes.tooltipcolumn]}>
            Buttplug-JS:&nbsp;
            {(device.Buttplug.ButtplugSupport & 2) === 2 ? (
              <CheckCircleIcon style={{ color: `green` }} />
            ) : (
              <HighlightOffIcon color="error" />
            )}
          </Box>
          <Box className={[classes.table, classes.tooltipcolumn]}>
            Buttplug-Rust:&nbsp;
            {(device.Buttplug.ButtplugSupport & 4) === 4 ? (
              <CheckCircleIcon style={{ color: `green` }} />
            ) : (
              <HighlightOffIcon color="error" />
            )}
          </Box>
        </Container>
      </Container>
    </Container>
  )
}

const Gallery = (props) => <div className={props.classes.gallery} {...props} />

const Image = (props) => (
  <div className={props.classes.galleryimage} {...props} />
)
