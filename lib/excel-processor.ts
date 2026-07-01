// Excel processor utility using SheetJS
// Processes Nome, Grupo, Valor, Unidade, Cód. Ref. columns

export interface MenuItem {
  nome: string
  grupo: string
  valor: string
  unidade: string
  cod_ref: string
}

// Column name normalizations (case-insensitive and flexible)
const columnMappings: Record<string, keyof MenuItem> = {
  nome: 'nome',
  product: 'nome',
  name: 'nome',
  item: 'nome',
  produto: 'nome',

  grupo: 'grupo',
  group: 'grupo',
  category: 'grupo',
  categoria: 'grupo',
  type: 'grupo',

  valor: 'valor',
  value: 'valor',
  price: 'valor',
  preço: 'valor',
  preco: 'valor',
  'preço unitário': 'valor',

  unidade: 'unidade',
  unit: 'unidade',
  un: 'unidade',
  medida: 'unidade',

  'cód. ref.': 'cod_ref',
  'cod. ref.': 'cod_ref',
  'código ref': 'cod_ref',
  'codigo ref': 'cod_ref',
  sku: 'cod_ref',
  reference: 'cod_ref',
  código: 'cod_ref',
  codigo: 'cod_ref',
}

function normalizeColumnName(name: string): keyof MenuItem | null {
  const normalized = name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics

  // Direct match
  if (normalized in columnMappings) {
    return columnMappings[normalized] as keyof MenuItem
  }

  // Partial matches
  for (const [key, value] of Object.entries(columnMappings)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return value as keyof MenuItem
    }
  }

  return null
}

function parseValue(val: unknown): string {
  if (val === null || val === undefined || val === '') {
    return ''
  }

  if (typeof val === 'string') {
    return val.trim()
  }

  if (typeof val === 'number') {
    return String(val)
  }

  return String(val)
}

function normalizeValue(value: string, fieldType: keyof MenuItem): string {
  if (fieldType === 'valor') {
    // Convert "5,00" to "5.00"
    const normalized = value.replace(',', '.')
    const num = parseFloat(normalized)
    if (!isNaN(num)) {
      return num.toFixed(2)
    }
  }

  return value
}

export function processMenuItems(rows: Record<string, any>[]): {
  items: MenuItem[]
  errors: string[]
  warnings: string[]
} {
  const items: MenuItem[] = []
  const errors: string[] = []
  const warnings: string[] = []

  if (!rows || rows.length === 0) {
    errors.push('Nenhuma linha de dados encontrada na planilha')
    return { items: [], errors, warnings }
  }

  // Detect column mapping from first row
  const firstRow = rows[0]
  const columnMap = new Map<string, keyof MenuItem>()

  for (const originalKey of Object.keys(firstRow)) {
    const mappedKey = normalizeColumnName(originalKey)
    if (mappedKey) {
      columnMap.set(originalKey, mappedKey)
    } else {
      warnings.push(`Coluna desconhecida: "${originalKey}" (será ignorada)`)
    }
  }

  // Validate required columns
  const requiredColumns = new Set<keyof MenuItem>(['nome', 'grupo', 'valor', 'unidade', 'cod_ref'])
  const foundColumns = new Set(columnMap.values())

  for (const required of requiredColumns) {
    if (!foundColumns.has(required)) {
      errors.push(`Coluna obrigatória ausente: ${required}`)
    }
  }

  if (errors.length > 0) {
    return { items: [], errors, warnings }
  }

  // Process rows
  rows.forEach((row, index) => {
    const menuItem: Partial<MenuItem> = {}
    let rowHasData = false

    for (const [originalKey, mappedKey] of columnMap) {
      const value = parseValue(row[originalKey])
      if (value) {
        rowHasData = true
        const normalized = normalizeValue(value, mappedKey)
        menuItem[mappedKey] = normalized
      }
    }

    // Validate row
    if (!rowHasData) {
      return // Skip empty rows
    }

    if (
      !menuItem.nome ||
      !menuItem.grupo ||
      !menuItem.valor ||
      !menuItem.unidade ||
      !menuItem.cod_ref
    ) {
      errors.push(
        `Linha ${index + 2}: Campos obrigatórios faltando (${[
          !menuItem.nome && 'nome',
          !menuItem.grupo && 'grupo',
          !menuItem.valor && 'valor',
          !menuItem.unidade && 'unidade',
          !menuItem.cod_ref && 'cod_ref',
        ]
          .filter(Boolean)
          .join(', ')})`,
      )
      return
    }

    items.push(menuItem as MenuItem)
  })

  return { items, errors, warnings }
}
