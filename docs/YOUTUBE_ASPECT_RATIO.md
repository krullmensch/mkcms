# YouTube Seitenverhältnis Guide

Die YouTube-Integration unterstützt jetzt automatische Seitenverhältnis-Erkennung für eine optimale Darstellung verschiedener Video-Formate.

## Automatische Erkennung

Wenn Sie eine YouTube-URL hinzufügen, werden automatisch folgende Informationen abgerufen:

### Video-Metadaten
- **Titel**: Automatisch aus YouTube-Metadaten
- **Seitenverhältnis**: Berechnet aus Breite/Höhe (z.B. 1.78 für 16:9)
- **Orientierung**: Automatisch bestimmt basierend auf Seitenverhältnis
- **Dimensionen**: Originalbreite und -höhe in Pixeln
- **Thumbnail**: Hochauflösendes Vorschaubild

### Orientierungen

#### 🖥️ Querformat (Landscape)
- **Seitenverhältnis**: > 1.1 (z.B. 16:9 = 1.78)
- **Typische Formate**: 16:9, 21:9, 4:3
- **Darstellung**: Volle Breite des Containers
- **Beispiele**: Standard YouTube-Videos, Filme, Gaming-Content

#### 📱 Hochformat (Portrait)
- **Seitenverhältnis**: < 0.9 (z.B. 9:16 = 0.56)
- **Typische Formate**: 9:16, 3:4
- **Darstellung**: Begrenzte Breite (60% des Containers)
- **Beispiele**: TikTok-Style Videos, Smartphone-Aufnahmen, Stories

#### ⏹️ Quadratisch (Square)
- **Seitenverhältnis**: 0.9 - 1.1 (z.B. 1:1 = 1.0)
- **Typische Formate**: 1:1
- **Darstellung**: Begrenzte Breite (70% des Containers)
- **Beispiele**: Instagram-Posts, Profilvideos

## Responsive Verhalten

### Desktop (> 768px)
- **Querformat**: 100% Breite
- **Hochformat**: 60% Breite, zentriert
- **Quadratisch**: 70% Breite, zentriert

### Tablet (≤ 768px)
- **Querformat**: 100% Breite
- **Hochformat**: 80% Breite, zentriert
- **Quadratisch**: 85% Breite, zentriert

### Mobile (≤ 480px)
- **Querformat**: 100% Breite
- **Hochformat**: 90% Breite, zentriert
- **Quadratisch**: 95% Breite, zentriert

## CSS Implementierung

Das System verwendet CSS `aspect-ratio` in Kombination mit dynamischen Custom Properties:

```css
.youtube-container {
  aspect-ratio: var(--aspect-ratio, 16/9);
}

.youtube-container.portrait {
  max-width: 60%;
  margin: 0 auto;
}
```

## Beispiel-URLs zum Testen

### Querformat (16:9)
- Standard YouTube-Video: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Gaming-Content: `https://www.youtube.com/watch?v=fC7oUOUEEi4`

### Hochformat (9:16)
- Shorts/Vertikale Videos: `https://www.youtube.com/shorts/[VIDEO_ID]`

### Verschiedene Formate
- 21:9 Ultrawide: Cinematic Content
- 4:3 Legacy: Ältere Videos

## Fallback-Verhalten

Falls die YouTube API nicht erreichbar ist oder keine Metadaten liefert:
- **Standard-Seitenverhältnis**: 16:9
- **Standard-Orientierung**: landscape
- **Standard-Dimensionen**: 1920x1080

## Debugging

Im Admin-Panel werden die erkannten Werte angezeigt:
- Seitenverhältnis (als Dezimalzahl)
- Orientierung (landscape/portrait/square)
- Originalbreite und -höhe
- Thumbnail-URL

Diese Felder sind schreibgeschützt und werden automatisch befüllt.

## Performance

- **API-Aufrufe**: Nur beim Speichern, nicht bei jedem Laden
- **Caching**: Metadaten werden in der Datenbank gespeichert
- **Fallback**: Schnelle Fallback-Werte wenn API nicht verfügbar

## Browser-Unterstützung

- **CSS aspect-ratio**: Moderne Browser (Chrome 88+, Firefox 89+, Safari 15+)
- **Fallback**: Für ältere Browser via padding-based aspect ratio
- **iframe**: Universelle Unterstützung für YouTube-Embeds
