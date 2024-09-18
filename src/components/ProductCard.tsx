import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";

import { Product } from "@/interfaces/product.interface";
import { formatPrice } from "@/utils/formatPrice";
import { ModalPay } from "./ModalPay";
import { SignInButton, useUser } from "@clerk/nextjs";

import { Button } from "./ui/button";

interface ProductProps {
  product: Product;
}

export const ProductCard = ({
  product: { name, stock, price, description, id },
}: ProductProps) => {
  const { user } = useUser();

  return (
    <Card className="shadow-lg border-0  overflow-hidden flex flex-col justify-between bg-gray-100">
      <CardHeader className="p-4  bg-gray-800 text-white">
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <CardDescription className="flex justify-center mt-2">
          <span className="text-2xl font-bold text-yellow-300">
            {formatPrice(price, "COP", 0)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 bg-gray-100">
        <p className="text-gray-800">{description}</p>
        <p className="text-gray-800">Stock: {stock}</p>
      </CardContent>
      <CardFooter className="bg-gray-200 p-4 flex justify-end">
        {user ? (
          <ModalPay productId={id} userId={user.id} />
        ) : (
          <SignInButton mode="modal">
            <Button className="font-bold">Pay with credit card</Button>
          </SignInButton>
        )}
      </CardFooter>
    </Card>
  );
};
