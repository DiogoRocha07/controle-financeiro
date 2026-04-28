import { apiFetch } from "./api";

export type Category = {
  id: string;
  name: string;
  isSystem: boolean;
  userId?: string | null;
};

export type CreateCategoryInput = {
  name: string;
};

export type UpdateCategoryInput = {
  name: string;
};

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories", {
    method: "GET",
    auth: true,
  });
}

export async function createCategory(
  data: CreateCategoryInput,
): Promise<Category> {
  return apiFetch<Category>("/categories", {
    method: "POST",
    auth: true,
    body: JSON.stringify(data),
  });
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryInput,
): Promise<Category> {
  return apiFetch<Category>(`/categories/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  return apiFetch<void>(`/categories/${id}`, {
    method: "DELETE",
    auth: true,
  });
}