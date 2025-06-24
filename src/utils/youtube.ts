/**
 * YouTube Utility Functions
 * Hilffunktionen für die Arbeit mit YouTube-URLs und Embeds
 */

/**
 * YouTube Video Metadaten Interface
 */
export interface YouTubeVideoInfo {
  videoId: string
  title: string
  description: string
  thumbnailUrl: string
  aspectRatio: number // width/height ratio (z.B. 1.78 für 16:9)
  orientation: 'landscape' | 'portrait' | 'square'
  width: number
  height: number
}

/**
 * Validiert ob eine URL eine gültige YouTube URL ist
 */
export function isValidYouTubeURL(url: string): boolean {
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+(&[\w=]*)*$/
  return youtubeRegex.test(url)
}

/**
 * Extrahiert die Video ID aus einer YouTube URL
 */
export function getYouTubeVideoId(url: string): string | null {
  const regexes = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  for (const regex of regexes) {
    const match = url.match(regex)
    if (match) {
      return match[1]
    }
  }
  return null
}

/**
 * Holt Video-Informationen von der YouTube oEmbed API
 */
export async function getYouTubeVideoInfo(videoId: string): Promise<YouTubeVideoInfo | null> {
  try {
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    const response = await fetch(oEmbedUrl)

    if (!response.ok) {
      console.warn(`YouTube oEmbed API error: ${response.status}`)
      return null
    }

    const data = await response.json()

    // Aspect Ratio berechnen
    const width = data.width || 1920
    const height = data.height || 1080
    const aspectRatio = width / height

    // Orientierung bestimmen
    let orientation: 'landscape' | 'portrait' | 'square'
    if (aspectRatio > 1.1) {
      orientation = 'landscape'
    } else if (aspectRatio < 0.9) {
      orientation = 'portrait'
    } else {
      orientation = 'square'
    }

    return {
      videoId,
      title: data.title || 'YouTube Video',
      description: data.author_name || '',
      thumbnailUrl: data.thumbnail_url || getYouTubeThumbnailUrl(videoId, 'maxres'),
      aspectRatio,
      orientation,
      width,
      height,
    }
  } catch (error) {
    console.error('Error fetching YouTube video info:', error)
    return null
  }
}

/**
 * Generiert eine YouTube Embed URL aus einer Video ID
 */
export function getYouTubeEmbedUrl(
  videoId: string,
  options?: {
    autoplay?: boolean
    mute?: boolean
    controls?: boolean
    start?: number
  },
): string {
  const params = new URLSearchParams()

  if (options?.autoplay) params.append('autoplay', '1')
  if (options?.mute) params.append('mute', '1')
  if (options?.controls === false) params.append('controls', '0')
  if (options?.start) params.append('start', options.start.toString())

  const queryString = params.toString()
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`
}

/**
 * Generiert eine YouTube Thumbnail URL aus einer Video ID
 */
export function getYouTubeThumbnailUrl(
  videoId: string,
  quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'maxres',
): string {
  const qualityMap = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg',
    high: 'hqdefault.jpg',
    standard: 'sddefault.jpg',
    maxres: 'maxresdefault.jpg',
  }

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`
}

/**
 * Typen für YouTube Media Items
 */
export interface YouTubeMediaItem {
  mediaType: 'youtube'
  youtubeUrl: string
  youtubeTitle?: string
  youtubeVideoId?: string
  youtubeEmbedUrl?: string
  youtubeThumbnailUrl?: string
  youtubeAspectRatio?: number
  youtubeOrientation?: 'landscape' | 'portrait' | 'square'
  youtubeWidth?: number
  youtubeHeight?: number
}

/**
 * Type Guard für YouTube Media Items
 */
export function isYouTubeMediaItem(item: any): item is YouTubeMediaItem {
  return item && item.mediaType === 'youtube' && typeof item.youtubeUrl === 'string'
}

/**
 * Berechnet CSS-Eigenschaften basierend auf dem Seitenverhältnis
 */
export function getAspectRatioStyles(aspectRatio: number, orientation: string) {
  const styles: React.CSSProperties = {
    aspectRatio: aspectRatio.toString(),
  }

  // Spezielle Behandlung für verschiedene Orientierungen
  if (orientation === 'portrait') {
    // Hochformat-Videos sollten nicht die volle Breite einnehmen
    styles.maxWidth = '60%'
    styles.margin = '0 auto'
  } else if (orientation === 'square') {
    // Quadratische Videos
    styles.maxWidth = '70%'
    styles.margin = '0 auto'
  }

  return styles
}

/**
 * Bestimmt responsive Größen basierend auf dem Seitenverhältnis
 */
export function getResponsiveVideoSize(aspectRatio: number, containerWidth: number = 1200) {
  const height = containerWidth / aspectRatio

  return {
    width: containerWidth,
    height: Math.round(height),
    aspectRatio,
  }
}
