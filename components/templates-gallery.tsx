'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { Copy, Trash2, Edit2, Download, Zap } from 'lucide-react'
import Link from 'next/link'

interface Template {
  id: string
  name: string
  category: string
  width_mm: number
  height_mm: number
  is_default: boolean
}

interface TemplatesGalleryProps {
  tenantId: string
  onSelect?: (template: Template) => void
}

export function TemplatesGallery({ tenantId, onSelect }: TemplatesGalleryProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('label_templates')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('is_default', { ascending: false })
        .order('name')

      if (error) throw error
      setTemplates(data || [])
    } catch (err) {
      console.error('Error loading templates:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (templateId: string) => {
    if (!confirm('Tem certeza que deseja deletar este template?')) return

    try {
      const { error } = await supabase.from('label_templates').delete().eq('id', templateId)

      if (error) throw error
      setTemplates(prev => prev.filter(t => t.id !== templateId))
    } catch (err) {
      console.error('Error deleting template:', err)
    }
  }

  const handleDuplicate = async (template: Template) => {
    try {
      const newTemplate = {
        ...template,
        id: undefined,
        name: `${template.name} (cópia)`,
        is_default: false,
      }

      const { data, error } = await supabase
        .from('label_templates')
        .insert([newTemplate])
        .select()

      if (error) throw error
      if (data) setTemplates(prev => [...prev, data[0]])
    } catch (err) {
      console.error('Error duplicating template:', err)
    }
  }

  const categories = ['all', ...new Set(templates.map(t => t.category).filter(Boolean))]
  const filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter(t => t.category === selectedCategory)

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando templates...</div>
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="capitalize"
          >
            {cat === 'all' ? 'Todos' : cat}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Preview */}
            <div
              className="bg-muted aspect-video flex items-center justify-center relative"
              style={{
                aspectRatio: `${template.width_mm} / ${template.height_mm}`,
              }}
            >
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-2">
                  {template.width_mm}x{template.height_mm}mm
                </div>
                <div className="text-sm font-mono text-muted-foreground">
                  {(template.width_mm * 3.78).toFixed(0)}x{(template.height_mm * 3.78).toFixed(0)}px
                </div>
              </div>
              {template.is_default && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Padrão
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 border-t space-y-3">
              <div>
                <h3 className="font-semibold text-sm line-clamp-2">{template.name}</h3>
                {template.category && (
                  <span className="text-xs text-muted-foreground capitalize">{template.category}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/dashboard/labels/editor-pro?templateId=${template.id}`} className="flex-1">
                  <Button
                    size="sm"
                    variant="default"
                    className="w-full gap-1"
                  >
                    <Zap className="h-3 w-3" />
                    Editor Pro
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDuplicate(template)}
                  title="Duplicar template"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                {!template.is_default && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(template.id)}
                    title="Deletar template"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum template encontrado nesta categoria</p>
        </Card>
      )}
    </div>
  )
}
