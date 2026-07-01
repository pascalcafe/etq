'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, AlertCircle, CheckCircle2, Loader2, Download } from 'lucide-react'
import Papa from 'papaparse'

interface MenuItem {
  nome: string
  grupo: string
  valor: string
  unidade: string
  cod_ref: string
}

interface MenuItemsUploaderProps {
  tenantId: string
  onSuccess?: (items: MenuItem[]) => void
}

export function MenuItemsUploader({ tenantId, onSuccess }: MenuItemsUploaderProps) {
  const [status, setStatus] = useState<'idle' | 'parsing' | 'uploading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string>('')
  const [warnings, setWarnings] = useState<string[]>([])
  const [preview, setPreview] = useState<MenuItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [progress, setProgress] = useState(0)

  const normalizeColumnName = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  const mapColumn = (colName: string): string | null => {
    const normalized = normalizeColumnName(colName)

    const mappings: Record<string, string> = {
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

      unidade: 'unidade',
      unit: 'unidade',
      un: 'unidade',
      medida: 'unidade',

      'cód. ref.': 'cod_ref',
      'cod. ref': 'cod_ref',
      'código ref': 'cod_ref',
      codigo: 'cod_ref',
      sku: 'cod_ref',
    }

    return mappings[normalized] || null
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setStatus('parsing')
    setError('')
    setWarnings([])
    setPreview([])

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const rows = results.data as Record<string, any>[]

            if (rows.length === 0) {
              throw new Error('Nenhuma linha de dados encontrada')
            }

            // Map columns
            const columnMap = new Map<string, string>()
            const firstRow = rows[0]

            for (const key of Object.keys(firstRow)) {
              const mapped = mapColumn(key)
              if (mapped) {
                columnMap.set(key, mapped)
              } else {
                setWarnings((prev) => [...prev, `Coluna ignorada: "${key}"`])
              }
            }

            // Validate required columns
            const requiredCols = ['nome', 'grupo', 'valor', 'unidade', 'cod_ref']
            const foundCols = new Set(columnMap.values())

            const missing = requiredCols.filter((col) => !foundCols.has(col))
            if (missing.length > 0) {
              throw new Error(`Colunas obrigatórias ausentes: ${missing.join(', ')}`)
            }

            // Process items
            const items: MenuItem[] = []
            const rowErrors: string[] = []

            rows.forEach((row, idx) => {
              const item: Partial<MenuItem> = {}

              for (const [originalKey, mappedKey] of columnMap) {
                const value = String(row[originalKey] || '').trim()

                if (value) {
                  // Normalize valor
                  if (mappedKey === 'valor') {
                    const normalized = value.replace(',', '.')
                    const num = parseFloat(normalized)
                    if (isNaN(num)) {
                      rowErrors.push(`Linha ${idx + 2}: Valor inválido "${value}"`)
                      return
                    }
                    item[mappedKey] = num.toFixed(2)
                  } else {
                    item[mappedKey as keyof MenuItem] = value as any
                  }
                }
              }

              // Validate required fields
              if (
                item.nome &&
                item.grupo &&
                item.valor &&
                item.unidade &&
                item.cod_ref
              ) {
                items.push(item as MenuItem)
              } else {
                const missing = requiredCols.filter((col) => !item[col as keyof MenuItem])
                rowErrors.push(`Linha ${idx + 2}: Campos faltando (${missing.join(', ')})`)
              }
            })

            if (rowErrors.length > 0) {
              setWarnings((prev) => [...prev, ...rowErrors])
            }

            if (items.length === 0) {
              throw new Error('Nenhum item válido encontrado')
            }

            setTotalItems(items.length)
            setPreview(items.slice(0, 5))
            setStatus('uploading')

            // Upload items
            const response = await fetch('/api/menu-items/import', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tenantId, items }),
            })

            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.message || 'Erro ao fazer upload')
            }

            const result = await response.json()
            setStatus('success')
            onSuccess?.(items)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido')
            setStatus('error')
          }
        },
        error: (err) => {
          setError(`Erro ao processar arquivo: ${err.message}`)
          setStatus('error')
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setStatus('error')
    }
  }

  const downloadTemplate = () => {
    const csv = 'Nome,Grupo,Valor,Unidade,Cód. Ref.\nExemplo,Bebidas,5.00,L,BEB-001'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template-cardapio.csv'
    a.click()
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Importar Itens de Cardápio</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Colunas obrigatórias: Nome, Grupo, Valor, Unidade, Cód. Ref.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {warnings.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="max-h-32 overflow-y-auto">
                  {warnings.map((w, i) => (
                    <div key={i} className="text-sm">
                      {w}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {totalItems} itens importados com sucesso!
              </AlertDescription>
            </Alert>
          )}

          {preview.length > 0 && (
            <div className="border rounded-lg p-4 bg-slate-50">
              <p className="text-sm font-semibold mb-3">
                Preview (primeiros 5 itens de {totalItems})
              </p>
              <div className="overflow-x-auto">
                <table className="text-sm w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Nome</th>
                      <th className="text-left p-2">Grupo</th>
                      <th className="text-right p-2">Valor</th>
                      <th className="text-left p-2">Un.</th>
                      <th className="text-left p-2">Ref.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-slate-100">
                        <td className="p-2 truncate">{item.nome}</td>
                        <td className="p-2 truncate">{item.grupo}</td>
                        <td className="p-2 text-right">R$ {item.valor}</td>
                        <td className="p-2 truncate">{item.unidade}</td>
                        <td className="p-2 truncate text-xs text-muted-foreground">
                          {item.cod_ref}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                disabled={status === 'uploading'}
                className="cursor-pointer"
              />
            </div>
            <Button
              variant="outline"
              onClick={downloadTemplate}
              disabled={status === 'uploading'}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Template
            </Button>
            <Button
              disabled={status === 'uploading' || status === 'success'}
              className="gap-2 min-w-32"
            >
              {status === 'uploading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Enviar
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Formatos aceitos: CSV, Excel (.xlsx, .xls). Máximo: 10.000 itens.
          </p>
        </div>
      </Card>
    </div>
  )
}
