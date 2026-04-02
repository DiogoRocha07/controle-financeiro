"use client";

import { login } from "@/services/authService";
import { useRouter } from "next/navigation";

export function LoginForm({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const data = await login(email, password);

      // Salvar o token no localStorage
      localStorage.setItem("token", data.access_token);
      router.push('/dashboard')
    } catch(error){
      console.log(error)
      alert("Erro ao fazer login")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
    >
      <div>
        <label htmlFor="email" className="block text-xs text-black uppercase">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Digite seu endereço de email"
          autoComplete="email"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 text-black shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-xs text-gray-600 uppercase"
        >
          Senha
        </label>
        <input
          type="password"
          name="password"
          placeholder="Digite sua senha"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 text-black shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      {children}
    </form>
  );
}
