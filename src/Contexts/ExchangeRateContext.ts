import { createContext, useContext } from 'react';

export interface ExchangeRates {
  [targetCurrency: string]: number;
}

const ExchangeRateContext = createContext<ExchangeRates | null>(null);

export const useExchangeRates = () => {
  const context = useContext(ExchangeRateContext);
  if (context === undefined) {
    return {};
  }
  return context;
};

export default ExchangeRateContext;
