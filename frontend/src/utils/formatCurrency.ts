export function formatVND(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) {
    return '0 ₫';
  }

  const numericAmount = typeof amount === 'string' ? Number(amount) : amount;

  if (Number.isNaN(numericAmount as number)) {
    return '0 ₫';
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(numericAmount as number);
}


