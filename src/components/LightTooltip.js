import styled from "@emotion/styled"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"
import React from "react"

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => {
  return {
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 500,
      fontSize: theme.typography.pxToRem(12),
      backgroundColor: `#ffffff`,
      color: `#000000`,
    },
  }
})

export default LightTooltip
