/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

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
    `gatsby-plugin-material-ui`,
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
              allSitePage.edges.map((edge) =>
                Object.assign(
                  {},
                  {
                    date: edge.node.pageContext.delta.date * 1000,
                    url: site.siteMetadata.siteUrl + edge.node.path,
                    title: `IoST Index: Update at ${new Date(edge.node.pageContext.delta.date * 1000).toUTCString()}`
                  }
                )
              ),
            query: `
              {
                allSitePage(
                  filter: {path: {regex: "^/changes/"}}
                  sort: {order: DESC, fields: path}
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
