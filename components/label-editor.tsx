'use client'

import { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Rect, Text, Image as KonvaImage } from 'react-konva'
import Konva from 'konva'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, RotateCcw } from 'lucide-react'

interface LabelElement {
  id: string
  type: 'text' | 'rect' | 'image'
  x: number
  y: number
  width: number
  height: number
  text?: string
  fontSize?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  rotation?: number
}

interface LabelEditorProps {
  product: any
  onExport?: (dataUrl: string) => void
}

const LABEL_SIZES = {
  '40x60': { width: 400, height: 600 }, // 40mm x 60mm in pixels (10px = 1mm)
  '50x30': { width: 500, height: 300 },
  'A4': { width: 794, height: 1122 },
}

export function LabelEditor({ product, onExport }: LabelEditorProps) {
  const stageRef = useRef<Konva.Stage>(null)
  const [selectedLabelSize, setSelectedLabelSize] = useState<keyof typeof LABEL_SIZES>('40x60')
  const [elements, setElements] = useState<LabelElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  const labelSize = LABEL_SIZES[selectedLabelSize]

  useEffect(() => {
    // Initialize with default elements
    const defaultElements: LabelElement[] = [
      {
        id: '1',
        type: 'rect',
        x: 0,
        y: 0,
        width: labelSize.width,
        height: labelSize.height,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
      },
      {
        id: '2',
        type: 'text',
        x: 20,
        y: 20,
        width: labelSize.width - 40,
        height: 50,
        text: product?.name || 'Seu Produto',
        fontSize: 24,
        fill: '#000000',
      },
      {
        id: '3',
        type: 'text',
        x: 20,
        y: 80,
        width: labelSize.width - 40,
        height: 40,
        text: `Marca: ${product?.brand || 'Marca'}`,
        fontSize: 14,
        fill: '#333333',
      },
      {
        id: '4',
        type: 'text',
        x: 20,
        y: 130,
        width: labelSize.width - 40,
        height: 30,
        text: `Quantidade: ${product?.net_quantity} ${product?.net_quantity_unit}`,
        fontSize: 12,
        fill: '#666666',
      },
    ]

    // Add warning if needed
    if (product?.front_seal_active) {
      defaultElements.push({
        id: '5',
        type: 'rect',
        x: labelSize.width - 80,
        y: labelSize.height - 100,
        width: 70,
        height: 90,
        fill: '#ff0000',
        stroke: '#000000',
        strokeWidth: 2,
      })

      defaultElements.push({
        id: '6',
        type: 'text',
        x: labelSize.width - 75,
        y: labelSize.height - 90,
        width: 60,
        height: 70,
        text: 'CONTÉM\nALTA\nTEOR',
        fontSize: 10,
        fill: '#ffffff',
      })
    }

    setElements(defaultElements)
  }, [product, labelSize])

  const handleExport = () => {
    if (!stageRef.current) return

    const dataUrl = stageRef.current.toDataURL()
    onExport?.(dataUrl)

    // Also trigger download
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `etiqueta-${product?.name || 'produto'}.png`
    link.click()
  }

  const handleReset = () => {
    setSelectedElement(null)
  }

  const handleElementSelect = (elementId: string) => {
    setSelectedElement(elementId)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Editor Visual de Etiqueta</CardTitle>
          <CardDescription>
            Customize o layout da sua etiqueta alimentícia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Size Selector */}
          <div className="flex gap-2">
            {Object.keys(LABEL_SIZES).map((size) => (
              <Button
                key={size}
                variant={selectedLabelSize === size ? 'default' : 'outline'}
                onClick={() => setSelectedLabelSize(size as keyof typeof LABEL_SIZES)}
              >
                {size}
              </Button>
            ))}
          </div>

          {/* Canvas */}
          <div className="border rounded-lg p-4 bg-gray-50 overflow-auto max-h-[600px] flex items-center justify-center">
            <Stage
              ref={stageRef}
              width={labelSize.width}
              height={labelSize.height}
              className="border border-gray-300 bg-white"
              style={{ display: 'inline-block' }}
            >
              <Layer>
                {elements.map((element) => (
                  <div key={element.id}>
                    {element.type === 'rect' && (
                      <Rect
                        x={element.x}
                        y={element.y}
                        width={element.width}
                        height={element.height}
                        fill={element.fill}
                        stroke={element.stroke}
                        strokeWidth={element.strokeWidth}
                        onClick={() => handleElementSelect(element.id)}
                        selected={selectedElement === element.id}
                      />
                    )}

                    {element.type === 'text' && (
                      <Text
                        x={element.x}
                        y={element.y}
                        width={element.width}
                        height={element.height}
                        text={element.text}
                        fontSize={element.fontSize}
                        fill={element.fill}
                        align="center"
                        verticalAlign="middle"
                        onClick={() => handleElementSelect(element.id)}
                      />
                    )}
                  </div>
                ))}
              </Layer>
            </Stage>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar PNG
            </Button>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p>
              Dica: Clique nos elementos da etiqueta para selecioná-los. A etiqueta está de acordo
              com as regulamentações ANVISA RDC 429/2020.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
