'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, Layers, Lock, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">EL</span>
              </div>
              <span className="font-bold text-lg">EtiqueLabel</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Começar Grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Etiquetas Alimentícias
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              em Conformidade ANVISA
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A plataforma SaaS completa para gerar etiquetas alimentícias profissionais, 
            automáticas e em conformidade total com as regulamentações brasileiras.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="h-12 px-8 text-base">
                Começar Grátis
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Recursos Poderosos</h2>
          <p className="text-lg text-muted-foreground">
            Tudo que você precisa para gerar etiquetas profissionais em minutos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Editor Visual</h3>
            <p className="text-sm text-muted-foreground">
              Arraste e solte elementos para criar etiquetas personalizadas
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Validação ANVISA</h3>
            <p className="text-sm text-muted-foreground">
              Conformidade automática com RDC 429/2020 e regulamentações vigentes
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Selos Automáticos</h3>
            <p className="text-sm text-muted-foreground">
              Gera avisos de frontal automaticamente baseado em nutrientes
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Dados Seguros</h3>
            <p className="text-sm text-muted-foreground">
              Seus produtos protegidos com encriptação de ponta a ponta
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Preços Simples</h2>
          <p className="text-lg text-muted-foreground">
            Comece grátis, escale conforme seu negócio cresce
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="rounded-lg border bg-card p-8">
            <h3 className="text-2xl font-bold mb-2">Gratuito</h3>
            <p className="text-muted-foreground mb-6">Perfeito para começar</p>
            <div className="text-4xl font-bold mb-6">
              R$ 0<span className="text-lg text-muted-foreground">/mês</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Até 5 produtos</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Editor visual básico</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Validação ANVISA</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Exportar em PDF</span>
              </li>
            </ul>
            <Link href="/auth/sign-up" className="w-full">
              <Button variant="outline" className="w-full">
                Começar Grátis
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="rounded-lg border bg-card p-8 ring-2 ring-primary">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-2xl font-bold">Profissional</h3>
              <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                Popular
              </span>
            </div>
            <p className="text-muted-foreground mb-6">Para pequenas e médias empresas</p>
            <div className="text-4xl font-bold mb-6">
              R$ 49<span className="text-lg text-muted-foreground">/mês</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Produtos ilimitados</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Editor visual avançado</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Selos automáticos</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Histórico de produtos</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Suporte prioritário</span>
              </li>
            </ul>
            <Link href="/auth/sign-up" className="w-full">
              <Button className="w-full">
                Começar Teste Grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-lg bg-primary/5 border border-primary/20 px-8 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Crie sua primeira etiqueta em menos de 5 minutos, sem cartão de crédito
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="h-12 px-8 text-base">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">EL</span>
              </div>
              <span className="font-bold">EtiqueLabel</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2026 EtiqueLabel. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
