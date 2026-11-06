import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => localStorage.getItem('harmain_currency') || 'PKR');
  const [exchangeRates, setExchangeRates] = useState({
    SAR: 74.50,
    USD: 278.50,
    EUR: 302.00
  });

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await api.getRates();
        if (res.success && res.exchangeRates) {
          setExchangeRates(res.exchangeRates);
        }
      } catch (err) {
        // Fallback to default exchange rates
      }
    }
    fetchRates();
  }, []);

  const changeCurrency = (newCurr) => {
    setCurrency(newCurr);
    localStorage.setItem('harmain_currency', newCurr);
  };

  /**
   * Converts and formats a given amount (assumed in base PKR by default).
   * @param {number} amountPKR - Amount in Pakistani Rupees
   * @param {string} [overrideCurrency] - Optionally format in a specific currency
   */
  const formatMoney = (amountPKR = 0, overrideCurrency = null) => {
    const activeCurr = overrideCurrency || currency;
    const num = parseFloat(amountPKR) || 0;

    let converted = num;
    let symbol = 'PKR ';

    if (activeCurr === 'SAR') {
      converted = num / (exchangeRates.SAR || 74.50);
      symbol = 'SAR ';
    } else if (activeCurr === 'USD') {
      converted = num / (exchangeRates.USD || 278.50);
      symbol = '$ ';
    } else {
      symbol = 'Rs ';
    }

    return symbol + Math.round(converted).toLocaleString('en-US');
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: changeCurrency, exchangeRates, formatMoney }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
