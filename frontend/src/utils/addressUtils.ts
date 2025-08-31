// State code to full name mapping
export const stateCodeToName: { [key: string]: string } = {
  'DL': 'Delhi',
  'MH': 'Maharashtra',
  'KA': 'Karnataka',
  'TN': 'Tamil Nadu',
  'WB': 'West Bengal',
  'AP': 'Andhra Pradesh',
  'AR': 'Arunachal Pradesh',
  'AS': 'Assam',
  'BR': 'Bihar',
  'CT': 'Chhattisgarh',
  'GA': 'Goa',
  'GJ': 'Gujarat',
  'HR': 'Haryana',
  'HP': 'Himachal Pradesh',
  'JK': 'Jammu and Kashmir',
  'JH': 'Jharkhand',
  'KL': 'Kerala',
  'MP': 'Madhya Pradesh',
  'MN': 'Manipur',
  'ML': 'Meghalaya',
  'MZ': 'Mizoram',
  'NL': 'Nagaland',
  'OR': 'Odisha',
  'PB': 'Punjab',
  'RJ': 'Rajasthan',
  'SK': 'Sikkim',
  'TG': 'Telangana',
  'TR': 'Tripura',
  'UP': 'Uttar Pradesh',
  'UT': 'Uttarakhand'
};

// Country code to full name mapping
export const countryCodeToName: { [key: string]: string } = {
  'IN': 'India',
  'US': 'United States',
  'GB': 'United Kingdom',
  'CA': 'Canada',
  'AU': 'Australia'
};

// Function to get state name from code
export const getStateName = (stateCode: string): string => {
  return stateCodeToName[stateCode] || stateCode;
};

// Function to get country name from code
export const getCountryName = (countryCode: string): string => {
  return countryCodeToName[countryCode] || countryCode;
};

// Function to format address for display
export const formatAddressForDisplay = (address: {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}): string => {
  const parts = [
    address.line1,
    address.line2,
    address.city,
    getStateName(address.state),
    address.postalCode,
    getCountryName(address.country)
  ].filter(Boolean);
  
  return parts.join(', ');
};
