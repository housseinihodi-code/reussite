export const formatCurrency = (amount: number, currency = 'EUR', locale = 'fr-FR'): string =>
  new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

export const formatMileage = (mileage: number, unit = 'km', locale = 'fr-FR'): string =>
  `${new Intl.NumberFormat(locale).format(mileage)} ${unit}`;

export const formatDate = (isoDate: string, locale = 'fr-FR'): string =>
  new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(isoDate));

export const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;
