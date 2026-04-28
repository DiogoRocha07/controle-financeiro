"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import {
  deleteTransaction,
  getTransactions,
  Transaction,
  TransactionFilters,
} from "@/services/transactionService";
import {
  Category,
  deleteCategory,
  getCategories,
} from "@/services/categoryService";
import { logout } from "@/services/authService";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/userService";
import NewTransactionModal from "@/components/TransactionModal";
import CategoryModal from "@/components/CategoryModal";
import CategoryManagementModal from "@/components/CategoryManagementModal";

export default function Dashboard() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>(
    {},
  );
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<TransactionFilters>({
    type: undefined,
    categoryId: undefined,
    startDate: "",
    endDate: "",
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionModalMode, setTransactionModalMode] = useState<
    "create" | "edit"
  >("create");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [openTransactionMenuId, setOpenTransactionMenuId] = useState<
    string | null
  >(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<"create" | "edit">(
    "create",
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isCategoryManagementOpen, setIsCategoryManagementOpen] =
    useState(false);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("pt-BR");
  };

  const summary = transactions.reduce(
    (acc, t) => {
      if (t.type === "INCOME") acc.income += t.amount;
      if (t.type === "EXPENSE") acc.expense += t.amount;
      return acc;
    },
    { income: 0, expense: 0 },
  );
  const balance = summary.income - summary.expense;

  useEffect(() => {
    async function validateSession() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        await getMe();

        const [transactionsData, categoriesData] = await Promise.all([
          getTransactions(),
          getCategories(),
        ]);

        setTransactions(transactionsData);
        setCategories(categoriesData);

        const categoriesObject = categoriesData.reduce<Record<string, string>>(
          (acc, category) => {
            acc[category.id] = category.name;
            return acc;
          },
          {},
        );

        setCategoriesMap(categoriesObject);
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
    router.replace("/login");
  }

  function openNewTransactionModal() {
    setTransactionModalMode("create");
    setSelectedTransaction(null);
    setIsTransactionModalOpen(true);
  }

  function openEditTransactionModal(transaction: Transaction) {
    setOpenTransactionMenuId(null);
    setTransactionModalMode("edit");
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  }

  function closeTransactionModal() {
    setIsTransactionModalOpen(false);
    setSelectedTransaction(null);
    setTransactionModalMode("create");
  }

  function openCategoryManagementModal() {
    setIsCategoryManagementOpen(true);
  }

  function closeCategoryManagementModal() {
    setIsCategoryManagementOpen(false);
  }

  function openCreateCategoryModal() {
    setIsCategoryManagementOpen(false)
    setCategoryModalMode("create");
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  }

  function openEditCategoryModal(category: Category) {
    if (category.isSystem) return;

    setIsCategoryManagementOpen(false);
    setCategoryModalMode("edit");
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  }

  function closeCategoryModal() {
    setIsCategoryModalOpen(false);
    setSelectedCategory(null);
    setCategoryModalMode("create");
  }

  function handleTransactionCreated(created: Transaction) {
    setTransactions((prev) => [created, ...prev]);
  }

  function handleTransactionUpdated(updated: Transaction) {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === updated.id ? updated : transaction,
      ),
    );
  }

  function handleCategoryCreated(created: Category) {
    setCategories((prev) => [...prev, created]);
    setCategoriesMap((prev) => ({ ...prev, [created.id]: created.name }));
  }

  function handleCategoryUpdated(updated: Category) {
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
    setCategoriesMap((prev) => ({ ...prev, [updated.id]: updated.name }));
  }

  async function handleDeleteTransaction(id: string) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta transação?",
    );
    if (!confirmed) return;

    await deleteTransaction(id);
    setOpenTransactionMenuId(null);
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id),
    );
  }

  async function handleDeleteCategory(category: Category) {
    const message = category.isSystem
      ? "Tem certeza que deseja ocultar esta categoria do sistema?"
      : "Tem certeza que deseja excluir esta categoria?";

    const confirmed = window.confirm(message);
    if (!confirmed) return;

    try {
      await deleteCategory(category.id);

      setCategories((prev) => prev.filter((item) => item.id !== category.id));
      setCategoriesMap((prev) => {
        const copy: Record<string, string> = { ...prev };
        delete copy[category.id];
        return copy;
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao remover categoria.");
      }
    }
  }

  async function handleApplyFilters() {
    setIsFiltering(true);
    setError("");

    try {
      const filteredTransactions = await getTransactions({
        type: filters.type || undefined,
        categoryId: filters.categoryId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      });

      setTransactions(filteredTransactions);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao aplicar filtros.");
      }
    } finally {
      setIsFiltering(false);
    }
  }

  async function handleClearFilters() {
    const emptyFilters: TransactionFilters = {
      type: undefined,
      categoryId: undefined,
      startDate: "",
      endDate: "",
    };

    setFilters(emptyFilters);
    setIsFiltering(true);
    setError("");

    try {
      const allTransactions = await getTransactions();
      setTransactions(allTransactions);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao limpar filtros.");
      }
    } finally {
      setIsFiltering(false);
    }
  }

  const activeFiltersCount = [
    filters.type,
    filters.categoryId,
    filters.startDate,
    filters.endDate,
  ].filter(Boolean).length;

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

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Área protegida do sistema de controle financeiro.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              onClick={openCategoryManagementModal}
            >
              Gerenciar Categorias
            </button>

            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2"
              onClick={openNewTransactionModal}
            >
              Nova Transação
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <section className="mt-10">
          <h2 className="text-sm font-medium text-slate-700">
            Resumo financeiro
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Entradas
                </p>
                <span className="inline-flex rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                  INCOME
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                {formatCurrency(summary.income)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Saídas
                </p>
                <span className="inline-flex rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                  EXPENSE
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                {formatCurrency(summary.expense)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Saldo
                </p>
                <span
                  className={
                    balance >= 0
                      ? "inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                      : "inline-flex rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800"
                  }
                >
                  {balance >= 0 ? "Positivo" : "Negativo"}
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-medium text-slate-700">Filtros</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {activeFiltersCount > 0
                    ? `${activeFiltersCount} filtro(s) ativo(s)`
                    : "Nenhum filtro ativo"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsFiltersOpen((s) => !s)}
                className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                {isFiltersOpen ? "Ocultar" : "Mostrar filtros"}
              </button>
            </div>

            {isFiltersOpen && (
              <>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-slate-700">
                      Tipo
                    </span>
                    <select
                      value={filters.type ?? ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          type: e.target.value
                            ? (e.target.value as Transaction["type"])
                            : undefined,
                        }))
                      }
                      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                    >
                      <option value="">Todos os tipos</option>
                      <option value="INCOME">Entrada</option>
                      <option value="EXPENSE">Saída</option>
                    </select>
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-slate-700">
                      Categoria
                    </span>
                    <select
                      value={filters.categoryId ?? ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          categoryId: e.target.value || undefined,
                        }))
                      }
                      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                    >
                      <option value="">Todas as categorias</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-slate-700">
                      Data inicial
                    </span>
                    <input
                      type="date"
                      value={filters.startDate ?? ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-slate-700">
                      Data final
                    </span>
                    <input
                      type="date"
                      value={filters.endDate ?? ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                    />
                  </label>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    disabled={isFiltering}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2"
                  >
                    {isFiltering ? "Aplicando..." : "Aplicar filtros"}
                  </button>

                  <button
                    type="button"
                    onClick={handleClearFilters}
                    disabled={isFiltering}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                  >
                    Limpar filtros
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Transações
            </h2>
            <p className="text-sm text-slate-500">
              {transactions.length} item(ns)
            </p>
          </div>

          {transactions.length === 0 ? (
            <p className="mt-4 text-slate-600">Nenhuma transação encontrada.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold leading-6 text-slate-900">
                        {transaction.description}
                      </h3>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                        <span
                          className={
                            transaction.type === "INCOME"
                              ? "inline-flex items-center rounded-md bg-green-50 px-2 py-1 font-medium text-green-700"
                              : "inline-flex items-center rounded-md bg-red-50 px-2 py-1 font-medium text-red-700"
                          }
                        >
                          {transaction.type === "INCOME" ? "Entrada" : "Saída"}
                        </span>

                        <span className="text-slate-300">•</span>

                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700">
                          {formatDate(transaction.date)}
                        </span>

                        <span className="text-slate-300">•</span>

                        <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-1 font-medium text-slate-700">
                          {transaction.categoryId
                            ? categoriesMap[transaction.categoryId] ||
                              "Categoria não encontrada"
                            : "Sem categoria"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span
                        className={
                          transaction.type === "INCOME"
                            ? "whitespace-nowrap text-base font-semibold text-green-700"
                            : "whitespace-nowrap text-base font-semibold text-red-700"
                        }
                      >
                        {formatCurrency(transaction.amount)}
                      </span>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenTransactionMenuId((prev) =>
                              prev === transaction.id ? null : transaction.id,
                            )
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-base font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                          aria-label={`Ações da transação ${transaction.description}`}
                        >
                          ⋯
                        </button>

                        {openTransactionMenuId === transaction.id && (
                          <div className="absolute right-0 top-10 z-10 min-w-36 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
                            <button
                              type="button"
                              onClick={() => openEditTransactionModal(transaction)}
                              className="flex w-full items-center px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteTransaction(transaction.id)
                              }
                              className="flex w-full items-center px-3 py-2 text-left text-sm text-red-700 transition-colors hover:bg-red-50"
                            >
                              Excluir
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      
      <NewTransactionModal
        isOpen={isTransactionModalOpen}
        mode={transactionModalMode}
        transaction={selectedTransaction}
        onClose={closeTransactionModal}
        categories={categories}
        onTransactionCreated={handleTransactionCreated}
        onTransactionUpdated={handleTransactionUpdated}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        mode={categoryModalMode}
        category={selectedCategory}
        onClose={closeCategoryModal}
        onCategoryCreated={handleCategoryCreated}
        onCategoryUpdated={handleCategoryUpdated}
      />

      <CategoryManagementModal
        isOpen={isCategoryManagementOpen}
        categories={categories}
        onClose={closeCategoryManagementModal}
        onCreate={openCreateCategoryModal}
        onEdit={openEditCategoryModal}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}
