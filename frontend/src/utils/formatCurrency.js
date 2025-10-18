// @ts-check

/**
 * Format amount as Vietnamese Dong currency
 * @param {number|string|null|undefined} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatVND(amount) {
  if (amount === null || amount === undefined) {
    return '0 ₫';
  }

  const numericAmount = typeof amount === 'string' ? Number(amount) : amount;

  if (Number.isNaN(numericAmount)) {
    return '0 ₫';
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(numericAmount);
}
