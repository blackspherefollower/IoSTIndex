import React, { useState } from "react"
import Carousel, { Modal, ModalGateway } from "react-images"
import { makeStyles, TableBody } from "@material-ui/core"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import TableHead from "@material-ui/core/TableHead"
import Grid from "@material-ui/core/Grid"
import Table from "@material-ui/core/Table"

const useStyles = makeStyles(() => {
  return {
    page: {
      margin: `50px`,
      flexGrow: 1,
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
      width: `calc(25% - 4px)`,
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
      minWidth: 200,
      width: `100%`,
    },
  }
})

const galleryStyles = {
  blanket: base => {
    return {
      ...base,
      zIndex: 2000,
    }
  },
  positioner: base => {
    return {
      ...base,
      zIndex: 2000,
    }
  },
}

export default function Template({ pageContext }) {
  const classes = useStyles()
  const device = pageContext.device
  const [currentModal, setCurrentModal] = useState(false)

  return (
    <div className={classes.page}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1>
            {device.Brand} - {device.Device}
          </h1>
          <span>{device.Notes}</span>
        </Grid>
        <Grid item xs={12}>
          <Gallery classes={classes}>
            {device.images.map((img, i) => (
              <Image
                onClick={() => setCurrentModal(i)}
                key={i}
                classes={classes}
              >
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
                  views={device.images.map(img => {
                    return { src: img }
                  })}
                />
              </Modal>
            </ModalGateway>
          )}
        </Grid>

        <Grid item xs={6}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Input</TableCell>
                <TableCell>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(device.Features.Inputs).map((feat, i) => (
                <TableRow key={i}>
                  <TableCell>{feat}</TableCell>
                  <TableCell>{device.Features.Inputs[feat]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={6}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Output</TableCell>
                <TableCell>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(device.Features.Outputs).map((feat, i) => (
                <TableRow key={i}>
                  <TableCell>{feat}</TableCell>
                  <TableCell>{device.Features.Outputs[feat]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </div>
  )
}

const Gallery = props => <div className={props.classes.gallery} {...props} />

const Image = props => <div className={props.classes.galleryimage} {...props} />
