/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
const jsdom = require(`jsdom`)
const { JSDOM } = jsdom

module.exports = {
  siteMetadata: {
    title: `IoST Index`,
    description: `An index of all known sextech.`,
    siteUrl: `https://iostindex.com`, // used to create absolute URLs for SEO
    author: `@bpherefollower`,
    feederId: ``,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/markdown-pages`,
      },
    },
    `gatsby-transformer-csv`,
    `gatsby-transformer-remark`,
    `gatsby-plugin-layout`,
    `@iostindex/gatsby-plugin-material-ui`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: [`/compare`, `/data`],
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allSitePage } }) =>
              allSitePage.edges.map((edge) => {
                const { document } = new JSDOM(``).window
                const root = document.createElement(`div`)
                if (edge.node.pageContext.delta.added.length > 0) {
                  const c = document.createElement(`div`)
                  const h1 = document.createElement(`h1`)
                  h1.innerHTML = `Devices added`
                  c.appendChild(h1)
                  for (const d of edge.node.pageContext.delta.added) {
                    const a = document.createElement(`a`)
                    a.innerHTML = `${d.Brand} - ${d.Device}`
                    a.href = `${site.siteMetadata.siteUrl}${d.path}`
                    const p = document.createElement(`p`)
                    p.appendChild(a)
                    c.appendChild(p)
                  }
                  root.appendChild(c)
                }
                if (edge.node.pageContext.delta.added.removed > 0) {
                  const c = document.createElement(`div`)
                  const h1 = document.createElement(`h1`)
                  h1.innerHTML = `Devices removed`
                  c.appendChild(h1)
                  for (const d of edge.node.pageContext.delta.removed) {
                    const p = document.createElement(`p`)
                    p.innerHTML = `${d.Brand} - ${d.Device}`
                    c.appendChild(p)
                  }
                  root.appendChild(c)
                }
                if (edge.node.pageContext.delta.updated.length > 0) {
                  const c = document.createElement(`div`)
                  const h1 = document.createElement(`h1`)
                  h1.innerHTML = `Devices updated`
                  c.appendChild(h1)
                  for (const d of edge.node.pageContext.delta.updated) {
                    const a = document.createElement(`a`)
                    a.innerHTML = `${d[0].Brand} - ${d[0].Device}`
                    a.href = `${site.siteMetadata.siteUrl}${d[0].path}`
                    const p = document.createElement(`p`)
                    p.appendChild(a)
                    if (d[2] != null) {
                      for (const e of d[2]) {
                        const s = document.createElement(`span`)
                        s.innerHTML = ` ${e.path.join(`, `)} changed from "${e.lhs}" to "${e.rhs}"`
                        p.appendChild(s)
                      }
                    }
                    c.appendChild(p)
                  }
                  root.appendChild(c)
                }
                return Object.assign(
                  {},
                  {
                    date: edge.node.pageContext.delta.date * 1000,
                    url: site.siteMetadata.siteUrl + edge.node.path,
                    title: `IoST Index: Update at ${new Date(
                      edge.node.pageContext.delta.date * 1000
                    ).toUTCString()}`,
                    custom_elements: [
                      {
                        "content:encoded": root.innerHTML,
                      },
                    ],
                  }
                )
              }),
            query: `
              {
                allSitePage(
                  filter: {path: {regex: "^/changes/"}}
                  sort: {path: DESC}
                  limit: 100
                ) {
                  edges {
                    node {
                      path
                      id
                      pageContext
                    }
                  }
                }
              }
            `,
            output: `/rss.xml`,
            title: `IoST Index`,
            link: `https://iostindex.com`,
          },
        ],
      },
    },
  ],
}

if (
  process.env.MATOMO_SITE_ID &&
  process.env.MATOMO_URL &&
  process.env.MATOMO_SITE_URL
) {
  module.exports.plugins.push({
    resolve: `gatsby-plugin-matomo`,
    options: {
      siteId: process.env.MATOMO_SITE_ID,
      matomoUrl: process.env.MATOMO_URL,
      siteUrl: process.env.MATOMO_SITE_URL,
      disableCookies: true,
    },
  })
}

if (process.env.FEEDER_ID) {
  module.exports.siteMetadata.feederId = process.env.FEEDER_ID
}
