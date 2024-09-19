import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CardInfo {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

interface CustomerData {
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

interface PaymentData {
  userId: string;
  productId: string;
  quantity: number;
  cardInfo: CardInfo;
  customerData: CustomerData;
}

interface PaymentState {
  paymentData: PaymentData | null;
}

const initialState: PaymentState = {
  paymentData: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentData(state, action: PayloadAction<PaymentData>) {
      state.paymentData = action.payload;
    },
    clearPaymentData(state) {
      state.paymentData = null;
    },
  },
});

export const { setPaymentData, clearPaymentData } = paymentSlice.actions;
export default paymentSlice.reducer;
