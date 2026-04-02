const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3333";

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao fazer login");
  }

  const data = await response.json();

  return data;
}

export async function register(
  username: string,
  email: string,
  password: string,
) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (!response.ok) throw new Error("Erro ao registrar usuário");

  const data = await response.json();

  return data;
}

export function logout() {
  return localStorage.removeItem("token");
}
