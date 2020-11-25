import React from "react"
import SEO from "../components/seo"
import Container from "@material-ui/core/Container"
import { makeStyles, Typography } from "@material-ui/core"

const useStyles = makeStyles(theme => {
  return {
    root: {},
    content: {
      paddingTop: theme.spacing(4),
      flex: `1 1 100%`,
      position: `relative`,
      maxWidth: `100%`,
      margin: `0 auto`,
    },
  }
})

export default function Error404() {
  const classes = useStyles()

  return (
    <Container className={classes.root}>
      <SEO
        post={{
          page: `404`,
          title: `IoST Index: 404 - SexTech Not Found`,
          image: undefined,
        }}
      />
      <Container className={classes.content}>
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
