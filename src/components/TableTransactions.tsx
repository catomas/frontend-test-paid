"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { TransactionInfo } from "@/interfaces/transaction.interface";
import { getUserInfo } from "@/actions/user-actions";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";

export const TableTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionInfo[]>([]);

  const { user, isLoaded } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    if (!user || !user.id) {
      router.push("/");
      return;
    }

    const getTransactions = async () => {
      const data = await getUserInfo(user.id);
      setTransactions(data.transactions);
    };

    getTransactions();
  }, [router, user, isLoaded]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500 text-white";
      case "DECLINED":
      case "ERROR":
        return "bg-red-500 text-white";
      case "PENDING":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Table>
      <TableCaption>A list of your recent transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">{transaction.id}</TableCell>
            <TableCell>
              {new Date(transaction.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>{transaction.product.name}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded ${getStatusClass(
                  transaction.status
                )}`}
              >
                {transaction.status}
              </span>
            </TableCell>
            <TableCell className="text-right">
              {formatPrice(transaction.totalPrice, "COP", 0)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
