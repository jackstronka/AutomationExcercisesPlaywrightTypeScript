export type RegistrationData = {
  name: string;
  email: string;
  title: 'Mr' | 'Mrs';
  password: string;
  day: string;
  month: string;
  year: string;
  newsletter: boolean;
  specialOffers: boolean;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
};

export const defaultRegistrationData: Omit<RegistrationData, 'name' | 'email'> = {
  title: 'Mr',
  password: 'TestPassword123',
  day: '10',
  month: '3',
  year: '1990',
  newsletter: true,
  specialOffers: true,
  firstName: 'First',
  lastName: 'Last',
  company: 'Company',
  address1: 'Address line 1',
  address2: 'Address line 2',
  country: 'United States',
  state: 'State',
  city: 'City',
  zipcode: '12345',
  mobile: '1234567890',
};
