# Arkadmin 

Webbasiertes Admin Panel für Ark-Gameserver

**Derzeitige Features**

- Benutzer & Benutzergruppen
- Server Traffic
- ServerControlCenter
  - Erstellen sowie Löschen von Server
  - Übersicht aller Aktiven Server
- ServerCenter
  - CMD Response
  - Backup Kontrolle
  - Modübersicht mit SteamAPI und Grafiker oberfläche über bessere Übersicht
  - Verwaltung und einspielen von Backups
  - Meldungen bezüglich Benötigten Updates & Installierten Mod
  - Automatische Updates (mit Mods Updates)
  - Automatische Backups
  - **[WIP (Funktioniert schon unklar ob in jeden Fall)]** Restart beim Crash vom Server (alwaysstart)

# Wichtig

- **[Dev-Tree]** Benutzten auf eigene GEFAHR (Debugs, Tests usw.)
- Derzeitiger Status: **Alpha**
- `Links`
  - Spenden? https://www.paypal.com/cgi-bin/webscr?shell=_s-xclick&hosted_button_id=68PT9KPRABVCU&source=url
  - Discord: https://discord.gg/ykGnw49
  - Trello: https://trello.com/b/HZFtQ2DZ/KAdmin-Minecraft

# Installation

- Downloade den letzten Release
- Erstelle einen Ordner
- Kopiere alles hier hinein
- Starte das Programm mit einer der CMD's
  - Hierbei ist zu beachten, dass der Automatischen Updater nur aktiv wird, wenn das Programm mit gestartet `start_master.shell` oder `start_dev.shell` wird
  - sollte dies nicht gewünscht sein starte einfach das Programm mit `start_noUpdater.shell`
- Folge den Angezeigten anweisungen auf der Webseite (http://ip:port)
- Nach abschluss der Installation startet das Panel neu mit den gewählten Einstellungen und du kannst loslegen

**Alternative:**
- Downloade nur `start_master.shell` oder `start_dev.shell`
- Erstelle einen Ordner und in diesen einen `cache`
- Kopiere die CMD in den Ordner und führe diese aus
- nun solle das Panel runtergeladen werden und gestartet werden
  - Es wird IMMER die letzte version der jeweiligen Branch genommen!

# Update

- Ist das Panel bereits mit `start_master.shell` oder `start_dev.shell` gestartet musst du nichts tun einfach warten bis auf ein neues Update geprüft wird.
- Ansonsten:
  - Beende das Panel
  - Starte einer der folgenden CMD's: `start_master.shell` oder `start_dev.shell`

**Alternative:**
- Downloade den letzten Release
- Kopiere alles in den Ordner vom Panel
- Starte das Programm mit einer der CMD's

# Standart Login

- Benutzername UND Password: `admin`

# app.json

| Eigenschaften         | Wert | 
| :---                  | :--- |
| `lang`                | Ordner name der für die Sprachdatei verwendet werden soll |
| `port`                | Port der genutzt werden soll für den Webserver |
| `servRoot`            | Pfad wo die Server liegen sollen |
| `logRoot`             | Pfad wo die Logs liegen sollen |
| `pathBackup`          | Pfad wo die Backups liegen sollen |

# main.json
**INFO:** Hier sollte nur etwas verändert werden wenn man weis was man tut!

| Eigenschaften                       | Wert | 
| :---                                | :--- |
| `useDebug`                          | Aktiviert den Debug-Modus in der Konsole |
| `interval > getStateFromServers`    | Invervall wobei die Informationen von Server erfasst werden (Online usw) |
| `interval > getTraffic`             | Invervall wobei der Traffic erfasst wird |
| `interval > doReReadConfig`         | Invervall wobei die Konfigurationen neu geladen werden |
| `interval > doServerBackgrounder`   | Invervall wobei wobei die Server geprüft werden (alwaysstarter usw) |
| `interval > backgroundUpdater`      | Invervall wobei das Panel auf eine neue Version geprüft wird |
| `interval > doJob`                  | WIP |

# Sprache Installieren

- Lade die JSON Dateien in `/lang/<lang>/` hoch 
- Bearbeite die `/app/config/app.json` und stelle `lang` auf den ordner Namen `<lang>`
- WICHTIG: Es wird derzeit nur Deutsch mitgeliefert 

# Benötigt
- `Betriebssystem`
  - Linux (derzeit getestet auf: Debain 9)
  - Administrator Rechte bzw genügend Rechte, um Daten in den jeweiligen Ordner zu lesen, & zu Schreiben sowie Auslastung lesen zu dürfen
- `Node.JS` 
  - Version >= 15.5.1                   > https://nodejs.org/dist/v15.5.1/node-v15.5.1-x64.msi
  - NVM (empfohlen für Versionswechsel) > https://github.com/nvm-sh/nvm
- `MariaDB` 
  - Server              > z.B. https://www.apachefriends.org/de/index.html

# Andere Projekte:
| Projekt                     | Status          | URL | 
| :---                        | :---            | :--- |
| KAdmin-ArkLIN               | Release         | https://github.com/Kyri123/KAdmin-ArkLIN |
| KAdmin-ArkWIN               | Alpha           | https://github.com/Kyri123/KAdmin-ArkWIN |
| Kleines Minecraft Plugin    | Beta            | https://github.com/Kyri123/KPlugins-1.12.2 |

# Danke
- Danke an **JetBrains** für die bereitstellung der IDE's für die Entwicklung dieser Open-Source-Software
  - Link: https://www.jetbrains.com
- Sowie allen Testern und jeden gemeldeten BUG!

# Links
 
- Frontend by AdminLTE (3.1)(https://github.com/ColorlibHQ/AdminLTE)