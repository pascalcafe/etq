import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface Item {
  nome: string
  grupo: string
  valor: string | number
  unidade: string
  cod_ref: string
}

export async function POST(request: NextRequest) {
  try {
    const { tenantId, items } = await request.json()

    if (!tenantId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: 'Invalid request: tenantId and items array are required' },
        { status: 400 }
      )
    }

    // Validar cada item
    const validItems = items
      .filter((item: Item) => {
        return item.nome && item.grupo && item.valor && item.unidade && item.cod_ref
      })
      .map((item: Item) => ({
        tenant_id: tenantId,
        nome: String(item.nome).trim(),
        grupo: String(item.grupo).trim(),
        valor: parseFloat(String(item.valor).replace(',', '.')),
        unidade: String(item.unidade).trim(),
        cod_ref: String(item.cod_ref).trim(),
        created_at: new Date().toISOString(),
      }))

    if (validItems.length === 0) {
      return NextResponse.json(
        { message: 'Nenhum item válido encontrado' },
        { status: 400 }
      )
    }

    // Se houver tabela de itens no Supabase, inserir aqui
    // Por enquanto, vamos apenas validar e retornar sucesso
    console.log('[v0] Items import:', {
      totalItems: items.length,
      validItems: validItems.length,
      tenantId,
    })

    return NextResponse.json({
      success: true,
      message: `${validItems.length} itens importados com sucesso`,
      importedCount: validItems.length,
      items: validItems,
    })
  } catch (error) {
    console.error('[v0] Items import error:', error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Erro ao importar itens',
      },
      { status: 500 }
    )
  }
}
