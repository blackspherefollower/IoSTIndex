import React from "react"
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"
import LightTooltip from "./LightTooltip"

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

  if (hasAUrl) {
    return (
      <div style={{ display: `flex`, alignItems: `center` }}>
        <a
          href={device.Affiliate_Link}
          title={`Affiliate link: ${device.Brand} - ${device.Device}`}
        >
          {device.Affiliate_Link}
        </a>
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
        >
          <MonetizationOnIcon />
        </LightTooltip>
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
