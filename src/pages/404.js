import React from "react"
import Container from "@mui/material/Container"
import { Typography } from "@mui/material"
import { theme } from "../layouts/theme"
import PageHead from "../components/PageHead"

export function Head({ location, data }) {
  return (
    <PageHead
      meta={{
        path: location.pathname,
        title: `IoST Index: 404 - SexTech Not Found`,
      }}
    />
  )
}

export default function Error404() {
  return (
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
        404 - SexTech Not Found!
      </Typography>
      <p>
        I hope you found this URL by accident, but if not please file an issue
        over at{` `}
        <a href="https://github.com/blackspherefollower/IoSTIndex/issues">
          https://github.com/blackspherefollower/IoSTIndex/issues
        </a>
      </p>
    </Container>
  )
}
