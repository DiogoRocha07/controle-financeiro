"use client";

import { useState } from "react";
import type { Category } from "@/services/categoryService";

type Props = {
  isOpen: boolean;
  categories: Category[];
  onClose: () => void;
  onCreate: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

export default function CategoryManagementModal({
  isOpen,
  categories,
  onClose,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  const [openMenuForId, setOpenMenuForId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Gerenciar Categorias
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Use a lista abaixo para manter suas categorias organizadas.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            {categories.length} categoria(s)
          </p>

          <button
            type="button"
            onClick={onCreate}
            className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2"
          >
            Nova categoria
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          {categories.length === 0 ? (
            <div className="bg-white p-4">
              <p className="text-sm text-slate-600">
                Nenhuma categoria encontrada.
              </p>
            </div>
          ) : (
            <div className="bg-white">
              <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-slate-200 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                <span>Categoria</span>
                <span className="pr-2">Ações</span>
              </div>
              <ul className="divide-y divide-slate-200">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-2.5"
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {category.name}
                    </p>
                    <span
                      className={
                        category.isSystem
                          ? "inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                          : "inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700"
                      }
                    >
                      {category.isSystem ? "Sistema" : "Personalizada"}
                    </span>
                  </div>

                  <div className="relative justify-self-end">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuForId((prev) =>
                          prev === category.id ? null : category.id,
                        )
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-base font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                      aria-label={`Ações da categoria ${category.name}`}
                    >
                      ⋯
                    </button>

                    {openMenuForId === category.id && (
                      <div className="absolute right-0 top-9 z-10 min-w-36 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
                        {!category.isSystem && (
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuForId(null);
                              onEdit(category);
                            }}
                            className="flex w-full items-center px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            Editar
                          </button>
                        )}

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuForId(null);
                          onDelete(category);
                        }}
                        className={
                          category.isSystem
                            ? "flex w-full items-center px-3 py-2 text-left text-sm text-amber-800 transition-colors hover:bg-amber-50"
                            : "flex w-full items-center px-3 py-2 text-left text-sm text-red-700 transition-colors hover:bg-red-50"
                        }
                      >
                        {category.isSystem ? "Ocultar" : "Excluir"}
                      </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

