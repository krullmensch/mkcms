# Portfolio Deployment Guide

## Voraussetzungen auf dem V-Server

- Docker und Docker Compose installiert
- Domain mit SSL-Zertifikat (Let's Encrypt empfohlen)
- Mindestens 2GB RAM, 20GB Festplatte

## Deployment-Schritte

### 1. Projekt auf Server übertragen

```bash
# Repository klonen oder Dateien kopieren
git clone <your-repo> /opt/portfolio
cd /opt/portfolio
```

### 2. Environment-Variablen konfigurieren

```bash
cp .env.production .env
# Bearbeite .env mit deinen Werten:
# - PAYLOAD_SECRET (mindestens 32 Zeichen)
# - NEXT_PUBLIC_SERVER_URL (deine Domain)
```

### 3. SSL-Zertifikate einrichten

```bash
# Mit Let's Encrypt (empfohlen)
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/
```

### 4. Deployment ausführen

```bash
./deploy.sh
```

### 5. Daten migrieren (falls nötig)

```bash
# Lokale Daten exportieren
./migrate.sh

# Auf Server importieren
docker exec -it mkcms_mongo_1 mongorestore /migration_backup
```

## Wartung

### Backups erstellen

```bash
./backup.sh
```

### Updates

```bash
git pull
./deploy.sh
```

### Logs überprüfen

```bash
docker-compose -f docker-compose.prod.yml logs -f
```

## Troubleshooting

### Service-Status prüfen

```bash
docker-compose -f docker-compose.prod.yml ps
```

### In Container einloggen

```bash
docker exec -it mkcms_app_1 sh
```

### MongoDB-Konsole

```bash
docker exec -it mkcms_mongo_1 mongosh mkcms
```
