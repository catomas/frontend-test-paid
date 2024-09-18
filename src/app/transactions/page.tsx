import { TableTransactions } from "@/components/TableTransactions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function TransactionsPage() {
  return (
    <div className="pt-32 py-8 flex justify-center">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle className=" flex justify-between text-2xl font-bold">
            Transaction History
            <Link href="/">
              <Button className=" text-lg">Back to Home</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableTransactions />
        </CardContent>
      </Card>
    </div>
  );
}
