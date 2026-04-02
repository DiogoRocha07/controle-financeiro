"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { getTransactions, Transaction } from "@/services/transactionService";
import { logout } from "@/services/authService";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/userService";

export default function Dashboard() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function validateSession() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        await getMe();

        const transactionsData = await getTransactions();
        setTransactions(transactionsData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Erro ao carregar dashboard");
        }
      } finally {
        setIsCheckingAuth(false);
      }
    }

    validateSession();
  }, [router]);

  function handleLogout() {
    logout();
    router.replace("/");
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <p className="text-sm text-slate-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        brand={
          <>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-base">
              $
            </span>
            <span>Controle Financeiro</span>
          </>
        }
        items={[
          {
            label: "Logout",
            onClick: handleLogout,
            variant: "button",
            tone: "secondary",
          },
        ]}
        className="border-b border-slate-200/70 bg-white/70 backdrop-blur"
      />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Área protegida do sistema de controle financeiro.
        </p>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">Transações</h2>

          {transactions.length === 0 ? (
            <p className="mt-4 text-slate-600">Nenhuma transação encontrada.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-slate-900">
                      {transaction.description}
                    </h3>

                    <span
                      className={
                        transaction.type === "INCOME"
                          ? "font-semibold text-green-600"
                          : "font-semibold text-red-600"
                      }
                    >
                      R$ {transaction.amount}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-slate-500">
                    <p>Tipo: {transaction.type}</p>
                    <p>Data: {transaction.date}</p>
                    <p>
                      Categoria: {transaction.categoryId || "Sem categoria"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
