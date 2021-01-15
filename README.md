Arkadmin 
=============
Webbasiertes Admin Panel für Ark-Gameserver

**Derzeitige Features**

- Benutzer & Benutzergruppen
- Server Traffic
- ServerControlCenter
  - Erstellen sowie Löschen von Server
  - Übersicht aller Aktiven Server
- ServerCenter
  - Konsole
  - Verwaltung und einspielen von Backups
  - Automatische Backups
  - Konfiguration von KAdmin & Server.properties
  - **[WIP (Funktioniert schon... unklar ob in jeden Fall)]** Restart beim Crash vom Server

**Geplante Features**

- ServerCenter
  - Forge Support
  - Modpack Support
  - Spigot Support
  - Konsolen Befehle
- uvm.

Wichtig
=============
- **[Dev-Tree]** Benutzten auf eigene GEFAHR (Debugs, Tests usw.)
- Derzeitiger Status: **Alpha**
- `Links`
  - Spenden? https://www.paypal.com/cgi-bin/webscr?shell=_s-xclick&hosted_button_id=68PT9KPRABVCU&source=url
  - Discord: https://discord.gg/ykGnw49
  - Trello: https://trello.com/b/qJfbqaoq

Installation
=============
1. Erstelle einen Ordner
2. Downloade den letzten Release
   - MASTER: `wget XXX & chmod 777 ./installer_master.sh & ./starter_master.sh`
   - DEV: `wget XXX; chmod 777 ./installer_dev.sh & ./starter_dev.sh`
3. Erstelle die eine Datenbank (MariaDB) und lade die Tabellen aus `./forInstaller` in diese
4. Konfiguriere:
   - `app/config/app.json`
   - `app/config/mysql.json`
5. Starte das Programm mit 
   - MASTER: `./starter_master.sh`
   - DEV: `./starter_dev.sh`

Update
=============
- Funktioniert automatisch
- Ansonsten:
  - Beende das Panel
    - MASTER: `./starter_master.sh`
    - DEV: `./starter_dev.sh`

Standart Login
=============
- Benutzername UND Password: `admin`

app.json
=============
| Eigenschaften         | Wert | 
| :---                  | :--- |
| `port`                | Port der genutzt werden soll für den Webserver |
| `servRoot`            | Pfad wo die Server liegen sollen |
| `logRoot`             | Pfad wo die Logs liegen sollen |
| `pathBackup`          | Pfad wo die Backups liegen sollen |

main.json
=============
**INFO:** Hier sollte nur etwas verändert werden wenn man weis was man tut!

| Eigenschaften                       | Wert | 
| :---                                | :--- |
| `useDebug`                          | WIP |
| `interval > getStateFromServers`    | WIP |
| `interval > getTraffic`             | WIP |
| `interval > doReReadConfig`         | WIP |
| `interval > doServerBackgrounder`   | WIP |
| `interval > backgroundUpdater`      | WIP |
| `interval > doJob`                  | WIP |

# Sprache Installieren

- Lade die JSON Dateien in `/lang/<lang>/` hoch 
- WICHTIG: Es wird derzeit nur Deutsch mitgeliefert 

# Benötigt
- `Betriebssystem`
  - Linux | Getestet auf:
    - Debain 9 & 10
  - Administrator Rechte bzw genügend Rechte, um Daten in den jeweiligen Ordner zu lesen, & zu Schreiben sowie Auslastung lesen zu dürfen
- `Node.JS` 
  - Version >= 15.5.1                   > https://nodejs.org/dist/v15.5.1/node-v15.5.1-x64.msi
  - NVM (empfohlen für Versionswechsel) > https://github.com/nvm-sh/nvm
- `MariaDB` 
  - Server              > z.B. https://www.apachefriends.org/de/index.html
- `Linux`
  - screen
  - java-8 jenachdem welche MC server und Mods!
  
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
 
- Frontend by **AdminLTE 3.1** (https://github.com/ColorlibHQ/AdminLTE)