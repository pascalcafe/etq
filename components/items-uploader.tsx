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

export function ItemsUploader({ tenantId, onSuccess }: ItemsUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<Item[]>([])
  const [status, setStatus] = useState<'idle' | 'parsing' | 'uploading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const [importedItems, setImportedItems] = useState<Item[]>([])

 // const requiredColumns = ['nome', 'grupo', 'valor', 'unidade', 'cod_ref']

  const normalizeHeaders = (headers: string[]): string[] => {
    return headers.map(h =>
      h
        .toLowerCase()
        .trim()
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ç/g, 'c')
        .replace(/^_+|_+$/g, "")
        .replace(/[^a-z0-9]/g, '_')
    )
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setStatus('parsing')
    setError('')

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setError('Arquivo vazio ou formato inválido')
          setStatus('error')
          return
        }

        // Normalizar headers
        const originalHeaders = Object.keys(results.data[0] || {})
        const normalizedHeaders = normalizeHeaders(originalHeaders)

        // Criar mapa de mapeamento
        const headerMap: Record<string, string> = {}
        originalHeaders.forEach((original, idx) => {
          headerMap[original] = normalizedHeaders[idx]
        })

        // Validar colunas esperadas
        const missingColumns = requiredColumns.filter(col =>
          !Object.values(headerMap).includes(col)
        )

        if (missingColumns.length > 0) {
          setError(
            `Colunas obrigatórias faltando: ${missingColumns.join(', ')}. Colunas encontradas: ${Object.keys(results.data[0] || {}).join(', ')}`
          )
          setStatus('error')
          return
        }

        // Mapear dados
        const mappedData = results.data.map((row: any) => {
          const mappedRow: any = {}
          Object.entries(headerMap).forEach(([original, normalized]) => {
            if (requiredColumns.includes(normalized)) {
              mappedRow[normalized] = row[original] || ''
            }
          })
          return mappedRow as Item
        })

        setPreview(mappedData.slice(0, 5))
        setImportedItems(mappedData)
        setStatus('idle')
      },
      error: (error) => {
        setError(`Erro ao ler arquivo: ${error.message}`)
        setStatus('error')
      },
    })
  }

  const handleUpload = async () => {
    if (importedItems.length === 0) return

    setStatus('uploading')

    try {
      // Simular envio em chunks
      const chunkSize = 100
      const totalChunks = Math.ceil(importedItems.length / chunkSize)

      for (let i = 0; i < totalChunks; i++) {
        const chunk = importedItems.slice(i * chunkSize, (i + 1) * chunkSize)
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
          throw new Error(errorData.message || 'Erro ao fazer upload')
        }

        // Atualizar progresso
        setProgress(Math.round(((i + 1) / totalChunks) * 100))
      }

      setStatus('success')
      setFile(null)
      setPreview([])

      setTimeout(() => {
        setStatus('idle')
        setProgress(0)
        setImportedItems([])
        onSuccess?.(importedItems)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setStatus('error')
    }
  }

  const handleClear = () => {
    setFile(null)
    setPreview([])
    setImportedItems([])
    setStatus('idle')
    setError('')
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Importar Itens de Cardápio</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Faça upload de um arquivo CSV ou Excel com seus itens.
            </p>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-medium text-blue-900 mb-2">Colunas obrigatórias:</p>
              <p className="text-xs text-blue-800">
                Nome • Grupo • Valor • Unidade • Cód. Ref.
              </p>
            </div>

            <div className="flex gap-2">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                disabled={status === 'uploading'}
                className="flex-1"
              />
              {file && (
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={status === 'uploading'}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={handleUpload}
                disabled={importedItems.length === 0 || status === 'uploading' || status === 'success'}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {status === 'uploading' ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-4 flex gap-2 rounded-lg bg-green-100 p-3 text-sm text-green-800">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{importedItems.length} itens importados com sucesso!</span>
          </div>
        )}

        {progress > 0 && status === 'uploading' && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium">Progresso do upload</span>
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-lg bg-muted">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </Card>

      {preview.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            Prévia dos Dados ({importedItems.length} itens total, mostrando {preview.length})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="py-2 px-3 text-left font-semibold">Nome</th>
                  <th className="py-2 px-3 text-left font-semibold">Grupo</th>
                  <th className="py-2 px-3 text-left font-semibold">Valor</th>
                  <th className="py-2 px-3 text-left font-semibold">Unidade</th>
                  <th className="py-2 px-3 text-left font-semibold">Cód. Ref.</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-slate-50">
                    <td className="py-2 px-3 text-muted-foreground font-medium">{item.nome}</td>
                    <td className="py-2 px-3 text-muted-foreground">{item.grupo}</td>
                    <td className="py-2 px-3 text-muted-foreground">
                      {typeof item.valor === 'string' ? item.valor : item.valor.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">{item.unidade}</td>
                    <td className="py-2 px-3 text-muted-foreground">{item.cod_ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {importedItems.length > 5 && (
            <p className="text-xs text-muted-foreground mt-3">
              ... e mais {importedItems.length - 5} itens
            </p>
          )}
        </Card>
      )}
    </div>
  )
}
