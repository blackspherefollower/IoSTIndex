/*
This file was adapted from: https://github.com/marisamorby/marisamorby.com/blob/master/packages/gatsby-theme-blog-sanity/src/components/seo.js

Copyright 2019 Marisa Morby

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

import React from "react"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

const SEO = ({ post }) => {
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

  if (post === undefined) post = {}
  const title = post.title || defaults.title
  const description = post.description || defaults.description
  const author = post.author || defaults.author
  const url = new URL(post.path || ``, defaults.siteUrl)
  const image = post.image ? new URL(post.image, defaults.siteUrl) : false

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={url} />
      <meta name="description" content={description} />
      {image && <meta name="image" content={image} />}

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
    </Helmet>
  )
}

export default SEO
