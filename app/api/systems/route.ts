import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sheetId = process.env.GOOGLE_SHEETS_ID

    if (!sheetId) {
      return NextResponse.json([
        {
          name: 'Instagram AI Bot',
          status: 'pending',
          details: 'Configurar GOOGLE_SHEETS_ID'
        }
      ])
    }

    // Leer Instagram Comments sheet para ver actividad del bot
    const instagramUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=INSTAGRAM_COMMENTS`

    const instagramRes = await fetch(instagramUrl).catch(() => null)

    let instagramStatus = 'pending'
    let instagramDetails = 'Sin actividad reciente'

    if (instagramRes && instagramRes.ok) {
      const text = await instagramRes.text()
      const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/)
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[1])
        const rowCount = data.table.rows ? data.table.rows.length : 0
        if (rowCount > 0) {
          instagramStatus = 'running'
          instagramDetails = `${rowCount} comentarios analizados`
        }
      }
    }

    const systems = [
      {
        name: 'Instagram AI Bot',
        status: instagramStatus,
        lastCheck: 'hace 2 min',
        details: instagramDetails
      },
      {
        name: 'Email Triage',
        status: 'pending',
        details: 'Implementar siguiente'
      },
      {
        name: 'Content Engine',
        status: 'pending',
        details: 'Noticias tech automatizadas'
      }
    ]

    return NextResponse.json(systems)
  } catch (error) {
    console.error('Error fetching systems:', error)
    return NextResponse.json({ error: 'Failed to fetch systems' }, { status: 500 })
  }
}
