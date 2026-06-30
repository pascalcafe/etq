'use client'

import { create } from 'zustand'

export interface CanvasObject {
  id: string
  type: 'text' | 'image' | 'rect' | 'circle' | 'qrcode' | 'barcode' | 'line'
  left: number
  top: number
  width: number
  height: number
  angle: number
  opacity: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  text?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: number
  textAlign?: string
  src?: string
  locked: boolean
  selectable: boolean
  data?: Record<string, any>
}

export interface CanvasState {
  canvasWidth: number
  canvasHeight: number
  zoom: number
  objects: CanvasObject[]
  selectedId: string | null
  history: CanvasObject[][]
  historyIndex: number
  showRulers: boolean
  showGrid: boolean
  gridSize: number
  snapToGrid: boolean
  unit: 'mm' | 'cm' | 'px' | 'in'

  // Canvas settings
  setCanvasSize: (width: number, height: number) => void
  setZoom: (zoom: number) => void

  // Object management
  addObject: (obj: CanvasObject) => void
  updateObject: (id: string, changes: Partial<CanvasObject>) => void
  deleteObject: (id: string) => void
  selectObject: (id: string | null) => void
  duplicateObject: (id: string) => void

  // Array operations
  moveObject: (fromIndex: number, toIndex: number) => void
  bringToFront: (id: string) => void
  sendToBack: (id: string) => void

  // History
  undo: () => void
  redo: () => void
  clearHistory: () => void

  // View settings
  toggleRulers: () => void
  toggleGrid: () => void
  setGridSize: (size: number) => void
  setSnapToGrid: (snap: boolean) => void
  setUnit: (unit: 'mm' | 'cm' | 'px' | 'in') => void

  // Bulk operations
  setObjects: (objects: CanvasObject[]) => void
  clear: () => void
}

const addToHistory = (state: CanvasState) => {
  const newHistory = state.history.slice(0, state.historyIndex + 1)
  newHistory.push(JSON.parse(JSON.stringify(state.objects)))
  return {
    history: newHistory,
    historyIndex: newHistory.length - 1,
  }
}

export const useCanvasStore = create<CanvasState>((set) => ({
  canvasWidth: 800,
  canvasHeight: 600,
  zoom: 100,
  objects: [],
  selectedId: null,
  history: [[]],
  historyIndex: 0,
  showRulers: true,
  showGrid: false,
  gridSize: 10,
  snapToGrid: false,
  unit: 'mm',

  setCanvasSize: (width, height) =>
    set((state) => ({
      ...state,
      canvasWidth: width,
      canvasHeight: height,
      ...addToHistory(state),
    })),

  setZoom: (zoom) => set({ zoom: Math.max(10, Math.min(800, zoom)) }),

  addObject: (obj) =>
    set((state) => {
      const newObjects = [...state.objects, obj]
      return {
        objects: newObjects,
        selectedId: obj.id,
        ...addToHistory({ ...state, objects: newObjects }),
      }
    }),

  updateObject: (id, changes) =>
    set((state) => {
      const newObjects = state.objects.map((obj) =>
        obj.id === id ? { ...obj, ...changes } : obj
      )
      return {
        objects: newObjects,
        ...addToHistory({ ...state, objects: newObjects }),
      }
    }),

  deleteObject: (id) =>
    set((state) => {
      const newObjects = state.objects.filter((obj) => obj.id !== id)
      return {
        objects: newObjects,
        selectedId: state.selectedId === id ? null : state.selectedId,
        ...addToHistory({ ...state, objects: newObjects }),
      }
    }),

  selectObject: (id) => set({ selectedId: id }),

  duplicateObject: (id) =>
    set((state) => {
      const obj = state.objects.find((o) => o.id === id)
      if (!obj) return state
      const duplicate: CanvasObject = {
        ...JSON.parse(JSON.stringify(obj)),
        id: `${obj.id}-${Date.now()}`,
        left: obj.left + 20,
        top: obj.top + 20,
      }
      const newObjects = [...state.objects, duplicate]
      return {
        objects: newObjects,
        selectedId: duplicate.id,
        ...addToHistory({ ...state, objects: newObjects }),
      }
    }),

  moveObject: (fromIndex, toIndex) =>
    set((state) => {
      const newObjects = [...state.objects]
      const [obj] = newObjects.splice(fromIndex, 1)
      newObjects.splice(toIndex, 0, obj)
      return {
        objects: newObjects,
        ...addToHistory({ ...state, objects: newObjects }),
      }
    }),

  bringToFront: (id) =>
    set((state) => {
      const index = state.objects.findIndex((o) => o.id === id)
      if (index === -1) return state
      const newObjects = [...state.objects]
      const [obj] = newObjects.splice(index, 1)
      newObjects.push(obj)
      return {
        objects: newObjects,
        ...addToHistory({ ...state, objects: newObjects }),
      }
    }),

  sendToBack: (id) =>
    set((state) => {
      const index = state.objects.findIndex((o) => o.id === id)
      if (index === -1) return state
      const newObjects = [...state.objects]
      const [obj] = newObjects.splice(index, 1)
      newObjects.unshift(obj)
      return {
        objects: newObjects,
        ...addToHistory({ ...state, objects: newObjects }),
      }
    }),

  undo: () =>
    set((state) => {
      if (state.historyIndex === 0) return state
      const newIndex = state.historyIndex - 1
      return {
        historyIndex: newIndex,
        objects: JSON.parse(JSON.stringify(state.history[newIndex])),
      }
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex === state.history.length - 1) return state
      const newIndex = state.historyIndex + 1
      return {
        historyIndex: newIndex,
        objects: JSON.parse(JSON.stringify(state.history[newIndex])),
      }
    }),

  clearHistory: () => set({ history: [[]], historyIndex: 0 }),

  toggleRulers: () => set((state) => ({ showRulers: !state.showRulers })),

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  setGridSize: (size) => set({ gridSize: size }),

  setSnapToGrid: (snap) => set({ snapToGrid: snap }),

  setUnit: (unit) => set({ unit }),

  setObjects: (objects) =>
    set((state) => ({
      objects,
      ...addToHistory({ ...state, objects }),
    })),

  clear: () =>
    set((state) => ({
      objects: [],
      selectedId: null,
      ...addToHistory({ ...state, objects: [] }),
    })),
}))
