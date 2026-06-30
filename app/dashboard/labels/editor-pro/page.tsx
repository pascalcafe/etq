'use client'

import { Suspense } from 'react'
import { ProLabelEditor } from '@/components/pro-label-editor'
import { useRouter, useSearchParams } from 'next/navigation'

function EditorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')
  const productId = searchParams.get('productId')

  return (
    <ProLabelEditor
      templateId={templateId || undefined}
      productId={productId || undefined}
      onClose={() => router.back()}
      onSave={async () => {
        // Implement save logic
        console.log('[v0] Saving editor layout')
      }}
    />
  )
}

export default function EditorProPage() {
  return (
    <Suspense fallback={<div>Carregando editor...</div>}>
      <EditorContent />
    </Suspense>
  )
}
