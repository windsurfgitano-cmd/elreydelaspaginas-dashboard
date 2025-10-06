
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'El Rey de las Páginas - Command Center',
  description: 'Dashboard de automatización y gestión',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
