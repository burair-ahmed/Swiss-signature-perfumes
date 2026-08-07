export interface ShippingRateCalculation {
  fee: number;
  locationType: 'karachi' | 'domestic_outside_karachi' | 'international';
  estimatedDays: string;
  courierName?: string;
}

/**
 * Calculates shipping fee based on city and country.
 * - Within Karachi: PKR 250
 * - Outside Karachi (Domestic): Dynamic rate (PKR 350 - 450 depending on tier/location)
 * - International: PKR 1500
 */
export function calculateShippingFee(city: string, country: string = 'Pakistan'): ShippingRateCalculation {
  const normalizedCity = (city || '').trim().toLowerCase();
  const normalizedCountry = (country || 'Pakistan').trim().toLowerCase();

  // International shipping
  if (normalizedCountry !== 'pakistan') {
    return {
      fee: 1500,
      locationType: 'international',
      estimatedDays: '5-10 Business Days',
      courierName: 'DHL International Express',
    };
  }

  // Within Karachi check
  if (normalizedCity.includes('karachi')) {
    return {
      fee: 250,
      locationType: 'karachi',
      estimatedDays: '1-2 Business Days',
      courierName: 'Swiss Signature Karachi Express',
    };
  }

  // Outside Karachi (Domestic Pakistan)
  // Dynamic tier-based rate calculation built for future courier API integration
  const majorCities = [
    'lahore', 'islamabad', 'rawalpindi', 'faisalabad', 
    'multan', 'peshawar', 'quetta', 'sialkot', 'hyderabad', 'gujranwala'
  ];

  const isMajorCity = majorCities.some(c => normalizedCity.includes(c));
  const fee = isMajorCity ? 350 : 450;

  return {
    fee,
    locationType: 'domestic_outside_karachi',
    estimatedDays: '2-4 Business Days',
    courierName: 'Express Courier Partner (TCS / Leopards / Trax)',
  };
}
