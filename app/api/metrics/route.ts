import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sheetId = process.env.GOOGLE_SHEETS_ID
    
    if (!sheetId) {
      return NextResponse.json({
        leads: 0,
        emails: 0,
        meetings: 0,
        posts: 0,
        error: 'GOOGLE_SHEETS_ID not configured'
      })
    }

    // TODO: Implementar conexión a Google Sheets API
    // Por ahora, retornamos datos de ejemplo
    return NextResponse.json({
      leads: 12,
      emails: 45,
      meetings: 3,
      posts: 8
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}
