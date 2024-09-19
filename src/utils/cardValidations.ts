import luhnChk from "./luhnCheck";

export const VISA = /^4[0-9]{3}-?[0-9]{4}-?[0-9]{4}-?[0-9]{4}$/;
export const MASTERCARD = /^5[1-5][0-9]{2}-?[0-9]{4}-?[0-9]{4}-?[0-9]{4}$/;
export const AMEX = /^3[47][0-9-]{16}$/;
export const CABAL = /^(6042|6043|6044|6045|6046|5896){4}[0-9]{12}$/;
export const NARANJA =
  /^(589562|402917|402918|527571|527572|0377798|0377799)[0-9]*$/;

export const determineCardType = (number: string) => {
  if (VISA.test(number)) return "VISA";
  if (MASTERCARD.test(number)) return "MASTERCARD";
  if (AMEX.test(number)) return "AMEX";
  if (CABAL.test(number)) return "CABAL";
  if (NARANJA.test(number)) return "NARANJA";
  return null;
};

export const isValidCardNumber = (number: string) => {
  return (
    (VISA.test(number) ||
      MASTERCARD.test(number) ||
      AMEX.test(number) ||
      CABAL.test(number) ||
      NARANJA.test(number)) &&
    luhnChk(number)
  );
};
