import { PaymentData } from "@/interfaces/payment.interface";
import axios from "axios";

export const submitPayment = async (data: PaymentData) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/transactions",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting payment:", error);
    throw error;
  }
};

export const getTransaction = async (transactionId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/transactions/${transactionId}/status`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting transaction:", error);
    throw error;
  }
};
