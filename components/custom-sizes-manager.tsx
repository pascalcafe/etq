'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Check } from 'lucide-react'

interface Size {
  id: string
  name: string
  width_mm: number
  height_mm: number
  is_saved: boolean
}

interface CustomSizesManagerProps {
  tenantId: string
  onSelect?: (size: Size) => void
}

const PRESET_SIZES: Size[] = [
  { id: 'preset-1', name: '40x60mm', width_mm: 40, height_mm: 60, is_saved: true },
  { id: 'preset-2', name: '50x30mm', width_mm: 50, height_mm: 30, is_saved: true },
  { id: 'preset-3', name: '50x80mm', width_mm: 50, height_mm: 80, is_saved: true },
  { id: 'preset-4', name: '60x40mm', width_mm: 60, height_mm: 40, is_saved: true },
  { id: 'preset-5', name: '30x50mm', width_mm: 30, height_mm: 50, is_saved: true },
  { id: 'preset-6', name: 'A4', width_mm: 210, height_mm: 297, is_saved: true },
]

export function CustomSizesManager({
  tenantId,
  onSelect,
}: CustomSizesManagerProps) {
  const [sizes, setSizes] = useState<Size[]>(PRESET_SIZES)
  const [newSize, setNewSize] = useState({ name: '', width: '', height: '' })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadSavedSizes()
  }, [])

  const loadSavedSizes = async () => {
    try {
      const { data, error } = await supabase
        .from('label_templates')
        .select('width_mm, height_mm, name')
        .eq('tenant_id', tenantId)
        .eq('is_default', false)
        .limit(20)

      if (error) throw error

      const customSizes: Size[] = (data || []).map((d, idx) => ({
        id: `custom-${idx}`,
        name: d.name,
        width_mm: parseFloat(d.width_mm),
        height_mm: parseFloat(d.height_mm),
        is_saved: true,
      }))

      setSizes([...PRESET_SIZES, ...customSizes])
    } catch (err) {
      console.error('Error loading custom sizes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSize = async () => {
    if (!newSize.name || !newSize.width || !newSize.height) {
      alert('Preencha todos os campos')
      return
    }

    const size: Size = {
      id: `custom-${Date.now()}`,
      name: newSize.name,
      width_mm: parseFloat(newSize.width),
      height_mm: parseFloat(newSize.height),
      is_saved: false,
    }

    setSizes([...sizes, size])
    setNewSize({ name: '', width: '', height: '' })
  }

  const handleDeleteSize = (id: string) => {
    if (id.startsWith('preset')) return
    setSizes(sizes.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Add New Size */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Criar Tamanho Personalizado</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="size-name" className="text-sm">
              Nome
            </Label>
            <Input
              id="size-name"
              placeholder="Ex: Etiqueta Pequena"
              value={newSize.name}
              onChange={e => setNewSize({ ...newSize, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="size-width" className="text-sm">
              Largura (mm)
            </Label>
            <Input
              id="size-width"
              type="number"
              placeholder="40"
              value={newSize.width}
              onChange={e => setNewSize({ ...newSize, width: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="size-height" className="text-sm">
              Altura (mm)
            </Label>
            <Input
              id="size-height"
              type="number"
              placeholder="60"
              value={newSize.height}
              onChange={e => setNewSize({ ...newSize, height: e.target.value })}
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleAddSize}
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </div>
      </Card>

      {/* Sizes Grid */}
      <div>
        <h3 className="font-semibold mb-4">Tamanhos Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sizes.map(size => (
            <Card
              key={size.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelect?.(size)}
            >
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">{size.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {size.width_mm} × {size.height_mm} mm
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(size.width_mm * 3.78).toFixed(0)} × {(size.height_mm * 3.78).toFixed(0)} px
                  </p>
                </div>

                {/* Visual Preview */}
                <div className="bg-muted p-2 rounded flex items-center justify-center"
                  style={{
                    aspectRatio: `${size.width_mm} / ${size.height_mm}`,
                  }}
                >
                  <div className="text-xs text-muted-foreground text-center">
                    {size.width_mm}×{size.height_mm}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={e => {
                      e.stopPropagation()
                      onSelect?.(size)
                    }}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Selecionar
                  </Button>
                  {!size.id.startsWith('preset') && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={e => {
                        e.stopPropagation()
                        handleDeleteSize(size.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
