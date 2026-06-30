'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const [tenant, setTenant] = useState<any>(null)
  const [plan, setPlan] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [companyName, setCompanyName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!authUser) return

        setUser(authUser)

        // Get tenant
        const { data: tenants } = await supabase
          .from('tenants')
          .select('*')
          .eq('user_id', authUser.id)
          .limit(1)

        if (tenants && tenants.length > 0) {
          setTenant(tenants[0])
          setCompanyName(tenants[0].name)

          // Get plan
          const { data: plans } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('id', tenants[0].subscription_plan_id)
            .limit(1)

          if (plans && plans.length > 0) {
            setPlan(plans[0])
          }
        }
      } catch (error) {
        console.error('[v0] Error loading settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSaveCompanyName = async () => {
    if (!tenant) return

    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const supabase = createClient()
      await supabase
        .from('tenants')
        .update({ name: companyName })
        .eq('id', tenant.id)

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('[v0] Error saving company name:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie as configurações da sua conta
        </p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>
            Dados do seu perfil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground text-sm">Email</Label>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-sm">ID da Conta</Label>
            <p className="font-medium text-xs break-all text-muted-foreground">{user?.id}</p>
          </div>
        </CardContent>
      </Card>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Empresa</CardTitle>
          <CardDescription>
            Configure os detalhes da sua empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nome da Empresa</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Minha Indústria Alimentícia"
            />
          </div>
          <Button onClick={handleSaveCompanyName} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
          {saveSuccess && (
            <div className="flex gap-2 items-center text-sm text-green-800 bg-green-50 p-3 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
              Alterações salvas com sucesso!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Seu Plano</CardTitle>
          <CardDescription>
            Informações sobre sua subscrição
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {plan && (
            <>
              <div>
                <Label className="text-muted-foreground text-sm">Plano Atual</Label>
                <p className="font-bold text-lg">{plan.name}</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">Limite de Produtos</Label>
                <p className="font-medium">{plan.max_products === 999999 ? 'Ilimitado' : plan.max_products}</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">Preço</Label>
                <p className="font-medium">
                  R$ {(plan.price_cents / 100).toFixed(2)}/mês
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">Status</Label>
                <p className="font-medium capitalize">{tenant?.subscription_status}</p>
              </div>

              {tenant?.subscription_status === 'trial' && tenant?.trial_ends_at && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Período de Teste</p>
                    <p>
                      Seu teste termina em{' '}
                      {new Date(tenant.trial_ends_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="pt-4 border-t">
            <Button className="w-full">
              Gerenciar Plano
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Zona de Perigo</CardTitle>
          <CardDescription className="text-red-800">
            Ações irreversíveis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="destructive" className="w-full">
            Deletar Conta
          </Button>
          <p className="text-xs text-red-800">
            Esta ação é irreversível. Todos os seus produtos e dados serão deletados permanentemente.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
