'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Package, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const [tenant, setTenant] = useState<any>(null)
  const [stats, setStats] = useState({
    totalProducts: 0,
    labels: 0,
    usage: 0,
    maxProducts: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        // Get tenant
        const { data: tenants } = await supabase
          .from('tenants')
          .select('*')
          .eq('user_id', user.id)
          .limit(1)

        if (tenants && tenants.length > 0) {
          const currentTenant = tenants[0]
          setTenant(currentTenant)

          // Get stats
          const { data: products, count } = await supabase
            .from('products')
            .select('*', { count: 'exact' })
            .eq('tenant_id', currentTenant.id)

          const { data: plans } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('id', currentTenant.subscription_plan_id)

          setStats({
            totalProducts: count || 0,
            labels: products?.length || 0,
            usage: ((count || 0) / (plans?.[0]?.max_products || 5)) * 100,
            maxProducts: plans?.[0]?.max_products || 5,
          })
        }
      } catch (error) {
        console.error('[v0] Error loading dashboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bem-vindo!</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie seus produtos e etiquetas alimentícias
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Produtos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              de {stats.maxProducts} produtos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Etiquetas Geradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.labels}</div>
            <p className="text-xs text-muted-foreground mt-1">neste mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Uso do Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(stats.usage)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalProducts} de {stats.maxProducts}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Create Product */}
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Novo Produto
            </CardTitle>
            <CardDescription>
              Cadastre um novo produto e gere sua etiqueta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/products/create">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Criar Produto
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Plan Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Seu Plano
            </CardTitle>
            <CardDescription>
              {tenant?.subscription_plan_id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.usage >= 100 && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
                  Você atingiu o limite de produtos do seu plano
                </div>
              )}
              {stats.usage >= 80 && stats.usage < 100 && (
                <div className="bg-yellow-500/10 text-yellow-700 p-3 rounded-lg text-sm">
                  Você está próximo do limite de produtos
                </div>
              )}
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full">
                  Gerenciar Plano
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Recentes</CardTitle>
          <CardDescription>
            Seus últimos produtos cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum produto cadastrado ainda</p>
            <Link href="/dashboard/products/create">
              <Button variant="link" className="mt-2">
                Criar seu primeiro produto →
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
