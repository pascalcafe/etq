'use client'

import { useState, useEffect } from 'react'
import { ProCanvas } from '@/components/pro-canvas'
import { ProToolbar } from '@/components/pro-toolbar'
import { LayersPanel } from '@/components/layers-panel'
import { PropertiesPanel } from '@/components/properties-panel'
import { ProfessionalTemplatesSelector } from '@/components/professional-templates-selector'
import { Button } from '@/components/ui/button'
import { X, Save, ChevronLeft } from 'lucide-react'
import { useCanvasStore } from '@/stores/canvas-store'
import { ProfessionalTemplate } from '@/lib/label-templates/professional-templates'
import { loadTemplateToCanvas, scaleTemplate } from '@/lib/canvas-utils/template-loader'

interface ProLabelEditorProps {
  productId?: string
  templateId?: string
  onSave?: (layout: any) => Promise<void>
  onClose?: () => void
}

export function ProLabelEditor({
  productId,
  templateId,
  onSave,
  onClose,
}: ProLabelEditorProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(!templateId)
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false)
  const { objects, setCanvasSize, addObject } = useCanvasStore()

  const handleSelectTemplate = async (template: ProfessionalTemplate) => {
    setIsLoadingTemplate(true)
    try {
      // Set canvas dimensions based on template
      setCanvasSize(template.width, template.height)

      // Load template objects into canvas
      const templateObjects = loadTemplateToCanvas(template)
      templateObjects.forEach((obj) => {
        addObject(obj)
      })

      setShowTemplateSelector(false)
      console.log('[v0] Template carregado:', template.name)
    } catch (error) {
      console.error('[v0] Erro ao carregar template:', error)
    } finally {
      setIsLoadingTemplate(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // In production, this would save to the database
      if (onSave) {
        await onSave({})
      }
      console.log('[v0] Editor layout saved')
    } catch (error) {
      console.error('[v0] Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Show template selector modal
  if (showTemplateSelector) {
    return (
      <div className="flex flex-col h-screen bg-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <div>
            <h1 className="text-lg font-bold">Novo Projeto de Etiqueta</h1>
            <p className="text-xs text-muted-foreground">
              Escolha um template profissional para começar
            </p>
          </div>
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Template Selector */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <ProfessionalTemplatesSelector
              onSelectTemplate={handleSelectTemplate}
              loading={isLoadingTemplate}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTemplateSelector(true)}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-lg font-bold">Editor de Etiquetas</h1>
            <p className="text-xs text-muted-foreground">
              {objects.length} elementos no projeto
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-1" />
            Salvar
          </Button>
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <ProToolbar />

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <ProCanvas />

        {/* Right sidebar */}
        <div className="flex w-80 gap-0">
          {/* Layers panel */}
          <div className="w-40 border-r overflow-hidden">
            <LayersPanel />
          </div>

          {/* Properties panel */}
          <div className="flex-1 overflow-hidden">
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
