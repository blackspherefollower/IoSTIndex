import React from "react"
import { graphql } from "gatsby"
import Typography from "@mui/material/Typography"
import PageHead from "../components/PageHead"
import Container from "@mui/material/Container"
import NotFound from "../pages/404"

export function Head({ data }) {
  return (
    <PageHead
      meta={{
        path: data?.markdownRemark?.frontmatter?.path || null,
        title: data?.markdownRemark?.frontmatter?.title || null,
      }}
    />
  )
}

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
  path,
}) {
  if ((data?.markdownRemark || null) == null) {
    return <NotFound />
  }

  const { frontmatter, html } = data.markdownRemark
  return (
    <Container sx={{ margin: `50px` }}>
      <Typography variant="h1" gutterBottom>
        {frontmatter.title}
      </Typography>
      <div
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Container>
  )
}
export const pageQuery = graphql`
  query ($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
    }
  }
`
