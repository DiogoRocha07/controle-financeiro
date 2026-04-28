"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category } from "@/services/categoryService";
import { createCategory, updateCategory } from "@/services/categoryService";

export type CategoryModalProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  category?: Category | null;
  onClose: () => void;
  onCategoryCreated: (category: Category) => void;
  onCategoryUpdated: (category: Category) => void;
};

type FormState = {
  name: string;
};

type FieldKey = "name";

function fieldInputClass(invalid: boolean) {
  return [
    "mt-2 w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:ring-2",
    invalid
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-slate-300 focus:ring-slate-200",
  ].join(" ");
}

function validateForm(form: FormState): Partial<Record<FieldKey, string>> {
  const errors: Partial<Record<FieldKey, string>> = {};
  if (!form.name.trim()) errors.name = "Nome é obrigatório.";
  return errors;
}

function toFormState(category: Category): FormState {
  return { name: category.name ?? "" };
}

export default function CategoryModal({
  isOpen,
  mode,
  category,
  onClose,
  onCategoryCreated,
  onCategoryUpdated,
}: CategoryModalProps) {
  const initialState = useMemo<FormState>(() => ({ name: "" }), []);

  const [form, setForm] = useState<FormState>(initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isEditMode = mode === "edit";
  const isSystemCategory = Boolean(isEditMode && category?.isSystem);

  const modalTitle = isEditMode ? "Editar categoria" : "Nova categoria";
  const modalDescription = isEditMode
    ? "Atualize o nome da categoria."
    : "Preencha o nome da categoria.";
  const submitButtonLabel = isSaving
    ? "Salvando..."
    : isEditMode
      ? "Salvar alterações"
      : "Salvar";
  const successMessage = isEditMode
    ? "Categoria atualizada com sucesso."
    : "Categoria criada com sucesso.";
  const genericErrorMessage = isEditMode
    ? "Não foi possível atualizar a categoria."
    : "Não foi possível criar a categoria.";

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && category) setForm(toFormState(category));
    else setForm(initialState);

    setSubmitError("");
    setIsSaving(false);
    setSubmitAttempted(false);
    setShowSuccess(false);
  }, [category, initialState, isEditMode, isOpen]);

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

  function updateForm(partial: Partial<FormState>) {
    setForm((s) => ({ ...s, ...partial }));
    setSubmitError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSaving || showSuccess) return;
    if (isSystemCategory) return;

    setSubmitAttempted(true);
    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) return;

    const trimmedName = form.name.trim();

    setIsSaving(true);
    setSubmitError("");

    try {
      if (isEditMode) {
        if (!category) throw new Error("Categoria não encontrada para edição.");

        // O backend pode retornar apenas uma mensagem; por isso atualizamos localmente.
        await updateCategory(category.id, { name: trimmedName });
        const updatedCategory: Category = { ...category, name: trimmedName };
        onCategoryUpdated(updatedCategory);
      } else {
        const created = await createCategory({ name: trimmedName });
        onCategoryCreated(created);
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
        if (e.target === e.currentTarget && !isSaving && !showSuccess) onClose();
      }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
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

        {isSystemCategory && (
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Categorias do sistema não podem ser editadas.
          </p>
        )}

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
              htmlFor="cat-name"
              className="text-sm font-medium text-slate-700"
            >
              Nome
            </label>
            <input
              id="cat-name"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              className={fieldInputClass(Boolean(fieldErrors.name))}
              placeholder="Ex.: Alimentação, Transporte..."
              autoFocus
              disabled={isSaving || showSuccess || isSystemCategory}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "cat-name-error" : undefined}
            />
            {fieldErrors.name && (
              <p
                id="cat-name-error"
                className="mt-1.5 text-sm text-red-600"
                role="alert"
              >
                {fieldErrors.name}
              </p>
            )}
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
              disabled={isSaving || showSuccess || isSystemCategory}
            >
              {submitButtonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

