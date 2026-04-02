import Link from 'next/link'
import Header from '@/components/Header'

export default function Home() {
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
          { label: 'Sobre', href: '#sobre', variant: 'link' },
          { label: 'Contato', href: '#contato', variant: 'link' },
          { label: 'Entrar', href: '/login', variant: 'button', tone: 'secondary' },
          { label: 'Criar conta', href: '/register', variant: 'button', tone: 'primary' },
        ]}
        className="border-b border-slate-200/70 bg-white/70 backdrop-blur"
      />

      <main className="mx-auto w-full max-w-6xl px-6">
        <section className="relative py-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-linear-to-br from-indigo-200/50 to-emerald-200/40 blur-3xl" />
            <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-linear-to-br from-sky-200/40 to-transparent blur-3xl" />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <p className="mx-auto inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              Controle financeiro, sem complicação
            </p>

            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              Controle seu dinheiro com clareza
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
              Registre receitas e despesas, acompanhe seus gastos e mantenha uma
              visão organizada do seu saldo — tudo de forma simples e rápida.
            </p>

            <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex h-11 w-full items-center justify-center rounded-md bg-slate-900 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:w-auto"
              >
                Criar conta
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 w-full items-center justify-center rounded-md border border-slate-200 bg-transparent px-5 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 sm:w-auto"
              >
                Entrar
              </Link>
            </div>

            <p className="mt-5 text-xs text-slate-500">
              Foque no essencial: clareza, simplicidade e controle.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">Dashboard (exemplo)</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">Resumo do mês</p>
                </div>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                  Atualizado hoje
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-600">Saldo</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">R$ 2.500</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-600">Receitas</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-700">R$ 4.000</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-600">Despesas</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-rose-700">R$ 1.500</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre" className="py-12 sm:py-14">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col gap-2">
              <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Benefícios que ajudam no dia a dia
              </h2>
              <p className="max-w-2xl text-pretty text-sm text-slate-600 sm:text-base">
                Um painel simples para você entender para onde seu dinheiro vai
                e tomar decisões melhores.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-2xl">✅</div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  Controle total das finanças
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Registre entradas e saídas em segundos e mantenha tudo organizado no mesmo lugar.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-2xl">📊</div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  Visualização clara dos gastos
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Veja rapidamente quanto você gastou e identifique os maiores impactos no seu mês.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-2xl">⚡</div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  Interface simples e rápida
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Menos passos para lançar movimentações e mais tempo para tomar decisões com calma.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer id="contato" className="border-t border-slate-200 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center text-sm text-slate-600 sm:flex-row sm:text-left">
            <p>© {new Date().getFullYear()} Controle Financeiro</p>
            <div className="flex items-center gap-3">
              <Link href="#sobre" className="hover:text-slate-900">
                Sobre
              </Link>
              <Link href="#contato" className="hover:text-slate-900">
                Contato
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
