'use client'

import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    leads: 0, emails: 0, meetings: 0, posts: 0
  })
  const [systems, setSystems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [metricsRes, systemsRes] = await Promise.all([
          fetch('/api/metrics'),
          fetch('/api/systems')
        ])
        const metricsData = await metricsRes.json()
        const systemsData = await systemsRes.json()
        setMetrics(metricsData)
        setSystems(systemsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">👑 El Rey de las Páginas</h1>
          <p className="text-gray-600 mt-2">Command Center - 🔁 Datos en tiempo real</p>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <MetricCard title="🔥 Leads" value={metrics.leads} change="+3 hoy" color="red" />
          <MetricCard title="📧 Emails" value={metrics.emails} change="+12 hoy" color="blue" />
          <MetricCard title="📅 Meetings" value={metrics.meetings} change="mañana" color="green" />
          <MetricCard title="📱 Posts" value={metrics.posts} change="semana" color="purple" />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🤖 Sistemas Activos</h2>
          {systems.map((system, idx) => (
            <SystemStatus key={idx} {...system} />
          ))}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, color }: any) {
  const colors: any = {
    red: 'bg-red-50 text-red-700',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700'
  }
  return (
    <div className={`${colors[color]} rounded-lg p-6`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-sm mt-1">{change}</p>
    </div>
  )
}

function SystemStatus({ name, status, lastCheck, details }: any) {
  const statusLabels: any = { running: '🟢 RUNNING', pending: '⚪ PENDIENTE' }
  return (
    <div className="border-b last:border-0 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          {lastCheck && <p className="text-sm text-gray-500">└─ {lastCheck}</p>}
          <p className="text-sm text-gray-600">└─ {details}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-sm font-medium">{statusLabels[status]}</span>
      </div>
    </div>
  )
}
