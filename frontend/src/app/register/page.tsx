import Button from "@/components/Button";
import { RegisterForm } from "./RegisterForm";
import Link from "next/link";

export default function () {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold text-black">Crie sua conta</h3>
          <p className="text-sm text-gray-500">
            Cadastre-se para ver seu dinheiro com clareza
          </p>
        </div>
        <RegisterForm>
          <Button>
            <p className="text-black font-bold">Criar conta</p>
          </Button>
          <p className="text-center text-sm text-gray-600">
            {"Já possui uma conta? "}
            <Link href="/login" className="font-semibold text-gray-800">
              Entrar
            </Link>
          </p>
        </RegisterForm>
      </div>
    </div>
  );
}
