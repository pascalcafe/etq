'use client'

import { useState } from 'react'
import { ProCanvas } from '@/components/pro-canvas'
import { ProToolbar } from '@/components/pro-toolbar'
import { LayersPanel } from '@/components/layers-panel'
import { PropertiesPanel } from '@/components/properties-panel'
import { Button } from '@/components/ui/button'
import { X, Save } from 'lucide-react'

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

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div>
          <h1 className="text-lg font-bold">Editor de Etiquetas Profissional</h1>
          <p className="text-xs text-muted-foreground">
            Crie e customize suas etiquetas com precisão
          </p>
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
