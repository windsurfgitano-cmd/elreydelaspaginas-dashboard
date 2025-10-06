import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // TODO: Conectar a Base de Datos o Sheets para estado real de sistemas
    const systems = [
      {
        name: 'Instagram AI Bot',
        status: 'running',
        lastCheck: 'hace 2 min',
        details: '3 comentarios analizados hoy'
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
    return NextResponse.json({ error: 'Failed to fetch systems' }, { status: 500 })
  }
}
