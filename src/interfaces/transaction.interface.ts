import { Product } from "./product.interface";

export interface TransactionInfo {
  id: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  product: Product;
}
