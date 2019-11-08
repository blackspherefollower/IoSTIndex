import React, { useState } from "react"
import { Link } from "gatsby"
import Carousel, { Modal, ModalGateway } from "react-images"
import { makeStyles, TableBody, Typography } from "@material-ui/core"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import TableHead from "@material-ui/core/TableHead"
import Grid from "@material-ui/core/Grid"
import Table from "@material-ui/core/Table"
import CheckBoxIcon from "@material-ui/icons/CheckBox"
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import SEO from "../components/seo"

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

export default function Template({ path, pageContext }) {
  const classes = useStyles()
  const device = pageContext.device
  const [currentModal, setCurrentModal] = useState()

  return (
    <div className={classes.page}>
      <SEO
        post={{
          path,
          title: `IoST Index: ${device.Brand} - ${device.Device}`,
          image: device.images.length > 0 ? device.images[0] : undefined,
        }}
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" gutterBottom>
            {device.Brand} - {device.Device}
          </Typography>
          <span>
            Url:{` `}
            <Link
              to={device.Detail}
              title={`Product link: ${device.Brand} - ${device.Device}`}
            >
              {device.Detail}
            </Link>
          </span>
          <span>{device.Notes}</span>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Product Images
          </Typography>
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

        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Device Features
          </Typography>
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
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Buttplug.io Support
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <span>
            Buttplug-C#:
            {(device.Buttplug.ButtplugSupport & 1) == 1 ? (
              <CheckBoxIcon />
            ) : (
              <CheckBoxOutlineBlankIcon />
            )}
          </span>
        </Grid>
        <Grid item xs={12}>
          <span>
            Buttplug-JS:
            {(device.Buttplug.ButtplugSupport & 2) == 2 ? (
              <CheckBoxIcon />
            ) : (
              <CheckBoxOutlineBlankIcon />
            )}
          </span>
        </Grid>
      </Grid>
    </div>
  )
}

const Gallery = props => <div className={props.classes.gallery} {...props} />

const Image = props => <div className={props.classes.galleryimage} {...props} />
