import { CanvasObject } from '@/stores/canvas-store'
import { ProfessionalTemplate } from '@/lib/label-templates/professional-templates'
import { v4 as uuidv4 } from 'uuid'

/**
 * Carrega um template no canvas, gerando IDs únicos para cada objeto
 */
export function loadTemplateToCanvas(template: ProfessionalTemplate): CanvasObject[] {
  return template.objects.map((obj) => ({
    ...obj,
    id: uuidv4(), // Gera novo ID para cada objeto
  }))
}

/**
 * Cria um mapa de IDs antigos para novos para referências
 */
export function remapTemplateIds(template: ProfessionalTemplate): {
  objects: CanvasObject[]
  idMap: Record<string, string>
} {
  const idMap: Record<string, string> = {}
  const objects = template.objects.map((obj) => {
    const newId = uuidv4()
    idMap[obj.id] = newId
    return { ...obj, id: newId }
  })
  return { objects, idMap }
}

/**
 * Converte dimensões de template de mm para pixels (96 DPI)
 */
export function mmToPx(mm: number, dpi: number = 96): number {
  return Math.round((mm * dpi) / 25.4)
}

/**
 * Converte dimensões de px para mm (96 DPI)
 */
export function pxToMm(px: number, dpi: number = 96): number {
  return (px * 25.4) / dpi
}

/**
 * Escalona um template para novas dimensões
 */
export function scaleTemplate(
  template: ProfessionalTemplate,
  newWidth: number,
  newHeight: number
): ProfessionalTemplate {
  const scaleX = newWidth / template.width
  const scaleY = newHeight / template.height

  return {
    ...template,
    width: newWidth,
    height: newHeight,
    objects: template.objects.map((obj) => ({
      ...obj,
      left: obj.left * scaleX,
      top: obj.top * scaleY,
      width: obj.width * scaleX,
      height: obj.height * scaleY,
    })),
  }
}
