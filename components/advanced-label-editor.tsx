'use client'

import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Rect, Text, Image as KonvaImage, Group } from 'react-konva'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Copy, Trash2, Save, X } from 'lucide-react'
import Konva from 'konva'

interface EditorElement {
  id: string
  type: 'text' | 'barcode' | 'qrcode' | 'rect' | 'image'
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  text?: string
  fill?: string
  stroke?: string
  fontSize?: number
  fontWeight?: string
}

interface AdvancedLabelEditorProps {
  width: number
  height: number
  elements?: EditorElement[]
  onSave?: (elements: EditorElement[]) => void
}

export function AdvancedLabelEditor({
  width: initialWidth,
  height: initialHeight,
  elements: initialElements = [],
  onSave,
}: AdvancedLabelEditorProps) {
  const stageRef = useRef<Konva.Stage>(null)
  const [elements, setElements] = useState<EditorElement[]>(initialElements)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)

  // Converter mm para pixels (96 DPI)
  const mmToPx = (mm: number) => (mm * 96) / 25.4
  const pxToMm = (px: number) => (px * 25.4) / 96

  const stageWidth = Math.min(800, mmToPx(initialWidth))
  const stageHeight = (mmToPx(initialHeight) * stageWidth) / mmToPx(initialWidth)

  const handleAddElement = (type: EditorElement['type']) => {
    const newElement: EditorElement = {
      id: `element-${Date.now()}`,
      type,
      x: 20,
      y: 20,
      width: 100,
      height: 50,
      text: type === 'text' ? 'Novo Texto' : undefined,
      fontSize: 14,
      fill: '#000000',
    }
    setElements([...elements, newElement])
    setSelectedId(newElement.id)
  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (id: string, e: any) => {
    setIsDragging(false)
    const newElements = elements.map(el =>
      el.id === id
        ? {
            ...el,
            x: e.target.x(),
            y: e.target.y(),
          }
        : el
    )
    setElements(newElements)
  }

  const handleTransformEnd = (id: string, e: any) => {
    const node = e.target
    const newElements = elements.map(el =>
      el.id === id
        ? {
            ...el,
            x: node.x(),
            y: node.y(),
            width: Math.max(20, node.width() * node.scaleX()),
            height: Math.max(20, node.height() * node.scaleY()),
            rotation: node.rotation(),
          }
        : el
    )
    setElements(newElements)
    node.scaleX(1)
    node.scaleY(1)
  }

  const handleDelete = (id: string) => {
    setElements(elements.filter(el => el.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const handleDuplicate = (id: string) => {
    const element = elements.find(el => el.id === id)
    if (!element) return

    const newElement = {
      ...element,
      id: `element-${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20,
    }
    setElements([...elements, newElement])
    setSelectedId(newElement.id)
  }

  const selectedElement = elements.find(el => el.id === selectedId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Canvas */}
      <div className="lg:col-span-3">
        <Card className="p-4 bg-muted">
          <div className="overflow-auto rounded-lg bg-white border-2 border-dashed border-muted-foreground/30">
            <Stage
              ref={stageRef}
              width={stageWidth}
              height={stageHeight}
              style={{ background: 'white' }}
            >
              <Layer>
                {/* Background */}
                <Rect
                  width={mmToPx(initialWidth)}
                  height={mmToPx(initialHeight)}
                  fill="white"
                  stroke="#ddd"
                  strokeWidth={1}
                  pointerEvents="none"
                />

                {/* Elements */}
                {elements.map(element => (
                  <Group
                    key={element.id}
                    onClick={() => setSelectedId(element.id)}
                    onMouseEnter={e => {
                      if (e.target.getStage()) e.target.getStage()!.container().style.cursor = 'pointer'
                    }}
                    onMouseLeave={e => {
                      if (e.target.getStage())
                        e.target.getStage()!.container().style.cursor = 'default'
                    }}
                  >
                    {element.type === 'text' && (
                      <Text
                        x={element.x}
                        y={element.y}
                        width={element.width}
                        height={element.height}
                        text={element.text}
                        fontSize={element.fontSize}
                        fontWeight={element.fontWeight}
                        fill={element.fill}
                        draggable={selectedId === element.id}
                        onDragStart={handleDragStart}
                        onDragEnd={e => handleDragEnd(element.id, e)}
                        wrapped
                      />
                    )}

                    {element.type === 'rect' && (
                      <Rect
                        x={element.x}
                        y={element.y}
                        width={element.width}
                        height={element.height}
                        fill={element.fill}
                        stroke={selectedId === element.id ? '#2563eb' : '#ccc'}
                        strokeWidth={selectedId === element.id ? 2 : 1}
                        draggable={selectedId === element.id}
                        onDragStart={handleDragStart}
                        onDragEnd={e => handleDragEnd(element.id, e)}
                      />
                    )}

                    {(element.type === 'barcode' || element.type === 'qrcode') && (
                      <Rect
                        x={element.x}
                        y={element.y}
                        width={element.width}
                        height={element.height}
                        fill="#f3f4f6"
                        stroke={selectedId === element.id ? '#2563eb' : '#ccc'}
                        strokeWidth={selectedId === element.id ? 2 : 1}
                        draggable={selectedId === element.id}
                        onDragStart={handleDragStart}
                        onDragEnd={e => handleDragEnd(element.id, e)}
                      />
                    )}

                    {selectedId === element.id && (
                      <Rect
                        x={element.x}
                        y={element.y}
                        width={element.width}
                        height={element.height}
                        stroke="#2563eb"
                        strokeWidth={2}
                        fill="transparent"
                        pointerEvents="none"
                      />
                    )}
                  </Group>
                ))}
              </Layer>
            </Stage>
          </div>
        </Card>
      </div>

      {/* Properties Panel */}
      <div className="space-y-4">
        {/* Add Elements */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Adicionar Elemento</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddElement('text')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Texto
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddElement('rect')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Retângulo
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddElement('barcode')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Código de Barras
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddElement('qrcode')}
            >
              <Plus className="h-4 w-4 mr-2" />
              QR Code
            </Button>
          </div>
        </Card>

        {/* Selected Element Properties */}
        {selectedElement && (
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Propriedades</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedId(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Coordinates */}
            <div>
              <label className="text-sm font-medium">Posição X (mm)</label>
              <Input
                type="number"
                value={Math.round(pxToMm(selectedElement.x))}
                onChange={e =>
                  setElements(
                    elements.map(el =>
                      el.id === selectedId
                        ? { ...el, x: mmToPx(parseFloat(e.target.value)) }
                        : el
                    )
                  )
                }
                step={1}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Posição Y (mm)</label>
              <Input
                type="number"
                value={Math.round(pxToMm(selectedElement.y))}
                onChange={e =>
                  setElements(
                    elements.map(el =>
                      el.id === selectedId
                        ? { ...el, y: mmToPx(parseFloat(e.target.value)) }
                        : el
                    )
                  )
                }
                step={1}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Largura (mm)</label>
              <Input
                type="number"
                value={Math.round(pxToMm(selectedElement.width))}
                onChange={e =>
                  setElements(
                    elements.map(el =>
                      el.id === selectedId
                        ? { ...el, width: mmToPx(parseFloat(e.target.value)) }
                        : el
                    )
                  )
                }
                step={1}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Altura (mm)</label>
              <Input
                type="number"
                value={Math.round(pxToMm(selectedElement.height))}
                onChange={e =>
                  setElements(
                    elements.map(el =>
                      el.id === selectedId
                        ? { ...el, height: mmToPx(parseFloat(e.target.value)) }
                        : el
                    )
                  )
                }
                step={1}
              />
            </div>

            {selectedElement.type === 'text' && (
              <>
                <div>
                  <label className="text-sm font-medium">Texto</label>
                  <Input
                    value={selectedElement.text || ''}
                    onChange={e =>
                      setElements(
                        elements.map(el =>
                          el.id === selectedId ? { ...el, text: e.target.value } : el
                        )
                      )
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Tamanho Fonte</label>
                  <Input
                    type="number"
                    value={selectedElement.fontSize || 14}
                    onChange={e =>
                      setElements(
                        elements.map(el =>
                          el.id === selectedId
                            ? { ...el, fontSize: parseInt(e.target.value) }
                            : el
                        )
                      )
                    }
                  />
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1"
                onClick={() => handleDuplicate(selectedId)}
              >
                <Copy className="h-3 w-3" />
                Duplicar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 gap-1"
                onClick={() => handleDelete(selectedId)}
              >
                <Trash2 className="h-3 w-3" />
                Deletar
              </Button>
            </div>
          </Card>
        )}

        {/* Save */}
        <Button
          className="w-full gap-2"
          onClick={() => {
            onSave?.(elements)
          }}
        >
          <Save className="h-4 w-4" />
          Salvar Layout
        </Button>
      </div>
    </div>
  )
}
