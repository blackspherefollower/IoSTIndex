import React from "react"
import { navigate } from "gatsby"
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import BackIcon from "@material-ui/icons/ArrowBack"
import Button from "@material-ui/core/Button"
import CssBaseline from "@material-ui/core/CssBaseline"
import { Helmet } from "react-helmet"
import SvgIcon from "@material-ui/core/SvgIcon"

const theme = createMuiTheme({
  palette: {
    primary: {
      light: `#718792`,
      main: `#455a64`,
      dark: `#1c313a`,
      contrastText: `#ffffff`,
    },
    secondary: {
      light: `#ffc947`,
      main: `#ff9800`,
      dark: `#c66900`,
      contrastText: `#000000`,
    },
  },
  typography: {
    h1: {
      fontWeight: 400,
      fontSize: `3rem`,
      lineHeight: 1.167,
      letterSpacing: `0em`,
    },
  },
})

const useStyles = makeStyles((theme) => {
  return {
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    patreon: {
      backgroundColor: `#f46758`,
      borderColor: `#f46758`,
    },
  }
})

export default function Layout({ children }) {
  const classes = useStyles(theme)
  const isRoot =
    typeof location !== `undefined` && location && location.pathname === `/`

  return (
    <ThemeProvider theme={theme}>
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
            className={classes.menuButton}
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
          <Typography variant="h6" className={classes.title}>
            IoST Index
          </Typography>
          <Button color="inherit" onClick={() => navigate(`/about`)}>
            About
          </Button>
          <Button
            variant="contained"
            title="Become a Patron!"
            href={`https://www.patreon.com/bePatron?u=6548129`}
            className={classes.patreon}
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
    </ThemeProvider>
  )
}
