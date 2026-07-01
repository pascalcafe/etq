'use client'

import { useState } from 'react'
import { ProductUploader } from '@/components/product-uploader'
import { ItemsUploader } from '@/components/items-uploader'
import { TemplatesGallery } from '@/components/templates-gallery'
import { CustomSizesManager } from '@/components/custom-sizes-manager'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTenant } from '@/hooks/use-tenant'
import { useRouter } from 'next/navigation'

export default function ProductsManagePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('upload')
  const { tenantId, loading, error } = useTenant()

  if (loading) {
    return (
      <div className="p-8">
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </Card>
      </div>
    )
  }

  if (error || !tenantId) {
    return (
      <div className="p-8">
        <Card className="p-6 text-center">
          <p className="text-destructive">{error || 'Erro ao carregar tenant'}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Produtos e Etiquetas</h1>
        <p className="text-muted-foreground">
          Importe produtos em lote, escolha templates ou crie seus próprios tamanhos
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Produtos</TabsTrigger>
          <TabsTrigger value="items">Itens de Cardápio</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="sizes">Tamanhos</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <ProductUploader
            tenantId={tenantId}
            onSuccess={() => {
              setTimeout(() => router.push('/dashboard/products'), 2000)
            }}
          />
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <ItemsUploader
            tenantId={tenantId}
            onSuccess={(items) => {
              console.log('[v0] Itens importados:', items)
            }}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <TemplatesGallery
            tenantId={tenantId}
            onSelect={(template) => {
              router.push(
                `/dashboard/labels/editor?templateId=${template.id}&width=${template.width_mm}&height=${template.height_mm}`
              )
            }}
          />
        </TabsContent>

        <TabsContent value="sizes" className="space-y-4">
          <CustomSizesManager
            tenantId={tenantId}
            onSelect={(size) => {
              router.push(
                `/dashboard/labels/editor?width=${size.width_mm}&height=${size.height_mm}&size=${size.name}`
              )
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
