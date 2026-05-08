import React, { useState } from "react"
import { graphql, navigate, useStaticQuery } from "gatsby"
import { ThemeProvider } from "@mui/material/styles"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import BackIcon from "@mui/icons-material/ArrowBack"
import CssBaseline from "@mui/material/CssBaseline"
import SvgIcon from "@mui/material/SvgIcon"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import { useMediaQuery } from "@mui/material" // Added hooks for responsiveness and theme access
import Box from "@mui/material/Box" // Used for grouping elements
import { theme } from "./theme"
import Feedback from "../components/feeder-react-feedback/Feedback"
import InputLabel from "@mui/material/InputLabel"
import {
  CurrencyProvider,
  getCurrencySymbol,
  useCurrency,
} from "../context/CurrencyContext"
import Button from "@mui/material/Button"

function CurrencySelector({ isDark = false }) {
  const { currency, setCurrency, usedCurrencies } = useCurrency()

  return (
    <Box component="div" sx={{ display: `flex`, alignItems: `center` }}>
      <InputLabel
        sx={{
          color: isDark ? `inherit` : `white`,
        }}
      >
        Currency
      </InputLabel>
      <Select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        variant="standard"
        sx={{
          color: isDark ? `inherit` : `white`,
          marginLeft: theme.spacing(2),
          "&:before": { borderColor: isDark ? `rgba(0, 0, 0, 0.42)` : `white` },
          "&:after": { borderColor: isDark ? `primary.main` : `white` },
          "& .MuiSvgIcon-root": { color: isDark ? `inherit` : `white` },
        }}
      >
        <MenuItem value="Original">Original</MenuItem>
        {usedCurrencies.map((c) => (
          <MenuItem key={c} value={c}>
            {getCurrencySymbol(c)} {c}
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}

const LayoutInner = ({ children }) => {
  const isRoot =
    typeof location !== `undefined` && location && location.pathname === `/`
  const isMobile = useMediaQuery(theme.breakpoints.down(`sm`))
  const [dropdownAnchorEl, setDropdownAnchorEl] = useState(null)
  const isDropdownOpen = Boolean(dropdownAnchorEl)

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
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          {!isRoot && (
            <IconButton
              edge="start"
              sx={{ marginRight: theme.spacing(2) }}
              color="inherit"
              aria-label="menu"
              onClick={() => {
                navigate(`/`)
              }}
            >
              <BackIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            IoST Index
          </Typography>
          <Box component="div" sx={{ display: `flex`, alignItems: `center` }}>
            {!isMobile && (
              <>
                <CurrencySelector />
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
              </>
            )}

            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={(e) => setDropdownAnchorEl(e.currentTarget)}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* The actual dropdown menu component (using MUI's Menu) */}
            <Menu
              id="menu-about-patron"
              anchorEl={dropdownAnchorEl}
              anchorOrigin={{ vertical: `bottom`, horizontal: `right` }}
              keepMounted
              transformOrigin={{ vertical: `top`, horizontal: `right` }}
              open={isDropdownOpen}
              onClose={() => {
                setDropdownAnchorEl(null)
              }}
            >
              <MenuItem disableRipple sx={{ cursor: `default`, "&:hover": { backgroundColor: `transparent` } }}>
                <CurrencySelector isDark={true} />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate(`/about`)
                  setDropdownAnchorEl(null)
                }}
              >
                About
              </MenuItem>
              <MenuItem
                onClick={() => {
                  window.open(
                    `https://www.patreon.com/bePatron?u=6548129`,
                    `_blank`
                  )
                  setDropdownAnchorEl(null)
                }}
                sx={{ backgroundColor: `#f46758`, borderColor: `#f46758` }}
              >
                <Box sx={{ display: `flex`, alignItems: `center` }}>
                  <SvgIcon sx={{ mr: 1 }}>
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
                  Become a Patron!
                </Box>
              </MenuItem>
            </Menu>
          </Box>
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
      <CurrencyProvider>
        <LayoutInner theme={theme}>{children}</LayoutInner>
      </CurrencyProvider>
    </ThemeProvider>
  )
}
