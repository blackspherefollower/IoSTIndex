import React from "react"
import { graphql } from "gatsby"
import Typography from "@mui/material/Typography"
import SEO from "../components/seo"
import Container from "@mui/material/Container"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
  path,
}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark
  return (
    <Container sx={{ margin: `50px` }}>
      <SEO
        post={{
          path,
          title: `About IoST Index`,
        }}
      />
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
