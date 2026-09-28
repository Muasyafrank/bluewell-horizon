/**
 * Kenyan delivery reference data.
 *
 * `getDeliveryZone` used to loop over the zone map on every call and silently
 * fall back to Nairobi pricing for any county it did not recognise, which meant
 * a typo in the county list would quietly undercharge for delivery. The lookup
 * is now built once and unknown counties are reported explicitly.
 */

export const COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu',
  'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa',
  "Murang'a", 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
  'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
  'Trans-Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
];

export const DELIVERY_ZONES = {
  nairobi: {
    name: 'Nairobi',
    counties: ['Nairobi'],
    standard: { fee: 300, eta: '1–2 business days' },
    express: { fee: 500, eta: 'Same day when ordered before noon' },
    pickup: { fee: 0, eta: 'Ready in about 2 hours' },
  },
  central: {
    name: 'Central',
    counties: ['Kiambu', "Murang'a", 'Nyeri', 'Kirinyaga', 'Nyandarua'],
    standard: { fee: 500, eta: '2–3 business days' },
    express: { fee: 800, eta: '1–2 business days' },
    pickup: { fee: 0, eta: 'Collect from our Nairobi store' },
  },
  coast: {
    name: 'Coast',
    counties: ['Mombasa', 'Kilifi', 'Kwale', 'Tana River', 'Lamu', 'Taita-Taveta'],
    standard: { fee: 700, eta: '3–4 business days' },
    express: { fee: 1200, eta: '2 business days' },
    pickup: { fee: 0, eta: 'Collect from our Nairobi store' },
  },
  western: {
    name: 'Western and Nyanza',
    counties: ['Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'],
    standard: { fee: 600, eta: '3–4 business days' },
    express: { fee: 1000, eta: '2 business days' },
    pickup: { fee: 0, eta: 'Collect from our Nairobi store' },
  },
  riftValley: {
    name: 'Rift Valley',
    counties: ['Nakuru', 'Uasin Gishu', 'Nandi', 'Kericho', 'Bomet', 'Narok', 'Trans-Nzoia', 'West Pokot', 'Elgeyo-Marakwet', 'Baringo', 'Laikipia', 'Samburu', 'Turkana', 'Kajiado'],
    standard: { fee: 650, eta: '3–5 business days' },
    express: { fee: 1100, eta: '2–3 business days' },
    pickup: { fee: 0, eta: 'Collect from our Nairobi store' },
  },
  eastern: {
    name: 'Eastern',
    counties: ['Machakos', 'Makueni', 'Kitui', 'Embu', 'Tharaka-Nithi', 'Meru', 'Isiolo', 'Marsabit'],
    standard: { fee: 550, eta: '2–4 business days' },
    express: { fee: 900, eta: '1–2 business days' },
    pickup: { fee: 0, eta: 'Collect from our Nairobi store' },
  },
  northEastern: {
    name: 'North Eastern',
    counties: ['Garissa', 'Wajir', 'Mandera'],
    standard: { fee: 800, eta: '4–6 business days' },
    express: { fee: 1500, eta: '2–3 business days' },
    pickup: { fee: 0, eta: 'Collect from our Nairobi store' },
  },
};

export const DELIVERY_METHODS = [
  { value: 'standard', label: 'Standard delivery' },
  { value: 'express', label: 'Express delivery' },
  { value: 'pickup', label: 'Collect in person' },
];

/** county -> zone key, built once at module load. */
const COUNTY_TO_ZONE = Object.entries(DELIVERY_ZONES).reduce((lookup, [key, zone]) => {
  zone.counties.forEach((county) => {
    lookup[county] = key;
  });
  return lookup;
}, {});

// Every county must belong to exactly one zone, or delivery is mispriced.
if (process.env.NODE_ENV === 'development') {
  const unmapped = COUNTIES.filter((county) => !COUNTY_TO_ZONE[county]);
  if (unmapped.length) {
    console.warn('Counties without a delivery zone:', unmapped.join(', '));
  }
}

export function getDeliveryZoneKey(county) {
  return COUNTY_TO_ZONE[county] || null;
}

export function getDeliveryZone(county) {
  const key = getDeliveryZoneKey(county);
  return key ? DELIVERY_ZONES[key] : null;
}

/** Fee and estimated time for a county and delivery method. */
export function getDeliveryOption(county, method = 'standard') {
  const zone = getDeliveryZone(county);
  if (!zone) return { fee: 0, eta: 'Available once you choose a county' };
  return zone[method] || zone.standard;
}

export const MPESA_DETAILS = {
  paybill: '100200',
  accountHint: 'Your order number',
  businessName: 'Bluewell Horizon Limited',
};

export const BANK_DETAILS = {
  bankName: 'KCB Bank Kenya',
  accountName: 'Bluewell Horizon Limited',
  accountNumber: '1234567890',
  branch: 'Harambee Avenue',
  swiftCode: 'KCBLKENX',
};

export const VAT_RATE = 0.16;
