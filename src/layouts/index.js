import React from "react"
import { navigate } from "gatsby"
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import BackIcon from "@material-ui/icons/ArrowBack"
import Button from "@material-ui/core/Button"
import CssBaseline from "@material-ui/core/CssBaseline"

const useStyles = makeStyles(theme => {
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
  }
})

export default function Layout({ children }) {
  const classes = useStyles()
  const isRoot =
    typeof location !== `undefined` && location && location.pathname === `/`

  return (
    <div className={classes.root}>
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
        </Toolbar>
      </AppBar>
      {children}
    </div>
  )
}
