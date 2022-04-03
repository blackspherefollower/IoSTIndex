import { createTheme } from "@mui/material"

export const theme = createTheme({
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
