'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Upload, AlertCircle, CheckCircle2, FileText, X } from 'lucide-react'
import Papa from 'papaparse'

interface Item {
  nome: string
  grupo: string
  valor: string | number
  unidade: string
  cod_ref: string
}

interface ItemsUploaderProps {
  tenantId: string
  onSuccess?: (items: Item[]) => void
}

export function ItemsUploader({
  tenantId,
  onSuccess,
}: ItemsUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<Item[]>([])
  const [status, setStatus] = useState<
    'idle' | 'parsing' | 'uploading' | 'success' | 'error'
  >('idle')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [importedItems, setImportedItems] = useState<Item[]>([])

  const requiredColumns: (keyof Item)[] = [
    'nome',
    'grupo',
    'valor',
    'unidade',
    'cod_ref',
  ]

  const aliases: Record<string, keyof Item> = {
    nome: 'nome',
    produto: 'nome',
    product: 'nome',
    item: 'nome',
    descricao: 'nome',
    descrição: 'nome',

    grupo: 'grupo',
    categoria: 'grupo',
    category: 'grupo',
    tipo: 'grupo',

    valor: 'valor',
    preco: 'valor',
    preço: 'valor',
    price: 'valor',
    valor_unitario: 'valor',

    unidade: 'unidade',
    un: 'unidade',
    und: 'unidade',
    unit: 'unidade',

    cod_ref: 'cod_ref',
    codigo_ref: 'cod_ref',
    codigo: 'cod_ref',
    referencia: 'cod_ref',
    referência: 'cod_ref',
    sku: 'cod_ref',
  }

  const normalize = (text: string) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+/, '')
      .replace(/_+$/, '')
  }

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    setFile(selectedFile)
    setStatus('parsing')
    setError('')

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const rows = results.data as Record<string, any>[]

        if (!rows.length) {
          setError('Arquivo vazio.')
          setStatus('error')
          return
        }

        const originalHeaders = Object.keys(rows[0])

        const headerMap: Record<string, keyof Item> = {}

        originalHeaders.forEach((header) => {
          const normalized = normalize(header)

          if (aliases[normalized]) {
            headerMap[header] = aliases[normalized]
            return
          }

          if (
            requiredColumns.includes(
              normalized as keyof Item
            )
          ) {
            headerMap[header] =
              normalized as keyof Item
          }
        })

        const found = new Set(
          Object.values(headerMap)
        )

        const missing = requiredColumns.filter(
          (column) => !found.has(column)
        )

        if (missing.length) {
          setError(
            `Colunas obrigatórias faltando: ${missing.join(
              ', '
            )}\n\nColunas encontradas:\n${originalHeaders.join(
              ', '
            )}`
          )

          setStatus('error')
          return
        }

        const mapped: Item[] = rows.map((row) => {
          const item = {} as Item

          Object.entries(headerMap).forEach(
            ([original, mappedColumn]) => {
              item[mappedColumn] =
                row[original] ?? ''
            }
          )

          return item
        })

        setImportedItems(mapped)
        setPreview(mapped.slice(0, 5))
        setStatus('idle')
      },

      error: (err) => {
        setError(err.message)
        setStatus('error')
      },
    })
  }
    const handleUpload = async () => {
    if (importedItems.length === 0) return

    setStatus('uploading')
    setProgress(0)

    try {
      const chunkSize = 100
      const totalChunks = Math.ceil(importedItems.length / chunkSize)

      for (let i = 0; i < totalChunks; i++) {
        const chunk = importedItems.slice(
          i * chunkSize,
          (i + 1) * chunkSize
        )

        const response = await fetch('/api/items/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tenantId,
            items: chunk,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()

          throw new Error(
            errorData.message ??
              'Erro ao importar itens.'
          )
        }

        setProgress(
          Math.round(((i + 1) / totalChunks) * 100)
        )
      }

      setStatus('success')

      const imported = [...importedItems]

      setTimeout(() => {
        setFile(null)
        setPreview([])
        setImportedItems([])
        setProgress(0)
        setStatus('idle')

        onSuccess?.(imported)
      }, 1500)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro desconhecido.'
      )

      setStatus('error')
    }
  }

  const handleClear = () => {
    setFile(null)
    setPreview([])
    setImportedItems([])
    setError('')
    setProgress(0)
    setStatus('idle')
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">
              Importar Itens
            </h3>

            <p className="text-sm text-muted-foreground mb-4">
              Faça upload de um CSV ou Excel contendo os
              produtos.
            </p>

            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="mb-2 text-xs font-semibold text-blue-900">
                Colunas obrigatórias
              </p>

              <p className="text-xs text-blue-700">
                Nome • Grupo • Valor • Unidade • Cód.
                Ref.
              </p>
            </div>

            <div className="flex gap-2">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                disabled={status === 'uploading'}
                onChange={handleFileSelect}
                className="flex-1"
              />

              {file && (
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={status === 'uploading'}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              <Button
                onClick={handleUpload}
                disabled={
                  importedItems.length === 0 ||
                  status === 'uploading'
                }
              >
                <Upload className="mr-2 h-4 w-4" />

                {status === 'uploading'
                  ? 'Enviando...'
                  : 'Importar'}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-4 flex gap-2 rounded-lg bg-green-100 p-3 text-sm text-green-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              {importedItems.length} itens importados com
              sucesso.
            </span>
          </div>
        )}

        {status === 'uploading' && (
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-xs">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}
      </Card>

      {preview.length > 0 && (
        <Card className="p-6">
          <h4 className="mb-4 flex items-center gap-2 font-semibold">
            <FileText className="h-4 w-4" />

            Prévia ({preview.length} de{' '}
            {importedItems.length})
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-3 py-2 text-left">
                    Nome
                  </th>

                  <th className="px-3 py-2 text-left">
                    Grupo
                  </th>

                  <th className="px-3 py-2 text-left">
                    Valor
                  </th>

                  <th className="px-3 py-2 text-left">
                    Unidade
                  </th>

                  <th className="px-3 py-2 text-left">
                    Cód. Ref.
                  </th>
                </tr>
              </thead>

              <tbody>
                {preview.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="px-3 py-2">
                      {item.nome}
                    </td>

                    <td className="px-3 py-2">
                      {item.grupo}
                    </td>

                    <td className="px-3 py-2">
                      {item.valor}
                    </td>

                    <td className="px-3 py-2">
                      {item.unidade}
                    </td>

                    <td className="px-3 py-2">
                      {item.cod_ref}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {importedItems.length > preview.length && (
            <p className="mt-3 text-xs text-muted-foreground">
              ... e mais{' '}
              {importedItems.length - preview.length}{' '}
              itens.
            </p>
          )}
        </Card>
      )}
    </div>
  )
}