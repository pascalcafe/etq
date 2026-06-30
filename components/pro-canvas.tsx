'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Canvas as FabricCanvas, FabricObject, util } from 'fabric'
import { useCanvasStore } from '@/stores/canvas-store'
import { useContextMenu } from '@/hooks/use-context-menu'

export function ProCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<FabricCanvas | null>(null)
  const {
    canvasWidth,
    canvasHeight,
    zoom,
    objects,
    selectedId,
    showGrid,
    showRulers,
    gridSize,
    snapToGrid,
    selectObject,
    updateObject,
  } = useCanvasStore()
  const { showContextMenu } = useContextMenu()

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
      enableRetinaScaling: true,
    })

    fabricRef.current = canvas

    // Canvas events
    canvas.on('selection:created', handleSelection)
    canvas.on('selection:updated', handleSelection)
    canvas.on('selection:cleared', () => selectObject(null))
    canvas.on('object:modified', handleObjectModified)
    canvas.on('object:moving', handleObjectMoving)
    canvas.on('mouse:down', handleMouseDown)

    return () => {
      canvas.dispose()
    }
  }, [])

  // Update canvas when objects change
  useEffect(() => {
    if (!fabricRef.current) return

    fabricRef.current.clear()
    fabricRef.current.loadFromJSON({ objects }, async () => {
      fabricRef.current?.renderAll()
    })
  }, [objects])

  // Handle zoom
  useEffect(() => {
    if (!fabricRef.current) return
    const zoomLevel = zoom / 100
    fabricRef.current.setZoom(zoomLevel)
    fabricRef.current.renderAll()
  }, [zoom])

  const handleSelection = useCallback(
    (e: any) => {
      if (e.selected && e.selected[0]) {
        selectObject(e.selected[0].id as string)
      }
    },
    [selectObject]
  )

  const handleObjectModified = useCallback(
    (e: any) => {
      if (!e.target) return
      const obj = e.target as FabricObject
      updateObject(obj.id as string, {
        left: Math.round(obj.left || 0),
        top: Math.round(obj.top || 0),
        width: Math.round(obj.width || 0),
        height: Math.round(obj.height || 0),
        angle: Math.round(obj.angle || 0),
        opacity: obj.opacity || 1,
      })
    },
    [updateObject]
  )

  const handleObjectMoving = useCallback(
    (e: any) => {
      if (!snapToGrid || !e.target) return
      const obj = e.target
      obj.left = Math.round((obj.left || 0) / gridSize) * gridSize
      obj.top = Math.round((obj.top || 0) / gridSize) * gridSize
    },
    [snapToGrid, gridSize]
  )

  const handleMouseDown = useCallback((e: any) => {
    if (e.button === 3) {
      // Right click
      e.e.preventDefault()
      showContextMenu(e.e.pageX, e.e.pageY, e.target)
    }
  }, [showContextMenu])

  return (
    <div className="relative flex-1 bg-slate-50 overflow-hidden">
      {/* Rulers */}
      {showRulers && (
        <>
          <div className="absolute top-0 left-12 right-0 h-6 bg-slate-200 border-b text-xs flex items-center overflow-hidden">
            <div className="flex gap-4 pl-4">
              {Array.from({ length: Math.ceil(canvasWidth / 100) }).map(
                (_, i) => (
                  <span key={`ruler-h-${i}`}>{i * 100}px</span>
                )
              )}
            </div>
          </div>
          <div className="absolute top-6 left-0 bottom-0 w-12 bg-slate-200 border-r text-xs flex flex-col items-center overflow-hidden">
            <div className="flex flex-col gap-4 pt-4">
              {Array.from({ length: Math.ceil(canvasHeight / 100) }).map(
                (_, i) => (
                  <span key={`ruler-v-${i}`}>{i * 100}px</span>
                )
              )}
            </div>
          </div>
        </>
      )}

      {/* Canvas */}
      <div
        className="absolute overflow-auto"
        style={{
          top: showRulers ? 24 : 0,
          left: showRulers ? 48 : 0,
          right: 0,
          bottom: 0,
        }}
      >
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: '0 0' }}>
          <canvas
            ref={canvasRef}
            className="bg-white shadow-sm cursor-crosshair"
          />
        </div>
      </div>

      {/* Grid background */}
      {showGrid && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: showRulers ? 24 : 0,
            left: showRulers ? 48 : 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(0deg, transparent calc(100% - 1px), #e2e8f0 calc(100% - 1px)),
              linear-gradient(90deg, transparent calc(100% - 1px), #e2e8f0 calc(100% - 1px))
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />
      )}
    </div>
  )
}
