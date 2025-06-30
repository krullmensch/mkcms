# MKCMS - Portfolio Content Management System

Ein modernes Content Management System für Portfolio-Websites, basierend auf PayloadCMS und Next.js.

## 🏗️ Technologie-Stack

### Frontend
- **Next.js 15.3.0** - React-Framework mit App Router
- **React 19.1.0** - UI-Bibliothek
- **TypeScript 5.7.3** - Typsicherheit
- **CSS** - Custom Styling

### Backend & CMS
- **PayloadCMS 3.33.0** - Headless CMS
- **Lexical Editor** - Rich Text Editor
- **GraphQL** - API-Abfragesprache

### Datenbank
- **MongoDB** - NoSQL-Datenbank
- **Mongoose** - MongoDB Object Modeling

### Medienverarbeitung
- **Sharp** - Bildoptimierung und -verarbeitung
- **Fluent-FFmpeg** - Videobearbeitung
- **Puppeteer** - PDF-Generierung und Web-Scraping

### Development & Build
- **pnpm** - Package Manager
- **ESLint** - Code Linting
- **Prettier** - Code Formatting
- **Cross-env** - Umgebungsvariablen

### Deployment
- **Docker** - Containerisierung
- **Nginx** - Reverse Proxy
- **PayloadCloud** - Cloud-Integration

## 📁 Projektstruktur

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (frontend)/         # Frontend-Routen
│   │   │   ├── components/     # React-Komponenten
│   │   │   ├── context/        # React Context
│   │   │   ├── hooks/          # Custom Hooks
│   │   │   ├── utils/          # Utility-Funktionen
│   │   │   ├── projects/       # Projekt-Seiten
│   │   │   └── styles.css      # Globale Styles
│   │   ├── (payload)/          # PayloadCMS Admin
│   │   ├── api/                # API-Routen
│   │   └── _components/        # Geteilte Komponenten
│   ├── collections/            # PayloadCMS Collections
│   │   ├── Users.ts           # Benutzer-Collection
│   │   ├── Media.ts           # Medien-Collection
│   │   ├── MediaBulk.ts       # Bulk-Upload-Collection
│   │   └── About.ts           # About-Collection
│   ├── utils/                  # Server-Utilities
│   ├── payload.config.ts       # PayloadCMS-Konfiguration
│   └── payload-types.ts        # Generierte TypeScript-Typen
├── media/                      # Hochgeladene Medien
├── data/                       # MongoDB-Daten
├── docker-compose.yml          # Docker-Entwicklung
├── docker-compose.prod.yml     # Docker-Produktion
├── Dockerfile                  # Docker-Image
├── nginx.conf                  # Nginx-Konfiguration
├── backup.sh                   # Backup-Script
└── deploy.sh                   # Deployment-Script
```

## 🗄️ Datenmodell

### Collections

1. **Users** - Benutzer-Authentifizierung
2. **Media** - Medien-Upload und -verwaltung
3. **MediaBulk** - Bulk-Upload für mehrere Dateien
4. **About** - About-Seite Inhalte
5. **Projects** - Portfolio-Projekte (dynamisch konfiguriert)

### Project Collection Features
- **Automatische YouTube-Integration** - Extrahiert Video-IDs und Metadaten
- **Responsive Bildgrößen** - Automatische Generierung von 400x300 und 768x576 Varianten
- **Video-Unterstützung** - WebM-Format für optimale Performance
- **Fallback-Bilder** - Placeholder-System für fehlende Medien

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js 18.20.2+ oder 20.9.0+
- pnpm 9+ oder 10+
- MongoDB (lokal oder remote)

### Entwicklungsumgebung

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd mkcms
   ```

2. **Abhängigkeiten installieren**
   ```bash
   pnpm install
   ```

3. **Umgebungsvariablen konfigurieren**
   ```bash
   cp .env.example .env
   ```
   
   Bearbeite `.env`:
   ```
   DATABASE_URI=mongodb://127.0.0.1/mkcms
   PAYLOAD_SECRET=your-secure-secret-key
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   ```

4. **MongoDB starten**
   ```bash
   # Mit Homebrew (macOS)
   brew services start mongodb-community
   
   # Oder Docker
   docker run -d -p 27017:27017 mongo
   ```

5. **Entwicklungsserver starten**
   ```bash
   pnpm dev
   ```

   Die Anwendung ist verfügbar unter:
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin

## 📜 Verfügbare Scripts

- `pnpm dev` - Entwicklungsserver starten
- `pnpm devsafe` - Dev-Server mit Cache-Reset
- `pnpm build` - Produktions-Build erstellen
- `pnpm start` - Produktions-Server starten
- `pnpm lint` - Code linting
- `pnpm generate:types` - TypeScript-Typen generieren
- `pnpm payload` - PayloadCMS CLI

## 🐳 Docker Deployment

### Entwicklung
```bash
docker-compose up -d
```

### Produktion
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🎨 Features

### YouTube-Integration
- Automatische Video-ID-Extraktion
- Thumbnail-Generierung
- oEmbed-API-Integration
- Responsive Video-Einbettung

### Medienverarbeitung
- Automatische Bildoptimierung
- Multiple Bildgrößen
- WebM-Video-Unterstützung
- Bulk-Upload-Funktionalität

### Performance
- Next.js App Router
- Statische Generierung
- Bildoptimierung mit Sharp
- CDN-ready

### Sicherheit
- PayloadCMS Authentifizierung
- Umgebungsvariablen
- CORS-Konfiguration
- Input-Validierung

## 🔧 Konfiguration

### PayloadCMS
Die Hauptkonfiguration befindet sich in `src/payload.config.ts` und umfasst:
- MongoDB-Verbindung
- Collection-Definitionen
- Medien-Upload-Konfiguration
- YouTube-API-Integration
- Hook-Definitionen für Datenverarbeitung

### Next.js
Konfiguration in `next.config.mjs`:
- Payload-Integration
- Bild-Optimierung
- Remote-Pattern für Medien
- Standalone-Output für Docker

## 📝 Wartung

### Backup
```bash
./backup.sh
```

### Deployment
```bash
./deploy.sh
```

### Cache-Reset
```bash
pnpm devsafe
```

## 🛠️ Entwicklung

### TypeScript-Typen generieren
```bash
pnpm generate:types
```

### Neue Collection hinzufügen
1. Erstelle neue Datei in `src/collections/`
2. Exportiere Collection-Konfiguration
3. Importiere in `payload.config.ts`
4. Regeneriere Typen

### Custom Components
- Frontend-Komponenten: `src/app/(frontend)/components/`
- Admin-Komponenten: `src/app/_components/`
- Payload-Komponenten: In Collection-Konfiguration

---

**Entwickelt für moderne Portfolio-Websites mit PayloadCMS & Next.js**
