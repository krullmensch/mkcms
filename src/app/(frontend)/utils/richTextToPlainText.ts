/**
 * Konvertiert RichText-Inhalte von Payload CMS in normalen Text
 */

type RichTextNode = {
  type: string
  value?: {
    url?: string
    alt?: string
    [key: string]: any
  }
  children?: RichTextNode[]
  text?: string
  [key: string]: any
}

export function richTextToPlainText(content: any): string {
  if (!content) {
    return ''
  }

  if (typeof content === 'string') {
    return content
  }

  if (!Array.isArray(content)) {
    return ''
  }

  return content.map(node => nodeToPlainText(node)).join(' ').trim()
}

function nodeToPlainText(node: RichTextNode | string): string {
  if (typeof node === 'string') {
    return node
  }

  if (!node) {
    return ''
  }

  const { type, children, text } = node

  // Wenn der Node direkt Text enthält
  if (text) {
    return text
  }

  // Für Nodes mit Kindern, rekursiv verarbeiten
  if (children && Array.isArray(children)) {
    const childText = children.map(child => nodeToPlainText(child)).join('')
    
    // Füge Zeilenumbrüche für Block-Elemente hinzu
    if (['paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'].includes(type)) {
      return childText + '\n'
    }
    
    // Für Listen, füge Einrückung hinzu
    if (type === 'ul' || type === 'ol') {
      return childText + '\n'
    }
    
    return childText
  }

  return ''
}

/**
 * Begrenzt Text auf eine bestimmte Anzahl von Zeichen
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  
  return text.substring(0, maxLength).trim() + '...'
}
