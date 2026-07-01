// Excel processor utility using SheetJS
// Processes Nome, Grupo, Valor, Unidade, Cód. Ref. columns
// Robust parser with alias support for multiple ERP systems

export interface MenuItem {
  nome: string
  grupo: string
  valor: string
  unidade: string
  cod_ref: string
}

// Normalize a single header string correctly
function normalizeHeaderString(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_') // Replace multiple special chars with single underscore
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
}

// Column aliases mapping for maximum flexibility
const columnAliases: Record<keyof MenuItem, string[]> = {
  nome: ['nome', 'product', 'name', 'item', 'produto', 'nomeproduto', 'productname', 'itemname'],
  
  grupo: ['grupo', 'group', 'category', 'categoria', 'type', 'tipo', 'classification', 'classificacao'],
  
  valor: ['valor', 'value', 'price', 'preco', 'preço', 'preço_unitário', 'preço_unit', 'unitprice', 'unit_price', 'amount'],
  
  unidade: ['unidade', 'unit', 'un', 'medida', 'measure', 'measurement', 'med'],
  
  cod_ref: ['cod_ref', 'codigo', 'código', 'sku', 'reference', 'ref', 'code', 'productcode', 'itemcode', 'referencecode'],
}

// Detect if a column contains combined data (e.g., "NomeGrupo" → "Name - Grupo")
function tryDetectCombinedColumn(columnName: string, value: string): { field: keyof MenuItem; separator?: string } | null {
  const normalized = normalizeHeaderString(columnName)
  
  // Check for patterns like "nomegrp", "namecategory", etc.
  for (const field of Object.keys(columnAliases) as (keyof MenuItem)[]) {
    const aliases = columnAliases[field]
    for (const alias of aliases) {
      if (normalized.includes(alias)) {
        // Found a field in the column name
        // Check if value contains separator patterns
        if (value.includes(' - ') || value.includes(' | ') || value.includes(';')) {
          const separator = value.includes(' - ') ? ' - ' : value.includes(' | ') ? ' | ' : ';'
          return { field, separator }
        }
      }
    }
  }
  
  return null
}

function findFieldForColumn(columnName: string): keyof MenuItem | null {
  const normalized = normalizeHeaderString(columnName)
  
  // Direct match against aliases
  for (const [field, aliases] of Object.entries(columnAliases) as [keyof MenuItem, string[]][]) {
    if (aliases.includes(normalized)) {
      return field
    }
  }
  
  // Partial match - check if alias is contained in normalized name
  for (const [field, aliases] of Object.entries(columnAliases) as [keyof MenuItem, string[]][]) {
    for (const alias of aliases) {
      if (normalized.includes(alias) || alias.includes(normalized)) {
        return field
      }
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
