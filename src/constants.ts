export const PRICING_PLANS = [
  {
    id: '1-month',
    name: '1 Month',
    price: 5,
    description: 'Billed monthly',
    features: ['Unlimited devices', 'High-speed servers', '24/7 support'],
  },
  {
    id: '5-months',
    name: '5 Months',
    price: 30,
    description: 'Billed every 5 months',
    features: ['Save 15%', 'Unlimited devices', 'High-speed servers'],
  },
  {
    id: '1-year',
    name: '1 Year',
    price: 50,
    description: 'Billed annually',
    features: ['Best Value', 'Save 30%', 'Unlimited devices', 'Priority support'],
  },
];

export const SERVERS = [
  { id: 'us-east', name: 'United States', city: 'New York', flag: '🇺🇸', load: 45, latency: 24 },
  { id: 'uk-lon', name: 'United Kingdom', city: 'London', flag: '🇬🇧', load: 62, latency: 38 },
  { id: 'de-fra', name: 'Germany', city: 'Frankfurt', flag: '🇩🇪', load: 31, latency: 15 },
  { id: 'jp-tok', name: 'Japan', city: 'Tokyo', flag: '🇯🇵', load: 88, latency: 120 },
  { id: 'sg-sin', name: 'Singapore', city: 'Singapore', flag: '🇸🇬', load: 55, latency: 95 },
  { id: 'au-syd', name: 'Australia', city: 'Sydney', flag: '🇦🇺', load: 22, latency: 180 },
  { id: 'ca-tor', name: 'Canada', city: 'Toronto', flag: '🇨🇦', load: 40, latency: 42 },
  { id: 'fr-par', name: 'France', city: 'Paris', flag: '🇫🇷', load: 58, latency: 28 },
  { id: 'nl-ams', name: 'Netherlands', city: 'Amsterdam', flag: '🇳🇱', load: 15, latency: 12 },
  { id: 'in-mum', name: 'India', city: 'Mumbai', flag: '🇮🇳', load: 75, latency: 110 },
];

export const PAYMENT_DETAILS = {
  paypal: 'killerpakistan0000@gmail.com',
  bank: {
    accountName: 'SharkVPN Services',
    accountNumber: '1234-5678-9012',
    bankName: 'Global Bank',
    swiftCode: 'GLBINTXXXX',
  }
};
