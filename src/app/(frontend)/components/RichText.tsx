'use client'

import React from 'react'
import escapeHTML from 'escape-html'

// Hilfsfunktion: Extrahiert Dateinamen aus URL für Alt-Text
const getFileNameFromUrl = (url: string): string => {
  try {
    const fileName = url.split('/').pop()?.split('?')[0] || 'Bild'
    // Entferne Dateiendung und ersetze Unterstriche/Bindestriche durch Leerzeichen
    return fileName
      .replace(/\.[^/.]+$/, '') // Entferne Dateiendung
      .replace(/[_-]/g, ' ') // Ersetze _ und - durch Leerzeichen
      .replace(/\b\w/g, (l) => l.toUpperCase()) // Kapitalisiere jeden Wortanfang
  } catch {
    return 'Bild'
  }
}

// Hilfsfunktion: Generiert Alt-Text basierend auf vorhandenem Text oder Dateinamen
const generateAltText = (existingAlt: string | undefined, url: string): string => {
  if (existingAlt && existingAlt.trim()) {
    return existingAlt
  }

  return getFileNameFromUrl(url)
}

type Node = {
  type: string
  value?: {
    url?: string
    alt?: string
    [key: string]: any
  }
  children?: Node[]
  text?: string
  [key: string]: any
}

export const RichText: React.FC<{ content: any }> = ({ content }) => {
  if (!content) {
    return null
  }

  if (!Array.isArray(content)) {
    return null
  }

  return (
    <>
      {content.map((node, i) => {
        if (typeof node === 'string') {
          return (
            <p key={i} className="my-4">
              {node}
            </p>
          )
        }

        if (!node) {
          return null
        }

        const { type, value, children, text } = node

        switch (type) {
          case 'h1':
            return (
              <h1 key={i} className="text-3xl font-bold my-4">
                {serialize(children, i)}
              </h1>
            )

          case 'h2':
            return (
              <h2 key={i} className="text-2xl font-bold my-4">
                {serialize(children, i)}
              </h2>
            )

          case 'h3':
            return (
              <h3 key={i} className="text-xl font-bold my-3">
                {serialize(children, i)}
              </h3>
            )

          case 'h4':
            return (
              <h4 key={i} className="text-lg font-bold my-3">
                {serialize(children, i)}
              </h4>
            )

          case 'h5':
            return (
              <h5 key={i} className="text-base font-bold my-2">
                {serialize(children, i)}
              </h5>
            )

          case 'h6':
            return (
              <h6 key={i} className="text-sm font-bold my-2">
                {serialize(children, i)}
              </h6>
            )

          case 'paragraph':
            return (
              <p key={i} className="my-4">
                {serialize(children, i)}
              </p>
            )

          case 'ul':
            return (
              <ul key={i} className="list-disc pl-6 my-4">
                {serialize(children, i)}
              </ul>
            )

          case 'ol':
            return (
              <ol key={i} className="list-decimal pl-6 my-4">
                {serialize(children, i)}
              </ol>
            )

          case 'li':
            return (
              <li key={i} className="my-1">
                {serialize(children, i)}
              </li>
            )

          case 'link':
            if (value?.url) {
              return (
                <a
                  key={i}
                  href={value.url}
                  target={value.newTab ? '_blank' : undefined}
                  rel={value.newTab ? 'noopener noreferrer' : undefined}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {serialize(children, i)}
                </a>
              )
            }
            return null

          case 'upload':
            if (value?.id) {
              const imageUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/media/${value.filename}`
              return (
                <div key={i} className="my-4">
                  <img
                    src={imageUrl}
                    alt={generateAltText(value.alt, imageUrl)}
                    className="max-w-full h-auto rounded"
                  />
                </div>
              )
            }
            return null

          case 'blockquote':
            return (
              <blockquote key={i} className="border-l-4 border-gray-300 pl-4 my-4 italic">
                {serialize(children, i)}
              </blockquote>
            )

          default:
            if (text) {
              return <span key={i}>{escapeHTML(text)}</span>
            }

            if (children) {
              return <span key={i}>{serialize(children, i)}</span>
            }

            return null
        }
      })}
    </>
  )
}

const serialize = (nodes: Node[] = [], index?: number) => {
  if (!Array.isArray(nodes)) {
    return null
  }

  return (
    <>
      {nodes.map((node, i) => {
        if (typeof node === 'string') {
          return <React.Fragment key={i}>{node}</React.Fragment>
        }

        if (!node) {
          return null
        }

        const { type, value, children, text } = node

        switch (type) {
          case 'bold':
            return (
              <strong key={i} className="font-bold">
                {serialize(children, i)}
              </strong>
            )

          case 'italic':
            return (
              <em key={i} className="italic">
                {serialize(children, i)}
              </em>
            )

          case 'underline':
            return (
              <u key={i} className="underline">
                {serialize(children, i)}
              </u>
            )

          case 'strikethrough':
            return (
              <s key={i} className="line-through">
                {serialize(children, i)}
              </s>
            )

          case 'code':
            return (
              <code key={i} className="bg-gray-100 px-1 py-0.5 rounded font-mono text-sm">
                {serialize(children, i)}
              </code>
            )

          default:
            if (text) {
              return <React.Fragment key={i}>{escapeHTML(text)}</React.Fragment>
            }

            if (children) {
              return <React.Fragment key={i}>{serialize(children, i)}</React.Fragment>
            }

            return null
        }
      })}
    </>
  )
}
