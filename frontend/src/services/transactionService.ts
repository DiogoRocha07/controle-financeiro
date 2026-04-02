import { apiFetch } from "./api";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId?: string;
  date: string;
};

export async function getTransactions(): Promise<Transaction[]> {
  return apiFetch<Transaction[]>("/transactions", {
    method: "GET",
    auth: true,
  });
}
