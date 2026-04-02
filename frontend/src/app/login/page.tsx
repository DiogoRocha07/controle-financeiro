import Link from "next/link";
import {LoginForm} from "./LoginForm";
import Button from "@/components/Button";

export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold text-black">Entrar</h3>
          <p className="text-sm text-gray-500">
            Digite seu email e senha para continuar
          </p>
        </div>
        <LoginForm>
          <Button><p className="text-black font-bold">Entrar</p></Button>
          <p className="text-center text-sm text-gray-600">
            {"Não tem uma conta? "}
            <Link href="/register" className="font-semibold text-gray-800">
              Criar conta
            </Link>
          </p>
        </LoginForm>
      </div>
    </div>
  );
}
