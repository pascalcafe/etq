'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ProductForm } from '@/components/product-form'

export default function CreateProductPage() {
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadTenant = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        // Get or create tenant
        const { data: tenants } = await supabase
          .from('tenants')
          .select('*')
          .eq('user_id', user.id)
          .limit(1)

        if (tenants && tenants.length > 0) {
          setTenantId(tenants[0].id)
        } else {
          // Create default tenant
          const { data: plans } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('slug', 'free')
            .limit(1)

          if (plans && plans.length > 0) {
            const { data: newTenant } = await supabase
              .from('tenants')
              .insert([
                {
                  user_id: user.id,
                  name: 'Minha Empresa',
                  slug: `tenant-${user.id.substring(0, 8)}`,
                  subscription_plan_id: plans[0].id,
                  subscription_status: 'trial',
                  trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
              ])
              .select()

            if (newTenant && newTenant.length > 0) {
              setTenantId(newTenant[0].id)
            }
          }
        }
      } catch (error) {
        console.error('[v0] Error loading tenant:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTenant()
  }, [router])

  if (isLoading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  if (!tenantId) {
    return <div className="text-center py-12 text-destructive">Erro ao carregar tenant</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Criar Novo Produto</h2>
        <p className="text-muted-foreground mt-2">
          Preencha as informações do seu produto alimentício
        </p>
      </div>

      <ProductForm
        tenantId={tenantId}
        onSuccess={() => {
          router.push('/dashboard/products')
        }}
      />
    </div>
  )
}
