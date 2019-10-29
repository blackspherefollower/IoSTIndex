import React, { Fragment, useState } from "react"
import { Col, Container, Row, Table } from "react-bootstrap"
import Carousel, { Modal, ModalGateway } from "react-images"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(() => {
  return {
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
    <Fragment>
      <Container>
        <Row>
          <Col>
            <h1>
              {device.Brand} - {device.Device}
            </h1>
            <span>{device.Notes}</span>
          </Col>
        </Row>
        <Row>
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
        </Row>
        <Row>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th>Input</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(device.Features.Inputs).map((feat, i) => (
                  <tr key={i}>
                    <td>{feat}</td>
                    <td>{device.Features.Inputs[feat]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th>Output</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(device.Features.Outputs).map((feat, i) => (
                  <tr key={i}>
                    <td>{feat}</td>
                    <td>{device.Features.Outputs[feat]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

const Gallery = props => <div className={props.classes.gallery} {...props} />

const Image = props => <div className={props.classes.galleryimage} {...props} />
