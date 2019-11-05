/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: `IoST Index`,
    description: `An index of all known sextech.`,
    baseUrl: `https://iostindex.com`, // used to create absolute URLs for SEO
    author: `@blackspherefollower`,
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
    `gatsby-plugin-modal-routing`,
    `gatsby-transformer-remark`,
    `gatsby-plugin-layout`,
    `gatsby-plugin-material-ui`,
    `gatsby-plugin-react-helmet`,
  ],
}
