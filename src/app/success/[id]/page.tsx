"use client";

import { getTransaction } from "@/actions/transactions-actions";
import StatusCircle from "@/components/StatusCircle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SuccessPageProps {
  params: {
    id: string;
  };
}

export default function SuccessPage({ params }: SuccessPageProps) {
  const [status, setStatus] = useState<
    "PENDING" | "ERROR" | "APPROVED" | "DECLINED"
  >("PENDING");

  const router = useRouter();

  useEffect(() => {
    const transactionStatus = getTransaction(params.id);

    transactionStatus.then((data) => {
      setStatus(data);
    });
  }, [params.id]);

  useEffect(() => {
    if (status !== "PENDING") {
      const timer = setTimeout(() => {
        router.push("/transactions");
      }, 4000); // Redirige después de 5 segundos

      return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
    }
  }, [status, router]);

  return (
    <div className=" h-screen flex flex-col items-center justify-center  text-white">
      <h1 className="text-4xl font-bold mb-8">Transaction Status</h1>
      <StatusCircle status={status} />
      <p className="mt-4 text-xl">
        {status === "PENDING" && "Your transaction is being processed."}
        {status === "ERROR" &&
          "There was an error processing your transaction."}
        {status === "APPROVED" && "Your transaction was successful!"}
        {status === "DECLINED" && "Your transaction was declined."}
      </p>
      <p>
        {status !== "PENDING" && (
          <p className="mt-4 text-lg">
            You will be redirected to the transactions page shortly.
          </p>
        )}
      </p>
    </div>
  );
}
