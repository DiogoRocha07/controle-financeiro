const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3333";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = false, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);

  finalHeaders.set("Content-Type", "application/json");

  if (auth) {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error("Token não encontrado");
    }

    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Sessão expirada ou token inválido");
  }

  const contentType = response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.message || "Erro na requisição");
  }

  return data as T;
}
