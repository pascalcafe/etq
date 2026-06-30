'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useRouter } from 'next/navigation'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tenant, setTenant] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const loadProducts = async () => {
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
          setTenant(tenants[0])

          // Get products
          const { data } = await supabase
            .from('products')
            .select('*')
            .eq('tenant_id', tenants[0].id)
            .order('created_at', { ascending: false })

          setProducts(data || [])
        }
      } catch (error) {
        console.error('[v0] Error loading products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handleDelete = async (productId: string) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return

    try {
      const supabase = createClient()
      await supabase.from('products').delete().eq('id', productId)
      setProducts(products.filter(p => p.id !== productId))
    } catch (error) {
      console.error('[v0] Error deleting product:', error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meus Produtos</h2>
          <p className="text-muted-foreground mt-2">
            Gerencie todos os seus produtos alimentícios
          </p>
        </div>
        <Link href="/dashboard/products/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Cadastrados</CardTitle>
          <CardDescription>
            Você tem {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum produto cadastrado ainda</p>
              <Link href="/dashboard/products/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Produto
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>EAN</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.brand || '-'}</TableCell>
                      <TableCell>{product.ean || '-'}</TableCell>
                      <TableCell>
                        {product.net_quantity} {product.net_quantity_unit}
                      </TableCell>
                      <TableCell>
                        {new Date(product.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/products/${product.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/labels/editor/${product.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
