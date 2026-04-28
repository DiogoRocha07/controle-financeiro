import { apiFetch } from "./api";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId?: string;
  date: string;
};

export type TransactionFilters = {
  type?: Transaction["type"];
  categoryId?: string;
  startDate?: string;
  endDate?: string;
};

export type NewTransactionInput = {
  description: string;
  amount: number;
  type: Transaction["type"];
  categoryId?: string;
  date: string;
};

export type SaveTransactionDTO = {
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId?: string;
  date: string;
};

export async function getTransactions(
  filters?: TransactionFilters,
): Promise<Transaction[]> {
  const params = new URLSearchParams();

  if (filters?.type) {
    params.set("type", filters.type);
  }

  if (filters?.categoryId) {
    params.set("categoryId", filters.categoryId);
  }

  if (filters?.startDate) {
    params.set("startDate", filters.startDate);
  }

  if (filters?.endDate) {
    params.set("endDate", filters.endDate);
  }

  const query = params.toString();
  const path = query ? `/transactions?${query}` : "/transactions";

  return apiFetch<Transaction[]>(path, {
    method: "GET",
    auth: true,
  });
}

export async function createTransaction(
  data: NewTransactionInput,
): Promise<Transaction> {
  return apiFetch<Transaction>("/transactions", {
    method: "POST",
    auth: true,
    body: JSON.stringify(data),
  });
}

// Mantido por compatibilidade com o nome antigo (caso seja usado no futuro)
export async function registerTransaction(
  data: NewTransactionInput,
): Promise<Transaction> {
  return createTransaction(data);
}

export async function updateTransaction(id: string, data: SaveTransactionDTO): Promise<Transaction> {
  return apiFetch<Transaction>(`/transactions/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(data),
  });
}

export async function deleteTransaction(id: string): Promise<void> {
  return apiFetch<void>(`/transactions/${id}`, {
    method: "DELETE",
    auth: true,
  });
}