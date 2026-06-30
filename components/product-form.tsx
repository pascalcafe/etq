'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface ProductFormProps {
  tenantId: string
  onSuccess?: () => void
}

export function ProductForm({ tenantId, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    ean: '',
    manufacturer_name: '',
    manufacturer_city: '',
    manufacturer_state: '',
    cnpj: '',
    net_quantity: '',
    net_quantity_unit: 'g',
    sugar_g: '',
    sodium_mg: '',
    saturated_fat_g: '',
    allergens: '',
    main_allergen: '',
  })

  const [warnings, setWarnings] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // ANVISA RDC 429/2020 Limits
  const ANVISA_LIMITS = {
    sugar: { limit: 5, label: 'açúcar' },
    sodium: { limit: 400, label: 'sódio' },
    saturated_fat: { limit: 5, label: 'gordura saturada' },
  }

  const validateANVISA = () => {
    const newWarnings: string[] = []

    const sugar = parseFloat(formData.sugar_g)
    const sodium = parseFloat(formData.sodium_mg)
    const saturatedFat = parseFloat(formData.saturated_fat_g)

    if (!isNaN(sugar) && sugar > ANVISA_LIMITS.sugar.limit) {
      newWarnings.push(`Alto teor de açúcar (${sugar}g por porção)`)
    }

    if (!isNaN(sodium) && sodium > ANVISA_LIMITS.sodium.limit) {
      newWarnings.push(`Alto teor de sódio (${sodium}mg por porção)`)
    }

    if (!isNaN(saturatedFat) && saturatedFat > ANVISA_LIMITS.saturated_fat.limit) {
      newWarnings.push(`Alto teor de gordura saturada (${saturatedFat}g por porção)`)
    }

    setWarnings(newWarnings)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    validateANVISA()

    try {
      const supabase = createClient()

      const allergensList = formData.allergens
        .split(',')
        .map(a => a.trim())
        .filter(a => a)

      const { error: insertError } = await supabase
        .from('products')
        .insert([
          {
            tenant_id: tenantId,
            name: formData.name,
            brand: formData.brand,
            ean: formData.ean,
            manufacturer_name: formData.manufacturer_name,
            manufacturer_city: formData.manufacturer_city,
            manufacturer_state: formData.manufacturer_state,
            cnpj: formData.cnpj,
            net_quantity: parseFloat(formData.net_quantity),
            net_quantity_unit: formData.net_quantity_unit,
            sugar_g: formData.sugar_g ? parseFloat(formData.sugar_g) : null,
            sodium_mg: formData.sodium_mg ? parseFloat(formData.sodium_mg) : null,
            saturated_fat_g: formData.saturated_fat_g ? parseFloat(formData.saturated_fat_g) : null,
            allergens: allergensList,
            main_allergen: formData.main_allergen,
            front_seal_active: warnings.length > 0,
          },
        ])

      if (insertError) throw insertError

      setSuccess(true)
      setFormData({
        name: '',
        brand: '',
        ean: '',
        manufacturer_name: '',
        manufacturer_city: '',
        manufacturer_state: '',
        cnpj: '',
        net_quantity: '',
        net_quantity_unit: 'g',
        sugar_g: '',
        sodium_mg: '',
        saturated_fat_g: '',
        allergens: '',
        main_allergen: '',
      })

      setTimeout(() => {
        onSuccess?.()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar produto')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
          <CardDescription>
            Preencha os dados obrigatórios conforme a legislação ANVISA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Biscoito Integral"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Ex: MeuProduto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ean">Código EAN</Label>
                <Input
                  id="ean"
                  name="ean"
                  value={formData.ean}
                  onChange={handleInputChange}
                  placeholder="Ex: 7891234567890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="net_quantity">Quantidade Líquida *</Label>
                <div className="flex gap-2">
                  <Input
                    id="net_quantity"
                    name="net_quantity"
                    type="number"
                    value={formData.net_quantity}
                    onChange={handleInputChange}
                    placeholder="Ex: 500"
                    required
                    step="0.1"
                  />
                  <select
                    name="net_quantity_unit"
                    value={formData.net_quantity_unit}
                    onChange={handleInputChange}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Manufacturer Info */}
            <div>
              <h3 className="font-semibold mb-4">Informações do Fabricante</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer_name">Nome do Fabricante</Label>
                  <Input
                    id="manufacturer_name"
                    name="manufacturer_name"
                    value={formData.manufacturer_name}
                    onChange={handleInputChange}
                    placeholder="Ex: Indústria XYZ Ltda"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    placeholder="Ex: 00.000.000/0000-00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturer_city">Cidade</Label>
                  <Input
                    id="manufacturer_city"
                    name="manufacturer_city"
                    value={formData.manufacturer_city}
                    onChange={handleInputChange}
                    placeholder="Ex: São Paulo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturer_state">Estado</Label>
                  <Input
                    id="manufacturer_state"
                    name="manufacturer_state"
                    value={formData.manufacturer_state}
                    onChange={handleInputChange}
                    placeholder="Ex: SP"
                  />
                </div>
              </div>
            </div>

            {/* Nutritional Info */}
            <div>
              <h3 className="font-semibold mb-4">Informações Nutricionais (por porção)</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sugar_g">Açúcares (g)</Label>
                  <Input
                    id="sugar_g"
                    name="sugar_g"
                    type="number"
                    value={formData.sugar_g}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sodium_mg">Sódio (mg)</Label>
                  <Input
                    id="sodium_mg"
                    name="sodium_mg"
                    type="number"
                    value={formData.sodium_mg}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saturated_fat_g">Gordura Saturada (g)</Label>
                  <Input
                    id="saturated_fat_g"
                    name="saturated_fat_g"
                    type="number"
                    value={formData.saturated_fat_g}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Allergens */}
            <div className="space-y-2">
              <Label htmlFor="allergens">Alérgenos (separados por vírgula)</Label>
              <Input
                id="allergens"
                name="allergens"
                value={formData.allergens}
                onChange={handleInputChange}
                placeholder="Ex: Glúten, Leite, Amendoim"
              />
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-2">
                      Avisos de Frontal Obrigatórios
                    </h4>
                    <ul className="space-y-1">
                      {warnings.map((warning, idx) => (
                        <li key={idx} className="text-sm text-yellow-800">
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-2 items-center text-sm text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                Produto criado com sucesso! Redirecionando...
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Criar Produto'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
