'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { LabelEditor } from '@/components/label-editor'

export default function LabelEditorPage() {
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        // Get product
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .limit(1)

        if (products && products.length > 0) {
          setProduct(products[0])
        } else {
          router.push('/dashboard/products')
        }
      } catch (error) {
        console.error('[v0] Error loading product:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [productId, router])

  const handleExport = async (dataUrl: string) => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Save label to database
      const { data: insertData } = await supabase
        .from('generated_labels')
        .insert([
          {
            product_id: productId,
            tenant_id: product.tenant_id,
            label_data: { exported_at: new Date().toISOString() },
            pdf_url: dataUrl,
          },
        ])
        .select()

      if (insertData) {
        alert('Etiqueta exportada com sucesso!')
      }
    } catch (error) {
      console.error('[v0] Error exporting label:', error)
      alert('Erro ao exportar etiqueta')
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  if (!product) {
    return <div className="text-center py-12 text-destructive">Produto não encontrado</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Editor de Etiqueta</h2>
        <p className="text-muted-foreground mt-2">
          Customizando etiqueta para: <strong>{product.name}</strong>
        </p>
      </div>

      <LabelEditor product={product} onExport={handleExport} />
    </div>
  )
}
