'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Upload, AlertCircle, CheckCircle2, FileText } from 'lucide-react'
import Papa from 'papaparse'

interface ProductUploadProps {
  tenantId: string
  onSuccess?: () => void
}

export function ProductUploader({ tenantId, onSuccess }: ProductUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [status, setStatus] = useState<'idle' | 'parsing' | 'uploading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string>('')
  const [progress, setProgress] = useState(0)

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

        // Validar colunas esperadas
        const requiredColumns = ['name', 'ean']
        const headers = Object.keys(results.data[0] || {})
        const missingColumns = requiredColumns.filter(col => !headers.includes(col))

        if (missingColumns.length > 0) {
          setError(
            `Colunas obrigatórias faltando: ${missingColumns.join(', ')}. Esperadas: ${requiredColumns.join(', ')}`
          )
          setStatus('error')
          return
        }

        setPreview(results.data.slice(0, 5))
        setStatus('idle')
      },
      error: (error) => {
        setError(`Erro ao ler arquivo: ${error.message}`)
        setStatus('error')
      },
    })
  }

  const handleUpload = async () => {
    if (!file || preview.length === 0) return

    setStatus('uploading')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('tenantId', tenantId)

    try {
      const response = await fetch('/api/products/import', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao fazer upload')
      }

      const result = await response.json()
      setStatus('success')
      setProgress(100)
      setFile(null)
      setPreview([])

      setTimeout(() => {
        setStatus('idle')
        onSuccess?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setStatus('error')
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Importar Produtos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Faça upload de um arquivo CSV ou Excel com seus produtos. Colunas obrigatórias: name, ean
            </p>

            <div className="flex gap-2">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                disabled={status === 'uploading'}
                className="flex-1"
              />
              <Button
                onClick={handleUpload}
                disabled={!file || status === 'uploading' || status === 'success'}
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
            <span>Produtos importados com sucesso!</span>
          </div>
        )}

        {progress > 0 && status === 'uploading' && (
          <div className="mt-4">
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
            Prévia dos Dados ({preview.length} linhas)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {Object.keys(preview[0] || {}).map(col => (
                    <th key={col} className="py-2 px-3 text-left font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    {Object.values(row as Record<string, any>).map((val, cidx) => (
                      <td key={cidx} className="py-2 px-3 text-muted-foreground">
                        {String(val).substring(0, 30)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
