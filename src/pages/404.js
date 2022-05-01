import React from "react"
import SEO from "../components/seo"
import Container from "@mui/material/Container"
import { Typography } from "@mui/material"
import { theme } from "../layouts/theme"

export default function Error404() {
  return (
    <Container>
      <SEO
        post={{
          page: `404`,
          title: `IoST Index: 404 - SexTech Not Found`,
          image: undefined,
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
          404 - SexTech Not Found!
        </Typography>
        <p>
          I hope you this URL by accident, but if not please file an issue over
          at{` `}
          <a href="https://github.com/blackspherefollower/IoSTIndex/issues">
            https://github.com/blackspherefollower/IoSTIndex/issues
          </a>
        </p>
      </Container>
    </Container>
  )
}
