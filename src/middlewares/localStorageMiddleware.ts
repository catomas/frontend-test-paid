import { RootState } from "@/redux/store";
import { Middleware } from "@reduxjs/toolkit";

const localStorageMiddleware: Middleware<object, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();
    localStorage.setItem(
      "paymentData",
      JSON.stringify(state.payment.paymentData)
    );
    return result;
  };

export default localStorageMiddleware;
