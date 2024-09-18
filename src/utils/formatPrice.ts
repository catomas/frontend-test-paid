export const formatPrice = (
  price: number,
  currency: string,
  decimals: number = 2
): string => {
  if (currency === "COP") {
    return `$${new Intl.NumberFormat("es-CO", {
      style: "decimal",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price)} COP`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price);
};
