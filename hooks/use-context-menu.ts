'use client'

import { useCallback } from 'react'
import { useCanvasStore } from '@/stores/canvas-store'

export interface ContextMenuState {
  isOpen: boolean
  x: number
  y: number
  targetId: string | null
}

// Simple implementation - in production, use a context provider
export const useContextMenu = () => {
  const { selectedId, selectObject, duplicateObject, deleteObject } =
    useCanvasStore()

  const showContextMenu = useCallback(
    (x: number, y: number, target: any) => {
      const targetId = target?.id
      if (targetId) {
        selectObject(targetId)
      }

      // Show context menu with options
      const options = [
        {
          label: 'Duplicar',
          onClick: () => {
            if (targetId) duplicateObject(targetId)
          },
        },
        {
          label: 'Deletar',
          onClick: () => {
            if (targetId) deleteObject(targetId)
          },
        },
      ]

      console.log('[v0] Context menu showed at', x, y, 'for target', targetId)
      return options
    },
    [selectedId, selectObject, duplicateObject, deleteObject]
  )

  return { showContextMenu }
}
