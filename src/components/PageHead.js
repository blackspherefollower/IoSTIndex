import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const PageHead = ({ location, meta, children }) => {
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
          description
          siteUrl
          author
        }
      }
    }
  `)

  const defaults = data.site.siteMetadata

  if (defaults.siteUrl === `` && typeof window !== `undefined`) {
    defaults.siteUrl = window.location.origin
  }

  if (defaults.siteUrl === ``) {
    console.error(`Please set a siteUrl in your site metadata!`)
    return null
  }

  if (meta === undefined) meta = {}
  const title = meta.title || defaults.title
  const description = meta.description || defaults.description
  const author = meta.author || defaults.author
  const url = new URL(meta.path || ``, defaults.siteUrl)
  const image = meta.image ? new URL(meta.image, defaults.siteUrl) : false

  return (
    <>
      <title>{title}</title>
      <link rel="canonical" href={url} />
      <meta name="description" content={description} />
      {image && <meta name="image" content={image} />}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <meta httpEquiv="content-language" content="en-gb" />

      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={author} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </>
  )
}

export default PageHead
