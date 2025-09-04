export interface ContactPerson {
  name: string;
  email: string;
  phone: string;
  [key: string]: string | number;
}

export interface Supplier {
  id: string;
  companyId: number;
  name: string;
  contactPersons: ContactPerson[];
  address: string;
  geo_location: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
  [key: string | number]: string | number | ContactPerson | ContactPerson[] | undefined;
}