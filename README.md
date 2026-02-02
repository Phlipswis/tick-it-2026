# tick.it - Webapp Kanban Board
![Screenshot](Screenshot.png)

tick.it ist eine webbasierte Kanban-Board-Anwendung zur Verwaltung von Aufgaben und Workflows. Die Anwendung ermöglicht es, Aufgaben als Karten zu erstellen, zu bearbeiten, zu verschieben und zu löschen.

### Funktionen:

- Erstellen, Bearbeiten und Löschen von Karten über ein Modal
- Drag-and-Drop zum Verschieben von Karten zwischen den Spalten
- Löschen von Karten per Drag-and-Drop 
- Unterstützung von drei Themes:
    - Light
    - Dark
    - High Contrast
- Fully Responsive-Design 
    - Mobile (<= 1080px)
    - Tablet (1081px bis 1919px)
    - Desktop (>= 1920px)   
- Reduced Motion Implementierung
- Speicherung der Daten über ein Backend mit REST-API


### Technischer Überblick:

| Komponente          | Technologie                          | Beschreibung                     |
|---------------------|--------------------------------------|----------------------------------|
| **Frontend**        | HTML, CSS, TypeScript                | Vanilla JS, keine Frameworks     |
| **Backend**         | Node.js mit Express                  | REST-API Server (Port 3001)      |
| **Datenhaltung**    | JSON-basierter Service               | json-server + db.json (Port 3002)|
| **Kommunikation**   | REST-API                             | GET, POST, PATCH, DELETE         |
| **State-Handling**  | Synchronisation zwischen UI & Backend| Lokales Array + API-Calls        |

### Setup:
#### Dependencies installieren:
- In /tick.it/client/ pnpm install ausführen
- In /tick.it/server/ pnpm install ausführen

#### Lokal starten:
- In /tick.it/client/ pnpm run dev ausführen
- In /tick.it/server/ pnpm run dev ausführen

#### Im Netzwerk starten:
- In /tick.it/client/.env.production VITE_BACKEND_URL=http://'IPv4:3001' mit eigener IPv4 Addresse ersetzen
- In /tick.it/client/ pnpm run dev --host --mode production ausführen
- In /tick.it/server/ pnpm run dev:prod ausführen

## Dokumentation von KI-Einsatz
- Unterstützung in der Codegenerierung mit Claude Sonnet 4.5
- Fehlersuche mit Claude Sonnet 4.5
- "Side AI Hustle" Branch Styling und Modal Interface erstellt mit Claude Sonnet 4.5
