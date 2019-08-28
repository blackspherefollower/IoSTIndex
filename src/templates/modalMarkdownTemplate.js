import React from "react"
import { graphql } from "gatsby"
import { ModalRoutingContext, Link } from "gatsby-plugin-modal-routing"
import { Navbar } from "react-bootstrap"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark
  return (
    <ModalRoutingContext>
      {({ modal, closeTo }) => (
        <div>
          {modal ? (
            <Navbar>
              <Navbar.Toggle aria-controls="inner-navbar-nav" />
              <Navbar.Collapse
                id="inner-navbar-nav"
                className="justify-content-end"
              >
                <Navbar.Text>
                  <Link to={closeTo}>
                    <span
                      className="oi oi-circle-x"
                      title="Close"
                      aria-hidden="true"
                    />
                  </Link>
                </Navbar.Text>
              </Navbar.Collapse>
            </Navbar>
          ) : (
            <Navbar bg="dark" variant="dark" expand="lg">
              <Navbar.Brand href="#home">IoST Index</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse
                id="basic-navbar-nav"
                className="justify-content-end"
              >
                <Navbar.Text>
                  <Link to="/about/" asModal>
                    About
                  </Link>
                </Navbar.Text>
              </Navbar.Collapse>
            </Navbar>
          )}

          <div className="blog-post-container">
            <div className="blog-post">
              <h1>{frontmatter.title}</h1>
              <div
                className="blog-post-content"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </div>
      )}
    </ModalRoutingContext>
  )
}
export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
    }
  }
`
