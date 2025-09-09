// Utility functions for address-based GST calculations

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia", 
  "Germany", "France", "Japan", "Singapore", "Netherlands", "Sweden",
  "Norway", "Switzerland", "New Zealand", "Other"
];

export const isAndhraPradesh = (state: string): boolean => {
  const normalizedState = state.toLowerCase().trim();
  return normalizedState.includes('andhra pradesh') || normalizedState === 'ap';
};

export const isIndianState = (state: string): boolean => {
  return indianStates.some(s => s.toLowerCase() === state.toLowerCase());
};

export const isInternational = (country: string): boolean => {
  return country.toLowerCase() !== 'india';
};

export const getGstType = (state: string, country: string): string => {
  if (isInternational(country)) {
    return 'International GST';
  } else if (isAndhraPradesh(state)) {
    return 'GST (AP)';
  } else {
    return 'IGST';
  }
};