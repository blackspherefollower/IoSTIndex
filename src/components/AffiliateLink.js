import React from "react"
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"
import LightTooltip from "./LightTooltip"

import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { LazyLoadImage } from "react-lazy-load-image-component"
import aliExample from "./ali-example.png"

function AliDialog(props) {
  const [open, setOpen] = React.useState(false)
  const [newTab, setNewTab] = React.useState(false)

  const handleClickOpen = (e) => {
    e.preventDefault()
    setOpen(true)
  }
  const handleClickAltOpen = (e) => {
    e.preventDefault()
    setNewTab(true)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    if (newTab) {
      window.open(props.href)
    } else {
      window.location.href = props.href
    }
  }

  return (
    <div>
      <a
        onClick={handleClickOpen}
        onAuxClick={handleClickAltOpen}
        href={props.href}
        title={props.title}
      >
        {props.href}
      </a>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Going to AliExpress?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            AliExpress is great, but there's some things you should be aware of
            before you buy!
            <ul>
              <li>
                Sometimes AliExpress listings are reused and no longer reference
                the product that IoSTIndex is linking to. If the images don't
                look the same, there's a good chance the product has changed.
                Please let me kow if you spot this!
              </li>
              <li>
                Many AliExpress listings use the color picker to list very
                different devices. Sometimes it is the color or how it's
                packaged, but it's really common to find cheaper devices listed
                as options to bring the overall listing price down.{` `}
                <b>Always</b> check that the device you add to your cart is the
                app enabled model you expect. If in doubt, come find me on{` `}
                <a
                  href="https://discord.buttplug.io"
                  target="_blank"
                  rel="noreferrer"
                >
                  discord
                </a>
                {` `}
                and I'll help!
              </li>
            </ul>
            <LazyLoadImage src={aliExample} width="100%" />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Continue to AliExpress</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default function AffiliateLink(props) {
  const device = props.device

  if (device.Brand === undefined) {
    device.Brand = ``
  }
  if (device.Device === undefined) {
    device.Device = ``
  }
  if (device.Detail === undefined) {
    device.Detail = ``
  }
  if (device.Affiliate_Link === undefined) {
    device.Affiliate_Link = ``
  }

  const hasUrl = device.Detail.length > 0
  const hasAUrl = device.Affiliate_Link.length > 0
  const isAli =
    device.Detail.includes(`aliexpress`) ||
    device.Affiliate_Link.includes(`aliexpress`)

  if (hasAUrl) {
    return (
      <div style={{ display: `flex`, alignItems: `center` }}>
        {isAli && (
          <AliDialog
            href={device.Affiliate_Link}
            title={`Product link: ${device.Brand} - ${device.Device}`}
          />
        )}
        {!isAli && (
          <a
            href={device.Affiliate_Link}
            title={`Product link: ${device.Brand} - ${device.Device}`}
          >
            {device.Affiliate_Link}
          </a>
        )}
        <LightTooltip
          interactive
          title={
            <React.Fragment>
              This URL is an affiliate link: purchases made via this link
              contribute towards maintaining this site and buying devices for
              more thorough technical reviews.
              {hasUrl && (
                <span>
                  {` `}
                  The direct link to the product is:{` `}
                  {isAli && (
                    <AliDialog
                      href={device.Detail}
                      title={`Product link: ${device.Brand} - ${device.Device}`}
                    />
                  )}
                  {!isAli && (
                    <a
                      href={device.Detail}
                      title={`Product link: ${device.Brand} - ${device.Device}`}
                    >
                      {device.Detail}
                    </a>
                  )}
                </span>
              )}
            </React.Fragment>
          }
        >
          <MonetizationOnIcon />
        </LightTooltip>
      </div>
    )
  } else if (hasUrl && isAli) {
    return (
      <div>
        <AliDialog
          href={device.Detail}
          title={`Product link: ${device.Brand} - ${device.Device}`}
        />
      </div>
    )
  } else if (hasUrl) {
    return (
      <div>
        <a
          href={device.Detail}
          title={`Product link: ${device.Brand} - ${device.Device}`}
        >
          {device.Detail}
        </a>
      </div>
    )
  } else {
    return <div />
  }
}
