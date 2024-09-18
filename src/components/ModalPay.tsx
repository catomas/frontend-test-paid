"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { PaymentData, PaymentDataForm } from "@/interfaces/payment.interface";
import { submitPayment } from "@/actions/transactions-actions";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import luhnChk from "@/utils/luhnCheck";

interface ModalPayProps {
  productId: string;
  userId: string;
}

export const ModalPay = ({ productId, userId }: ModalPayProps) => {
  const [cardType, setCardType] = useState<string | null>(null);
  const [isCardValid, setIsCardValid] = useState<boolean | null>(null);

  const VISA = /^4[0-9]{3}-?[0-9]{4}-?[0-9]{4}-?[0-9]{4}$/;
  const MASTERCARD = /^5[1-5][0-9]{2}-?[0-9]{4}-?[0-9]{4}-?[0-9]{4}$/;
  const AMEX = /^3[47][0-9-]{16}$/;
  const CABAL = /^(6042|6043|6044|6045|6046|5896){4}[0-9]{12}$/;
  const NARANJA =
    /^(589562|402917|402918|527571|527572|0377798|0377799)[0-9]*$/;

  const formShema = z.object({
    cardNumber: z
      .string()
      .min(10, "Card number must be at least 10 digits")
      .max(16, "Card number must be at most 16 digits"),
    cardHolder: z.string().min(1, "Card holder name is required"),
    expiryDate: z.string().min(1, "Expiry date is required"),
    cvc: z
      .string()
      .min(3, "CVC must be 3 digits")
      .max(3, "CVC must be 3 digits"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(12, "Phone number must be at most 12 digits"),
    fullName: z.string().min(1, "Full name is required"),
    legalId: z
      .string()
      .min(6, "Legal ID must be at least 6 digits")
      .max(12, "Legal ID must be at most 12 digits"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    region: z.string().min(1, "Region is required"),
    postalCode: z.string().min(1, "Postal code is required"),
  });

  const formData = useForm<PaymentDataForm>({
    resolver: zodResolver(formShema),
    defaultValues: {
      cardNumber: "4242424242424242",
      cardHolder: "José Pérez",
      expiryDate: "08 / 28",
      cvc: "123",
      phoneNumber: "573307654321",
      fullName: "Juan Alfonso Pérez Rodriguez",
      legalId: "1234567890",
      email: "example@wompi.co",
      address: "Calle 34 # 56 - 78",
      city: "Bogota",
      region: "Cundinamarca",
      postalCode: "111111",
    },
  });

  const { watch } = formData;

  const cardNumber = watch("cardNumber");

  const determineCardType = (number: string) => {
    if (VISA.test(number)) return "VISA";
    if (MASTERCARD.test(number)) return "MASTERCARD";
    if (AMEX.test(number)) return "AMEX";
    if (CABAL.test(number)) return "CABAL";
    if (NARANJA.test(number)) return "NARANJA";
    return null;
  };

  const isValidCardNumber = (number: string) => {
    return (
      (VISA.test(number) ||
        MASTERCARD.test(number) ||
        AMEX.test(number) ||
        CABAL.test(number) ||
        NARANJA.test(number)) &&
      luhnChk(number)
    );
  };

  useEffect(() => {
    setCardType(determineCardType(cardNumber));
    setIsCardValid(isValidCardNumber(cardNumber));
  }, [cardNumber, determineCardType]);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: PaymentDataForm) => {
    if (!isValidCardNumber(data.cardNumber)) {
      alert("Invalid card number");
      return;
    }

    setIsLoading(true);

    const paymentData: PaymentData = {
      userId,
      productId,
      quantity: 1,
      cardInfo: {
        number: data.cardNumber,
        cvc: data.cvc,
        exp_month: data.expiryDate.split(" / ")[0],
        exp_year: data.expiryDate.split(" / ")[1],
        card_holder: data.cardHolder,
      },
      customerData: {
        phone_number: data.phoneNumber,
        full_name: data.fullName,
        legal_id: data.legalId,
        legal_id_type: "CC",
        customer_email: data.email,
        address_line_1: data.address,
        region: data.region,
        city: data.city,
        postal_code: data.postalCode,
      },
    };
    try {
      const response = await submitPayment(paymentData);
      console.log(response);
      // Redirigir a otra página después de la transacción
      router.push(`success/${response.transaction.id}`); // Asegúrate de que la ruta sea correcta
    } catch (error) {
      console.error("Error submitting payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length >= 3) {
      value = value.slice(0, 2) + " / " + value.slice(2, 4);
    }
    e.target.value = value;
    formData.setValue("expiryDate", value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold py-2 px-4 rounded">
          Pay with credit card
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        {isLoading && (
          <div className="fixed inset-0 bg-black opacity-30 z-40"></div>
        )}

        <DialogHeader>
          <DialogTitle className="text-2xl">Complete your purchase</DialogTitle>
          <DialogDescription>
            Please enter your credit card details and delivery information.
          </DialogDescription>
        </DialogHeader>
        {isLoading && (
          <div className="loading-overlay z-50 flex items-center justify-center">
            <ClipLoader size={80} color={"#123abc"} loading={isLoading} />
          </div>
        )}
        <Form {...formData}>
          <form onSubmit={formData.handleSubmit(onSubmit)}>
            <Accordion type="single" collapsible>
              <AccordionItem value="payment-info">
                <AccordionTrigger className="text-xl">
                  Payment Info
                </AccordionTrigger>
                <AccordionContent className="px-2 flex flex-col gap-4">
                  <FormField
                    control={formData.control}
                    name="cardHolder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Card Holder <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Juan Echeverri"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>
                          {formData.formState.errors.cardHolder?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formData.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Card Number <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <>
                            <Input
                              type="text"
                              placeholder="4242 4242 4242 4242"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                                field.onChange(value);
                              }}
                            />
                            {cardType && (
                              <Image
                                width={32}
                                height={32}
                                src={
                                  cardType === "VISA"
                                    ? "/visa.png"
                                    : "/mastercard.png"
                                }
                                alt={cardType}
                                className=" right-2 top-2 w-8 h-8"
                              />
                            )}
                          </>
                        </FormControl>

                        <FormMessage>
                          {formData.formState.errors.cardNumber?.message}
                          {isCardValid === false && (
                            <p className="text-red-500">Invalid card number</p>
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between space-x-4">
                    <FormField
                      control={formData.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem
                          className="flex-1"
                          style={{ flexBasis: "60%" }}
                        >
                          <FormLabel>
                            Expiry Date <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="MM/YY"
                              {...field}
                              onChange={handleExpiryDateChange}
                            />
                          </FormControl>
                          <FormMessage>
                            {formData.formState.errors.expiryDate?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formData.control}
                      name="cvc"
                      render={({ field }) => (
                        <FormItem
                          className="flex-1"
                          style={{ flexBasis: "40%" }}
                        >
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="123"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage>
                            {formData.formState.errors.cvc?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="delivery-info">
                <AccordionTrigger className="text-xl">
                  Delivery Info
                </AccordionTrigger>
                <AccordionContent className="p-2 flex flex-col gap-4">
                  <FormField
                    control={formData.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Full Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Juan Camilo Echeverri"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>
                          {formData.formState.errors.fullName?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formData.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phone Number <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="300 123 4567"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>
                          {formData.formState.errors.phoneNumber?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formData.control}
                    name="legalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Legal ID <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="123456789"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>
                          {formData.formState.errors.legalId?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formData.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="juan@hotmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>
                          {formData.formState.errors.email?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formData.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Cra 123 # 123"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>
                          {formData.formState.errors.address?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between space-x-4">
                    <FormField
                      control={formData.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem
                          className="flex-1"
                          style={{ flexBasis: "60%" }}
                        >
                          <FormLabel>
                            City <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Medellin"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage>
                            {formData.formState.errors.city?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formData.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem
                          className="flex-1"
                          style={{ flexBasis: "40%" }}
                        >
                          <FormLabel>
                            Region <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Antioquia"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage>
                            {formData.formState.errors.region?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={formData.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Postal Code <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="050012" {...field} />
                        </FormControl>
                        <FormMessage>
                          {formData.formState.errors.postalCode?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex pt-4 justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : "Pay"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
