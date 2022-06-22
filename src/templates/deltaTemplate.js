import React from "react"
import SEO from "../components/seo"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import { Link } from "gatsby"

export default function Template({ path, pageContext }) {
  const delta = pageContext.delta
  const date = new Date(delta.date * 1000).toUTCString()

  const updates = delta.updated.filter(d => d[2] !== null)

  return (
    <Container>
      <SEO
        post={{
          path,
          title: `IoST Index: Update at ${date}`,
        }}
      />
      <div>
        <Typography variant="h1" gutterBottom>
          Update at {date}
        </Typography>
      </div>
      {delta.added.length > 0 && (
        <div>
          <Typography variant="h4" gutterBottom>
            Devices added
          </Typography>
          {delta.added.map((d, i) => (
            <Container key={i}>
              <Link href={d.path}>
                {d.Brand} - {d.Device}
              </Link>
            </Container>
          ))}
        </div>
      )}
      {delta.removed.length > 0 && (
        <div>
          <Typography variant="h4" gutterBottom>
            Devices removed
          </Typography>
          {delta.removed.map((d, i) => (
            <Container key={i}>
              {d.Brand} - {d.Device}
            </Container>
          ))}
        </div>
      )}
      {updates.length > 0 && (
        <div>
          <Typography variant="h4" gutterBottom>
            Devices updated
          </Typography>
          {updates.map((d, i) => (
            <Container key={i}>
              <Link href={d[0].path}>
                {d[0].Brand} - {d[0].Device}
              </Link>
              {d[2].map((e, j) => (
                <span key={j}>
                  {` `}
                  {e.path.join(`, `)} Changed from "{e.lhs}" to "{e.rhs}".
                </span>
              ))}
            </Container>
          ))}
        </div>
      )}
    </Container>
  )
}
