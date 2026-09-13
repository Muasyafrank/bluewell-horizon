// All 47 Kenyan Counties
export const counties = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu',
  'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa',
  'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
  'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
  'Trans-Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

// Delivery zones and fees
export const deliveryZones = {
  nairobi: {
    name: 'Nairobi County',
    standard: { fee: 300, days: '1-2 business days' },
    express: { fee: 500, days: 'Same day (if ordered before 12 PM)' },
    pickup: { fee: 0, days: 'Ready in 2 hours' }
  },
  central: {
    counties: ['Kiambu', 'Murang\'a', 'Nyeri', 'Kirinyaga', 'Nyandarua'],
    standard: { fee: 500, days: '2-3 business days' },
    express: { fee: 800, days: '1-2 business days' },
    pickup: { fee: 0, days: 'Arrange pickup' }
  },
  coast: {
    counties: ['Mombasa', 'Kilifi', 'Kwale', 'Tana River', 'Lamu', 'Taita-Taveta'],
    standard: { fee: 700, days: '3-4 business days' },
    express: { fee: 1200, days: '2 business days' },
    pickup: { fee: 0, days: 'Arrange pickup' }
  },
  western: {
    counties: ['Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'],
    standard: { fee: 600, days: '3-4 business days' },
    express: { fee: 1000, days: '2 business days' },
    pickup: { fee: 0, days: 'Arrange pickup' }
  },
  rift_valley: {
    counties: ['Nakuru', 'Uasin Gishu', 'Nandi', 'Kericho', 'Bomet', 'Narok', 'Trans-Nzoia', 'West Pokot', 'Elgeyo-Marakwet', 'Baringo', 'Laikipia', 'Samburu', 'Turkana'],
    standard: { fee: 650, days: '3-5 business days' },
    express: { fee: 1100, days: '2-3 business days' },
    pickup: { fee: 0, days: 'Arrange pickup' }
  },
  eastern: {
    counties: ['Machakos', 'Makueni', 'Kitui', 'Embu', 'Tharaka-Nithi', 'Meru', 'Isiolo', 'Marsabit'],
    standard: { fee: 550, days: '2-4 business days' },
    express: { fee: 900, days: '1-2 business days' },
    pickup: { fee: 0, days: 'Arrange pickup' }
  },
  north_eastern: {
    counties: ['Garissa', 'Wajir', 'Mandera'],
    standard: { fee: 800, days: '4-6 business days' },
    express: { fee: 1500, days: '2-3 business days' },
    pickup: { fee: 0, days: 'Arrange pickup' }
  }
};

// Get delivery zone for a county
export const getDeliveryZone = (county) => {
  if (county === 'Nairobi') return 'nairobi';
  
  for (const [zone, data] of Object.entries(deliveryZones)) {
    if (data.counties && data.counties.includes(county)) {
      return zone;
    }
  }
  return 'nairobi'; // Default
};

// M-Pesa payment details
export const mpesaDetails = {
  paybill: {
    number: '100200',
    account: 'Your Order Number',
    name: 'Bluewell Horizon Limited'
  },
  till: {
    number: '123456',
    name: 'Bluewell Horizon'
  }
};

// Bank details
export const bankDetails = {
  bankName: 'KCB Bank Kenya',
  accountName: 'Bluewell Horizon Limited',
  accountNumber: '1234567890',
  branch: 'Harambee Avenue',
  swiftCode: 'KCBLKENX'
};