export interface PaymentDataForm {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvc: string;
  phoneNumber: string;
  fullName: string;
  legalId: string;
  email: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
}

export interface CardInfo {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

export interface CustomerData {
  phone_number: string;
  full_name: string;
  legal_id: string;
  legal_id_type: string;
  customer_email: string;
  address_line_1: string;
  region: string;
  city: string;
  postal_code: string;
}

export interface PaymentData {
  userId: string;
  productId: string;
  quantity: number;
  cardInfo: CardInfo;
  customerData: CustomerData;
}
