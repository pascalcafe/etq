import { NextRequest, NextResponse } from 'next/server'

interface MenuItem {
  nome: string
  grupo: string
  valor: string
  unidade: string
  cod_ref: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, items } = body as { tenantId: string; items: MenuItem[] }

    if (!tenantId) {
      return NextResponse.json(
        { success: false, message: 'tenant_id ausente' },
        { status: 400 }
      )
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Nenhum item fornecido' },
        { status: 400 }
      )
    }

    // Validate each item
    const errors: string[] = []
    const validItems: MenuItem[] = []

    items.forEach((item, index) => {
      if (!item.nome?.trim()) {
        errors.push(`Item ${index + 1}: nome obrigatório`)
        return
      }
      if (!item.grupo?.trim()) {
        errors.push(`Item ${index + 1}: grupo obrigatório`)
        return
      }
      if (!item.valor?.trim()) {
        errors.push(`Item ${index + 1}: valor obrigatório`)
        return
      }
      if (!item.unidade?.trim()) {
        errors.push(`Item ${index + 1}: unidade obrigatória`)
        return
      }
      if (!item.cod_ref?.trim()) {
        errors.push(`Item ${index + 1}: cod_ref obrigatório`)
        return
      }

      // Validate valor is a number
      const valor = parseFloat(item.valor)
      if (isNaN(valor)) {
        errors.push(`Item ${index + 1}: valor deve ser um número`)
        return
      }

      validItems.push(item)
    })

    if (validItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nenhum item válido encontrado',
          errors,
        },
        { status: 400 }
      )
    }

    // In production, save to database here
    // For now, just return success
    console.log(`[v0] ${validItems.length} items imported for tenant ${tenantId}`)

    return NextResponse.json({
      success: true,
      message: `${validItems.length} itens importados com sucesso`,
      importedCount: validItems.length,
      items: validItems,
      warnings: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('[v0] Import error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao processar importação',
      },
      { status: 500 }
    )
  }
}
