# YouTube Video Integration

Diese Dokumentation beschreibt die YouTube-Video-Integration für das Portfolio CMS.

## Funktionalität

Das CMS unterstützt jetzt YouTube-Videos als Medientyp neben Fotos und Videos. Wenn Sie ein YouTube-Video zu einem Projekt hinzufügen, werden automatisch folgende Informationen extrahiert und gespeichert:

- **YouTube Video ID**: Extrahiert aus der URL
- **Embed URL**: Optimiert für die Einbettung
- **Thumbnail URL**: Hochauflösendes Vorschaubild

## Verwendung im Admin-Panel

1. **Projekt erstellen/bearbeiten**
2. **Medien hinzufügen**
3. **Medientyp wählen**: "YouTube Video"
4. **YouTube URL eingeben**: Vollständige YouTube-URL (z.B. `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
5. **Optional: Video Titel** eingeben für bessere Beschreibung

### Unterstützte URL-Formate

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- Mit zusätzlichen Parametern: `https://www.youtube.com/watch?v=VIDEO_ID&t=30s`

## Frontend-Integration

### Beispiel: YouTube-Video in React-Komponente

```tsx
import { isYouTubeMediaItem } from '@/utils/youtube';

function ProjectMedia({ mediaItem }: { mediaItem: any }) {
  if (isYouTubeMediaItem(mediaItem)) {
    return (
      <div className="youtube-video">
        <iframe
          src={mediaItem.youtubeEmbedUrl}
          title={mediaItem.youtubeTitle || 'YouTube Video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-64 rounded-lg"
        />
      </div>
    );
  }
  
  // Andere Medientypen...
  return null;
}
```

### Beispiel: Thumbnail-Vorschau

```tsx
function ProjectThumbnail({ mediaItem }: { mediaItem: any }) {
  if (isYouTubeMediaItem(mediaItem)) {
    return (
      <div className="relative">
        <img
          src={mediaItem.youtubeThumbnailUrl}
          alt={mediaItem.youtubeTitle || 'YouTube Video'}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    );
  }
  
  return null;
}
```

## Verfügbare Utility-Funktionen

### `isValidYouTubeURL(url: string): boolean`
Validiert, ob eine URL eine gültige YouTube-URL ist.

### `getYouTubeVideoId(url: string): string | null`
Extrahiert die Video-ID aus einer YouTube-URL.

### `getYouTubeEmbedUrl(videoId: string, options?: {...}): string`
Generiert eine optimierte Embed-URL mit optionalen Parametern:
- `autoplay`: Automatisches Abspielen
- `mute`: Stumm schalten
- `controls`: Steuerelemente anzeigen/verbergen
- `start`: Startzeit in Sekunden

### `getYouTubeThumbnailUrl(videoId: string, quality?: string): string`
Generiert eine Thumbnail-URL in verschiedenen Qualitätsstufen:
- `default`: 120x90
- `medium`: 320x180
- `high`: 480x360
- `standard`: 640x480
- `maxres`: 1280x720 (falls verfügbar)

## Datenbankstruktur

Jedes YouTube-Media-Item wird mit folgenden Feldern gespeichert:

```typescript
interface YouTubeMediaItem {
  mediaType: 'youtube';
  youtubeUrl: string;           // Original URL
  youtubeTitle?: string;        // Optional: Titel
  youtubeVideoId?: string;      // Automatisch extrahiert
  youtubeEmbedUrl?: string;     // Automatisch generiert
  youtubeThumbnailUrl?: string; // Automatisch generiert
}
```

## Tags

Projekte mit YouTube-Videos können mit dem Tag "YouTube" versehen werden, um sie leichter zu filtern und zu kategorisieren.

## Validation

- YouTube-URLs werden automatisch validiert
- Fehlerhafte URLs werden mit einer aussagekräftigen Fehlermeldung abgelehnt
- Video-IDs werden automatisch extrahiert und validiert

## Performance-Tipps

1. **Lazy Loading**: Laden Sie YouTube-Videos erst bei Bedarf
2. **Thumbnail-Vorschau**: Verwenden Sie Thumbnails für bessere Ladezeiten
3. **Autoplay**: Verwenden Sie Autoplay sparsam (nur bei Nutzerinteraktion)
4. **Responsive Design**: Stellen Sie sicher, dass Embeds responsive sind

## Beispiel-Implementierung

```tsx
// Vollständige Komponente für YouTube-Video-Handling
function YouTubePlayer({ 
  videoId, 
  title, 
  autoplay = false, 
  mute = false 
}: {
  videoId: string;
  title?: string;
  autoplay?: boolean;
  mute?: boolean;
}) {
  const embedUrl = getYouTubeEmbedUrl(videoId, { autoplay, mute });
  
  return (
    <div className="relative w-full pb-56.25 h-0 overflow-hidden">
      <iframe
        src={embedUrl}
        title={title || 'YouTube Video'}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
```
