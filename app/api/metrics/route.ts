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

    // Leer datos reales del Sheet "LEADS_PIPELINE"
    const leadsUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=LEADS_PIPELINE`

    // Leer datos del Sheet "EMAIL_AUTOMATION"
    const emailsUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=EMAIL_AUTOMATION`

    // Leer datos del Sheet "MEETINGS"
    const meetingsUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=MEETINGS`

    // Leer datos del Sheet "CONTENT_CALENDAR"
    const postsUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=CONTENT_CALENDAR`

    const [leadsRes, emailsRes, meetingsRes, postsRes] = await Promise.all([
      fetch(leadsUrl).catch(() => null),
      fetch(emailsUrl).catch(() => null),
      fetch(meetingsUrl).catch(() => null),
      fetch(postsUrl).catch(() => null)
    ])

    // Función para parsear la respuesta de Google Sheets
    const parseGoogleSheet = async (response: any) => {
      if (!response || !response.ok) return 0
      const text = await response.text()
      // Google devuelve JSONP, necesitamos extraer el JSON
      const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/)
      if (!jsonMatch) return 0
      const data = JSON.parse(jsonMatch[1])
      // Contar filas (excluir header)
      return data.table.rows ? data.table.rows.length : 0
    }

    const leads = await parseGoogleSheet(leadsRes)
    const emails = await parseGoogleSheet(emailsRes)
    const meetings = await parseGoogleSheet(meetingsRes)
    const posts = await parseGoogleSheet(postsRes)

    return NextResponse.json({ leads, emails, meetings, posts })
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json({ 
      leads: 0, emails: 0, meetings: 0, posts: 0,
      error: 'Failed to fetch metrics' 
    }, { status: 500 })
  }
}
