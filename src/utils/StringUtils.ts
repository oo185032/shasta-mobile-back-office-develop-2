
export const capitalizeFirstLetter = (value: string, isAllOtherLowerCase = false) => {
    const otherPart = isAllOtherLowerCase ? value.slice(1).toLowerCase() : value.slice(1)
    return value.charAt(0).toUpperCase() + otherPart;
}

export const formatPrice = (price: number, currency: string = 'USD', locale: string = 'en-US'): string => {
  try
  {
    return price.toLocaleString(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
    })
  } catch (error) {
    return price + ''
  }
}

export const formatPercent = (value: number, includeSigns: boolean = false, digits: number = 2, locale: string = 'en-US'): string => {
    return `${includeSigns && value > 0 ? '+': ''}${value.toLocaleString(locale, { style: 'percent', minimumFractionDigits: digits })}`
}