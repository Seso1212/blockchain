
// Mining utility functions

export const MAX_MINING_TIME = 86400; // 24 hours in seconds
export const MAX_SPACE_MINING_TIME = 86400; // 24 hours in seconds for mining spaces
export const SPACE_AD_DURATION = 12; // How many hours an ad unlocks a space for
export const SCOINS_PER_AD = 5; // Scoins earned from watching an ad
export const SCOINS_PER_HOUR = 5; // Scoins earned per hour in a mining space

// Calculate experience required for next level
export const calculateExpRequired = (level: number): number => {
  const baseExp = 100;
  const multiplier = 1.5;
  return Math.floor(baseExp * Math.pow(multiplier, level - 1));
};

// Calculate mining reward based on level
export const calculateReward = (level: number): number => {
  const baseReward = 0.0025;
  const multiplier = 1.2;
  return baseReward * Math.pow(multiplier, level - 1);
};

// Get random mining duration (25-35 seconds)
export const getRandomMiningDuration = (): number => {
  return Math.floor(Math.random() * 10000) + 25000; // 25-35 seconds in milliseconds
};

// Format number with commas
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat().format(number);
};

// Format time from seconds to hh:mm:ss
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
};

// Format long time for display (used for mining time)
export const formatLongTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours}h ${minutes}m ${secs}s`;
};

// Format floats to fixed decimal places
export const formatFloat = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

// List of countries for the profile form
export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "RU", name: "Russia" },
  { code: "ZA", name: "South Africa" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "PT", name: "Portugal" },
  { code: "GR", name: "Greece" },
  { code: "IE", name: "Ireland" },
  { code: "NZ", name: "New Zealand" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "PH", name: "Philippines" },
  { code: "ID", name: "Indonesia" },
  { code: "VN", name: "Vietnam" },
  { code: "EG", name: "Egypt" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "GH", name: "Ghana" },
  { code: "ZA", name: "South Africa" },
  { code: "IL", name: "Israel" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" },
  { code: "BH", name: "Bahrain" },
  { code: "OM", name: "Oman" },
  { code: "JO", name: "Jordan" },
  { code: "LB", name: "Lebanon" },
  { code: "TR", name: "Turkey" },
  { code: "PK", name: "Pakistan" }
  // Add more countries as needed
];
