import { createContext, useContext } from 'react';

export interface CompanyDetails {
  id: number;
  name: string;
  slug: string;
  logo_url: string;
  cover_image_url: string;
  address: string;
  contact_email: string;
  phone: string;
  timezone: string;
  primary_color: string;
  secondary_color: string;
  currency_code: string;
}

const CompanyContext = createContext<CompanyDetails | null>(null);

export const useCompanyDetails = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompanyDetails must be used within a CompanyProvider');
  }
  return context;
};

export default CompanyContext;
