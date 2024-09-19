import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import paymentReducer from "./paymentSlice";
import localStorageMiddleware from "@/middlewares/localStorageMiddleware";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("paymentData");
    if (serializedState === null) {
      return undefined;
    }
    return { payment: { paymentData: JSON.parse(serializedState) } };
  } catch (err) {
    return undefined;
  }
};

const preloadedState = loadState();

const store: EnhancedStore = configureStore({
  reducer: {
    payment: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
