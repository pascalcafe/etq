import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()
    const file = formData.get('file') as File
    const tenantId = formData.get('tenantId') as string

    if (!file || !tenantId) {
      return NextResponse.json(
        { message: 'File and tenantId required' },
        { status: 400 }
      )
    }

    // Read file content
    const content = await file.text()
    const lines = content.split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())

    // Validate required columns
    const requiredColumns = ['name', 'ean']
    const missingColumns = requiredColumns.filter(col => !headers.includes(col))

    if (missingColumns.length > 0) {
      return NextResponse.json(
        { message: `Missing columns: ${missingColumns.join(', ')}` },
        { status: 400 }
      )
    }

    // Parse and create products
    const products = []
    let importedCount = 0

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(',').map(v => v.trim())
      const row: any = {}

      headers.forEach((header, idx) => {
        row[header] = values[idx] || null
      })

      // Create product object
      const product = {
        tenant_id: tenantId,
        name: row.name,
        ean: row.ean || null,
        brand: row.brand || null,
        manufacturer_name: row.manufacturer_name || null,
        net_quantity: row.net_quantity ? parseFloat(row.net_quantity) : null,
        sugar_g: row.sugar_g ? parseFloat(row.sugar_g) : null,
        sodium_mg: row.sodium_mg ? parseFloat(row.sodium_mg) : null,
        saturated_fat_g: row.saturated_fat_g ? parseFloat(row.saturated_fat_g) : null,
      }

      products.push(product)
    }

    // Insert products into database
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select()

    if (error) throw error

    return NextResponse.json({
      success: true,
      imported: data?.length || 0,
      total: products.length,
    })
  } catch (error) {
    console.error('[v0] Product import error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 }
    )
  }
}
