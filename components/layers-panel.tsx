'use client'

import { useCanvasStore } from '@/stores/canvas-store'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Eye,
  EyeOff,
  Trash2,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function LayersPanel() {
  const {
    objects,
    selectedId,
    selectObject,
    deleteObject,
    updateObject,
    bringToFront,
    sendToBack,
  } = useCanvasStore()

  const getObjectLabel = (obj: any) => {
    if (obj.type === 'text' && obj.text) {
      return obj.text.substring(0, 20)
    }
    return obj.type.charAt(0).toUpperCase() + obj.type.slice(1)
  }

  return (
    <div className="flex flex-col h-full bg-white border-l">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm">Camadas</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {objects.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              Nenhuma camada
            </p>
          ) : (
            objects
              .slice()
              .reverse()
              .map((obj, reverseIndex) => {
                const index = objects.length - 1 - reverseIndex
                const isSelected = selectedId === obj.id

                return (
                  <div
                    key={obj.id}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded text-sm cursor-pointer group',
                      isSelected
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-slate-50 border border-transparent'
                    )}
                    onClick={() => selectObject(obj.id)}
                  >
                    {/* Thumbnail */}
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                      {obj.type[0].toUpperCase()}
                    </div>

                    {/* Label */}
                    <span className="flex-1 truncate text-xs">
                      {getObjectLabel(obj)}
                    </span>

                    {/* Visibility toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateObject(obj.id, {
                          opacity: obj.opacity === 0 ? 1 : 0,
                        })
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {obj.opacity === 0 ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </button>

                    {/* Lock toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateObject(obj.id, { locked: !obj.locked })
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {obj.locked ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        <Unlock className="w-3 h-3" />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteObject(obj.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )
              })
          )}
        </div>
      </ScrollArea>

      {/* Controls */}
      {selectedId && (
        <div className="border-t p-2 flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-7 text-xs"
            onClick={() => bringToFront(selectedId)}
            title="Trazer para frente"
          >
            <ChevronUp className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-7 text-xs"
            onClick={() => sendToBack(selectedId)}
            title="Enviar para trás"
          >
            <ChevronDown className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
