'use client'

import { useCanvasStore } from '@/stores/canvas-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Type,
  Square,
  Circle,
  Image,
  QrCode,
  Barcode,
  Copy,
  Trash2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Download,
  RotateCcw,
  Redo2,
  ChevronDown,
  Grid3x3,
  Maximize2,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Separator } from '@/components/ui/separator'

export function ProToolbar() {
  const {
    zoom,
    setZoom,
    addObject,
    selectedId,
    duplicateObject,
    deleteObject,
    showGrid,
    toggleGrid,
    showRulers,
    toggleRulers,
    undo,
    redo,
    canvasWidth,
    canvasHeight,
  } = useCanvasStore()

  const handleAddText = () => {
    addObject({
      id: uuidv4(),
      type: 'text',
      text: 'Texto aqui',
      left: 50,
      top: 50,
      width: 200,
      height: 40,
      fontSize: 16,
      fontFamily: 'Arial',
      fontWeight: 400,
      textAlign: 'left',
      angle: 0,
      opacity: 1,
      fill: '#000000',
      locked: false,
      selectable: true,
    })
  }

  const handleAddShape = (type: 'rect' | 'circle') => {
    addObject({
      id: uuidv4(),
      type,
      left: 100,
      top: 100,
      width: 150,
      height: 150,
      angle: 0,
      opacity: 1,
      fill: '#e0e7ff',
      stroke: '#4f46e5',
      strokeWidth: 2,
      locked: false,
      selectable: true,
    })
  }

  const handleAddImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e: any) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event: any) => {
          addObject({
            id: uuidv4(),
            type: 'image',
            src: event.target.result,
            left: 50,
            top: 50,
            width: 200,
            height: 200,
            angle: 0,
            opacity: 1,
            locked: false,
            selectable: true,
          })
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleAddQRCode = () => {
    addObject({
      id: uuidv4(),
      type: 'qrcode',
      left: 100,
      top: 100,
      width: 150,
      height: 150,
      data: { text: 'https://example.com' },
      angle: 0,
      opacity: 1,
      locked: false,
      selectable: true,
    })
  }

  const handleAddBarcode = () => {
    addObject({
      id: uuidv4(),
      type: 'barcode',
      left: 50,
      top: 50,
      width: 300,
      height: 100,
      data: { text: '1234567890' },
      angle: 0,
      opacity: 1,
      locked: false,
      selectable: true,
    })
  }

  const handleExport = () => {
    // Implementar exportação em produção
    console.log('Export canvas')
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-white border-b">
      {/* First row - Objects */}
      <div className="flex gap-1 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          title="Adicionar texto"
          onClick={handleAddText}
        >
          <Type className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          title="Adicionar retângulo"
          onClick={() => handleAddShape('rect')}
        >
          <Square className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          title="Adicionar círculo"
          onClick={() => handleAddShape('circle')}
        >
          <Circle className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          title="Adicionar imagem"
          onClick={handleAddImage}
        >
          <Image className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          title="Adicionar QR Code"
          onClick={handleAddQRCode}
        >
          <QrCode className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          title="Adicionar código de barras"
          onClick={handleAddBarcode}
        >
          <Barcode className="w-4 h-4" />
        </Button>
      </div>

      <Separator className="my-1" />

      {/* Second row - Edit operations */}
      <div className="flex gap-1 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          disabled={!selectedId}
          onClick={() => selectedId && duplicateObject(selectedId)}
          title="Duplicar"
        >
          <Copy className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={!selectedId}
          onClick={() => selectedId && deleteObject(selectedId)}
          title="Deletar"
        >
          <Trash2 className="w-4 h-4" />
        </Button>

        <Button size="sm" variant="outline" onClick={undo} title="Desfazer">
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button size="sm" variant="outline" onClick={redo} title="Refazer">
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>

      <Separator className="my-1" />

      {/* Third row - View controls */}
      <div className="flex gap-1 flex-wrap items-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setZoom(Math.max(10, zoom - 10))}
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>

        <div className="text-xs font-medium w-12 text-center">{zoom}%</div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setZoom(Math.min(800, zoom + 10))}
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>

        <div className="flex-1" />

        <Button
          size="sm"
          variant={showGrid ? 'default' : 'outline'}
          onClick={toggleGrid}
          title="Mostrar grade"
        >
          <Grid3x3 className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant={showRulers ? 'default' : 'outline'}
          onClick={toggleRulers}
          title="Mostrar réguas"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleExport}
          title="Exportar"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
