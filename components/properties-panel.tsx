'use client'

import { useCanvasStore } from '@/stores/canvas-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Copy, Trash2 } from 'lucide-react'

export function PropertiesPanel() {
  const { objects, selectedId, updateObject, deleteObject, duplicateObject } =
    useCanvasStore()

  const selectedObject = objects.find((obj) => obj.id === selectedId)

  if (!selectedObject) {
    return (
      <div className="flex flex-col h-full bg-white border-l p-4">
        <p className="text-sm text-muted-foreground">
          Selecione um objeto para editar propriedades
        </p>
      </div>
    )
  }

  const handleUpdate = (key: string, value: any) => {
    updateObject(selectedId!, { [key]: value })
  }

  return (
    <div className="flex flex-col h-full bg-white border-l">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm">Propriedades</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Position & Size */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase">
              Posição e Tamanho
            </h4>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">X</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedObject.left)}
                    onChange={(e) =>
                      handleUpdate('left', parseFloat(e.target.value))
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Y</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedObject.top)}
                    onChange={(e) =>
                      handleUpdate('top', parseFloat(e.target.value))
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Largura</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedObject.width)}
                    onChange={(e) =>
                      handleUpdate('width', parseFloat(e.target.value))
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Altura</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedObject.height)}
                    onChange={(e) =>
                      handleUpdate('height', parseFloat(e.target.value))
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Rotation & Opacity */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase">
              Transformação
            </h4>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Rotação ({selectedObject.angle}°)</Label>
                <Input
                  type="range"
                  min="0"
                  max="360"
                  value={selectedObject.angle}
                  onChange={(e) =>
                    handleUpdate('angle', parseFloat(e.target.value))
                  }
                  className="h-2"
                />
              </div>
              <div>
                <Label className="text-xs">
                  Opacidade ({Math.round(selectedObject.opacity * 100)}%)
                </Label>
                <Input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedObject.opacity}
                  onChange={(e) =>
                    handleUpdate('opacity', parseFloat(e.target.value))
                  }
                  className="h-2"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Colors */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase">
              Cores
            </h4>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Preenchimento</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedObject.fill || '#000000'}
                    onChange={(e) => handleUpdate('fill', e.target.value)}
                    className="h-8 w-12 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={selectedObject.fill || '#000000'}
                    onChange={(e) => handleUpdate('fill', e.target.value)}
                    className="h-8 text-sm flex-1"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Borda</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedObject.stroke || '#000000'}
                    onChange={(e) => handleUpdate('stroke', e.target.value)}
                    className="h-8 w-12 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={selectedObject.stroke || '#000000'}
                    onChange={(e) => handleUpdate('stroke', e.target.value)}
                    className="h-8 text-sm flex-1"
                  />
                </div>
              </div>
              {selectedObject.strokeWidth !== undefined && (
                <div>
                  <Label className="text-xs">Espessura da borda</Label>
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    value={selectedObject.strokeWidth}
                    onChange={(e) =>
                      handleUpdate('strokeWidth', parseFloat(e.target.value))
                    }
                    className="h-8 text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Text properties */}
          {selectedObject.type === 'text' && (
            <>
              <Separator />
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase">
                  Texto
                </h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Conteúdo</Label>
                    <textarea
                      value={selectedObject.text || ''}
                      onChange={(e) => handleUpdate('text', e.target.value)}
                      className="w-full h-20 p-2 text-sm border rounded resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Tamanho</Label>
                      <Input
                        type="number"
                        value={selectedObject.fontSize || 12}
                        onChange={(e) =>
                          handleUpdate('fontSize', parseFloat(e.target.value))
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Peso</Label>
                      <select
                        value={selectedObject.fontWeight || 400}
                        onChange={(e) =>
                          handleUpdate('fontWeight', parseFloat(e.target.value))
                        }
                        className="w-full h-8 text-sm border rounded px-2"
                      >
                        <option value={300}>Leve</option>
                        <option value={400}>Normal</option>
                        <option value={600}>Negrito</option>
                        <option value={700}>Extra Bold</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="border-t p-3 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-8 text-xs"
          onClick={() => duplicateObject(selectedId!)}
        >
          <Copy className="w-3 h-3 mr-1" />
          Duplicar
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-8 text-xs text-destructive hover:text-destructive"
          onClick={() => deleteObject(selectedId!)}
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Deletar
        </Button>
      </div>
    </div>
  )
}
