export const formatEventDate = (start_time, end_time) => {
  const startDate = new Date(start_time);
  const endDate = new Date(end_time);

  // Use the user's locale
  const userLocale = navigator.language || 'en-US';

  // Abbreviated month name (e.g., Nov instead of November)
  const optionsDate = { day: 'numeric', month: 'short', year: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };

  const isSameDay = startDate.toDateString() === endDate.toDateString();

  if (isSameDay) {
    return `${startDate.toLocaleDateString(userLocale, optionsDate)}, starting at ${startDate.toLocaleTimeString(userLocale, optionsTime)}`;
  } else {
    return `${startDate.toLocaleDateString(userLocale, optionsDate)} - ${endDate.toLocaleDateString(userLocale, optionsDate)}`;
  }
}



export const formatPrice = (currency, amount) => {
  // Map each currency to its most appropriate locale
  const currencyLocaleMap = {
    USD: 'en-US',  // US Dollar
    EUR: 'de-DE',  // Euro
    GBP: 'en-GB',  // British Pound
    ZAR: 'en-ZA',  // South African Rand
    JPY: 'ja-JP',  // Japanese Yen
    INR: 'en-IN',  // Indian Rupee
    AUD: 'en-AU',  // Australian Dollar
    CAD: 'en-CA',  // Canadian Dollar
    CNY: 'zh-CN',  // Chinese Yuan
  };

  // Use the correct locale for the currency or fallback to 'en-US'
  const locale = currencyLocaleMap[currency] || 'en-US';

  console.log("formatPrice", locale, currency, amount);

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',  // Always use the symbol, not the code
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
}
