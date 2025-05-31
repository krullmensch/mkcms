import React from 'react'
import './styles.css'
import { ThemeProvider } from './context/ThemeContext'

export const metadata = {
  description: 'Portfolio von Marvin Krullmann - Kreative Projekte und Arbeiten',
  title: 'Marvin Krullmann | Portfolio',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="de">
      <body>
        <ThemeProvider>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
