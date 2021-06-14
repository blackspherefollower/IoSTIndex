import React from "react"
import { graphql } from "gatsby"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core"
import SEO from "../components/seo"

const useStyles = makeStyles((theme) => {
  return {
    markdown: {
      margin: `50px`,
    },
  }
})

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
  path,
}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark
  const classes = useStyles()
  return (
    <div className={classes.markdown}>
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
    </div>
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
