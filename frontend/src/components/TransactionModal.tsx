"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category } from "@/services/categoryService";
import type { Transaction } from "@/services/transactionService";
import {
  createTransaction,
  updateTransaction,
} from "@/services/transactionService";

type Props = {
  isOpen: boolean;
  mode: "create" | "edit";
  transaction?: Transaction | null;
  onClose: () => void;
  categories: Category[];
  onTransactionCreated: (transaction: Transaction) => void;
  onTransactionUpdated: (transaction: Transaction) => void;
};

type FormState = {
  description: string;
  amount: string;
  type: Transaction["type"];
  categoryId: string;
  date: string;
};

type FieldKey = "description" | "amount" | "type" | "date";

function getTodayISODate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseAmountToNumber(raw: string) {
  const value = raw.trim();
  if (!value) return NaN;

  const cleaned = value
    .replace(/\s/g, "")
    .replace(/^R\$\s?/, "")
    .replace(/[^\d.,-]/g, "");

  const hasComma = cleaned.includes(",");
  const normalized = hasComma
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned;

  return Number(normalized);
}

function dateOnlyToISODateTime(dateOnly: string) {
  const [y, m, d] = dateOnly.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0, 0).toISOString();
}

function formatDateToInput(dateValue: string) {
  const date = new Date(dateValue);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toFormState(transaction: Transaction): FormState {
  return {
    description: transaction.description ?? "",
    amount:
      transaction.amount === null || transaction.amount === undefined
        ? "0"
        : String(transaction.amount),
    type: transaction.type,
    categoryId: transaction.categoryId ?? "",
    date: transaction.date
      ? formatDateToInput(transaction.date)
      : getTodayISODate(),
  };
}

function validateForm(form: FormState): Partial<Record<FieldKey, string>> {
  const errors: Partial<Record<FieldKey, string>> = {};

  if (!form.description.trim()) {
    errors.description = "Descrição é obrigatória.";
  }

  if (!form.amount.trim()) {
    errors.amount = "Valor é obrigatório.";
  } else {
    const n = parseAmountToNumber(form.amount);
    if (!Number.isFinite(n) || n <= 0) {
      errors.amount = "Informe um valor maior que zero.";
    }
  }

  if (!form.type) {
    errors.type = "Selecione o tipo.";
  }

  if (!form.date.trim()) {
    errors.date = "Data é obrigatória.";
  }

  return errors;
}

function fieldInputClass(invalid: boolean) {
  return [
    "mt-2 w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:ring-2",
    invalid
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-slate-300 focus:ring-slate-200",
  ].join(" ");
}

export default function NewTransactionModal({
  isOpen,
  mode,
  transaction,
  onClose,
  categories,
  onTransactionCreated,
  onTransactionUpdated,
}: Props) {
  const initialState = useMemo<FormState>(
    () => ({
      description: "",
      amount: "",
      type: "EXPENSE",
      categoryId: "",
      date: getTodayISODate(),
    }),
    [],
  );

  const [form, setForm] = useState<FormState>(initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && transaction) {
      setForm(toFormState(transaction));
    } else {
      setForm(initialState);
    }

    setSubmitError("");
    setIsSaving(false);
    setSubmitAttempted(false);
    setShowSuccess(false);
  }, [initialState, isOpen, mode, transaction]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isSaving && !showSuccess) onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isSaving, onClose, showSuccess]);

  useEffect(() => {
    if (!showSuccess) return;
    const t = window.setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 900);
    return () => window.clearTimeout(t);
  }, [showSuccess, onClose]);

  if (!isOpen) return null;

  const fieldErrors = submitAttempted ? validateForm(form) : {};
  const parsedAmount = parseAmountToNumber(form.amount);

  const isEditMode = mode === "edit";

  const modalTitle = isEditMode ? "Editar Transação" : "Nova Transação";
  const modalDescription = isEditMode
    ? "Atualize os campos abaixo para editar a transação."
    : "Preencha os campos abaixo para registrar uma transação.";
  const submitButtonLabel = isSaving
    ? "Salvando..."
    : isEditMode
      ? "Salvar alterações"
      : "Salvar";
  const successMessage = isEditMode
    ? "Transação atualizada com sucesso."
    : "Transação criada com sucesso.";
  const genericErrorMessage = isEditMode
    ? "Não foi possível atualizar a transação."
    : "Não foi possível salvar a transação.";

  function updateForm(partial: Partial<FormState>) {
    setForm((s) => ({ ...s, ...partial }));
    setSubmitError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSaving || showSuccess) return;

    setSubmitAttempted(true);
    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return;

    setIsSaving(true);
    setSubmitError("");

    try {
      const payload = {
        description: form.description.trim(),
        amount: parsedAmount,
        type: form.type,
        categoryId: form.categoryId ? form.categoryId : undefined,
        date: dateOnlyToISODateTime(form.date),
      };

      if (isEditMode) {
        if (!transaction) {
          throw new Error("Transação não encontrada para edição.");
        }

        const updated = await updateTransaction(transaction.id, payload);
        onTransactionUpdated(updated);
      } else {
        const created = await createTransaction(payload);
        onTransactionCreated(created);
        setForm(initialState);
      }

      setSubmitAttempted(false);
      setShowSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : genericErrorMessage);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSaving && !showSuccess) {
          onClose();
        }
      }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              {modalTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{modalDescription}</p>
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50"
            onClick={onClose}
            disabled={isSaving || showSuccess}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {showSuccess && (
          <p
            className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800"
            role="status"
          >
            {successMessage}
          </p>
        )}

        {submitError && !showSuccess && (
          <p
            className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            role="alert"
          >
            {submitError}
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="nt-description"
              className="text-sm font-medium text-slate-700"
            >
              Descrição
            </label>
            <input
              id="nt-description"
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
              className={fieldInputClass(Boolean(fieldErrors.description))}
              placeholder="Ex.: Salário, Mercado, Aluguel..."
              autoFocus
              aria-invalid={Boolean(fieldErrors.description)}
              aria-describedby={
                fieldErrors.description ? "nt-description-error" : undefined
              }
            />
            {fieldErrors.description && (
              <p
                id="nt-description-error"
                className="mt-1.5 text-sm text-red-600"
                role="alert"
              >
                {fieldErrors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="nt-amount"
                className="text-sm font-medium text-slate-700"
              >
                Valor
              </label>
              <input
                id="nt-amount"
                value={form.amount}
                onChange={(e) => updateForm({ amount: e.target.value })}
                className={fieldInputClass(Boolean(fieldErrors.amount))}
                placeholder="0,00"
                inputMode="decimal"
                aria-invalid={Boolean(fieldErrors.amount)}
                aria-describedby={
                  fieldErrors.amount ? "nt-amount-error" : undefined
                }
              />
              {fieldErrors.amount && (
                <p
                  id="nt-amount-error"
                  className="mt-1.5 text-sm text-red-600"
                  role="alert"
                >
                  {fieldErrors.amount}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="nt-type"
                className="text-sm font-medium text-slate-700"
              >
                Tipo
              </label>
              <select
                id="nt-type"
                value={form.type}
                onChange={(e) =>
                  updateForm({
                    type: e.target.value as Transaction["type"],
                  })
                }
                className={fieldInputClass(Boolean(fieldErrors.type))}
                aria-invalid={Boolean(fieldErrors.type)}
                aria-describedby={
                  fieldErrors.type ? "nt-type-error" : undefined
                }
              >
                <option value="INCOME">Entrada</option>
                <option value="EXPENSE">Saída</option>
              </select>
              {fieldErrors.type && (
                <p
                  id="nt-type-error"
                  className="mt-1.5 text-sm text-red-600"
                  role="alert"
                >
                  {fieldErrors.type}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="nt-category"
                className="text-sm font-medium text-slate-700"
              >
                Categoria
              </label>
              <select
                id="nt-category"
                value={form.categoryId}
                onChange={(e) => updateForm({ categoryId: e.target.value })}
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Sem categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="nt-date"
                className="text-sm font-medium text-slate-700"
              >
                Data
              </label>
              <input
                id="nt-date"
                type="date"
                value={form.date}
                onChange={(e) => updateForm({ date: e.target.value })}
                className={fieldInputClass(Boolean(fieldErrors.date))}
                aria-invalid={Boolean(fieldErrors.date)}
                aria-describedby={
                  fieldErrors.date ? "nt-date-error" : undefined
                }
              />
              {fieldErrors.date && (
                <p
                  id="nt-date-error"
                  className="mt-1.5 text-sm text-red-600"
                  role="alert"
                >
                  {fieldErrors.date}
                </p>
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50"
              onClick={onClose}
              disabled={isSaving || showSuccess}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving || showSuccess}
            >
              {submitButtonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
