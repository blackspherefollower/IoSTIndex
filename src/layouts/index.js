import React from "react"
import { graphql, navigate, useStaticQuery } from "gatsby"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import BackIcon from "@mui/icons-material/ArrowBack"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import { Helmet } from "react-helmet"
import SvgIcon from "@mui/material/SvgIcon"
import { theme } from "./theme"
import Feedback from "../components/feeder-react-feedback/Feedback"

function LayoutInner({ children }) {
  const isRoot =
    typeof location !== `undefined` && location && location.pathname === `/`
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          feederId
        }
      }
    }
  `)

  return (
    <div>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <meta httpEquiv="content-language" content="en-gb" />
      </Helmet>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            sx={{ marginRight: theme.spacing(2) }}
            color="inherit"
            aria-label="menu"
            onClick={() => {
              if (!isRoot) {
                navigate(`/`)
              }
            }}
          >
            {isRoot ? <MenuIcon /> : <BackIcon />}
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            IoST Index
          </Typography>
          <Button color="inherit" onClick={() => navigate(`/about`)}>
            About
          </Button>
          <Button
            variant="contained"
            title="Become a Patron!"
            href={`https://www.patreon.com/bePatron?u=6548129`}
            sx={{ backgroundColor: `#f46758`, borderColor: `#f46758` }}
            startIcon={
              <SvgIcon>
                <g
                  transform="matrix(0.2400288,0,0,0.2400288,-0.00288035,-0.02400288)"
                  fill="#000000"
                  fillRule="evenodd"
                >
                  <path
                    d="m 64.1102,0.1004 c -19.8512,0 -36.0016,16.1482 -36.0016,35.9982 0,19.7898 16.1504,35.8904 36.0016,35.8904 C 83.9,71.989 100,55.8884 100,36.0986 100,16.2486 83.9,0.1004 64.1102,0.1004"
                    fill="#fff"
                  />
                  <polygon
                    points="0.012,95.988 17.59,95.988 17.59,0.1 0.012,0.1 "
                    fill="#0a2f49"
                  />
                </g>
              </SvgIcon>
            }
          >
            Become a Patron!
          </Button>
        </Toolbar>
      </AppBar>
      {children}
      {data.site.siteMetadata.feederId.length > 0 && (
        <Feedback
          projectId={data.site.siteMetadata.feederId}
          email={true}
          primaryColor={theme.palette.primary.main}
          hoverBorderColor={theme.palette.primary.light}
          projectName={`IoST Index`}
        />
      )}
    </div>
  )
}

export default function Layout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <LayoutInner theme={theme}>{children}</LayoutInner>
    </ThemeProvider>
  )
}
