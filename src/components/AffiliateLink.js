import Tooltip from "@material-ui/core/Tooltip"
import React from "react"
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => {
  return {
    tooltip: {
      maxWidth: 500,
      fontSize: theme.typography.pxToRem(12),
      backgroundColor: `#ffffff`,
      color: `#000000`,
    },
    tooltipColumn: {
      display: `flex`,
      alignItems: `center`,
    },
  }
})

export default function AffiliateLink(props) {
  const classes = useStyles()
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

  if (hasAUrl) {
    return (
      <div className={classes.tooltipColumn}>
        <a
          href={device.Affiliate_Link}
          title={`Affiliate link: ${device.Brand} - ${device.Device}`}
        >
          {device.Affiliate_Link}
        </a>
        <Tooltip
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
                  <a
                    href={device.Detail}
                    title={`Product link: ${device.Brand} - ${device.Device}`}
                  >
                    {device.Detail}
                  </a>
                </span>
              )}
            </React.Fragment>
          }
          classes={{ tooltip: classes.tooltip }}
        >
          <MonetizationOnIcon />
        </Tooltip>
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
