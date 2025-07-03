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
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Questrial&display=swap"
        />
      </head>
      <body>
        <ThemeProvider>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
