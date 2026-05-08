import React, { createContext, useContext, useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"

// Function to convert an ISO currency code (e.g., USD) into a localized symbol or name.
export const getCurrencySymbol = (isoCode) => {
  try {
    return new Intl.NumberFormat(`en-us`, {
      style: `currency`,
      currency: isoCode,
    })
      .formatToParts()
      .find((part) => part.type === `currency`).value
  } catch (e) {
    console.warn(`Could not determine symbol for ${isoCode}:`, e)
    return `` // Fallback if currency code is invalid or unavailable
  }
}

const CurrencyContext = createContext()

export const CurrencyProvider = ({ children }) => {
  const data = useStaticQuery(graphql`
    query {
      currencyConversion {
        usedCurrencies
        exchangeRates
      }
    }
  `)

  const [currency, setCurrency] = useState(`Original`) // Changed default to string for safety/consistency

  useEffect(() => {
    const savedCurrency = localStorage.getItem(`preferredCurrency`)
    if (savedCurrency) {
      setCurrency(savedCurrency)
    } else {
      // Initialize with the first used currency if no preference is set or check data context
      // Since we cannot reliably read dynamic list data here, we rely on user interaction for initial setting.
      const initialCurrency = `Original`
      setCurrency(initialCurrency)
    }
  }, [])

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: (newCurrency) => {
          setCurrency(newCurrency)
          localStorage.setItem(`preferredCurrency`, newCurrency)
        },
        usedCurrencies: data.currencyConversion?.usedCurrencies || [],
        exchangeRates: data.currencyConversion?.exchangeRates || {},
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
