/**
 * Format a number as Vietnamese Dong (VND) currency
 * @param value - The numeric value to format
 * @returns Formatted string with VND symbol and thousand separators
 * @example
 * formatVND(1500000) => "₫1.500.000"
 */
export const formatVND = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Convert USD to VND (approximate conversion at 1 USD = 24,500 VND)
 * @param usd - The USD amount to convert
 * @returns The equivalent value in VND
 */
export const usdToVnd = (usd: number): number => {
  const USD_TO_VND_RATE = 24500;
  return Math.round(usd * USD_TO_VND_RATE);
};
