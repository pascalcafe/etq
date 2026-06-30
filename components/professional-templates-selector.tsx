'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { allProfessionalTemplates, ProfessionalTemplate } from '@/lib/label-templates/professional-templates'
import { Zap, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ProfessionalTemplatesSelectorProps {
  onSelectTemplate: (template: ProfessionalTemplate) => void
  loading?: boolean
}

export function ProfessionalTemplatesSelector({
  onSelectTemplate,
  loading = false,
}: ProfessionalTemplatesSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(
    new Set(allProfessionalTemplates.map((t) => t.category))
  ).sort()

  const filteredTemplates = allProfessionalTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Templates Profissionais</h3>
        <p className="text-sm text-muted-foreground">
          Escolha um template pré-desenhado para começar
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {/* Templates Grid */}
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        <div className="space-y-3">
          {filteredTemplates.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-muted-foreground">
              <p>Nenhum template encontrado</p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <Card key={template.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  {/* Title and Category */}
                  <div>
                    <h4 className="font-semibold text-sm">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{template.width}mm × {template.height}mm</span>
                    <span className="capitalize">{template.category}</span>
                    <span>{template.objects.length} elementos</span>
                  </div>

                  {/* Button */}
                  <Button
                    onClick={() => onSelectTemplate(template)}
                    disabled={loading}
                    size="sm"
                    className="w-full gap-2"
                  >
                    <Zap className="h-3 w-3" />
                    {loading ? 'Carregando...' : 'Usar Template'}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
