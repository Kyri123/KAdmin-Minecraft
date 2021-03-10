KAdmin-Minecraft 
=============
Webbasiertes Admin Panel für Minecraft-Server

**Derzeitige Features**

- Benutzer & Benutzergruppen
- Server Traffic
- ServerControlCenter
  - Erstellen sowie Löschen von Server
  - Übersicht aller Aktiven Server
- ServerCenter
  - Echtzeit Konsole mit Befehlseingabe
  - Verwaltung und einspielen von Backups
  - Automatische Backups
  - Konfiguration von KAdmin & Server.properties
  - Restart beim Crash vom Server
  - Filebrowser
    - Verwaltung von Ordnern und Dateien
    - Bearbeiten von Dateien
    - Upload und Download
    - MORE WIP
  - Versions auswahl von
    - Vanilla Release (+ Snapshots)
    - Spigot
    - Craftbukkit
  - Modpack Installer über Projekt ID insofern diese ein Serverpack haben (nur Curseforge)

**Geplante Features**

- Ziehe Trello https://trello.com/b/qJfbqaoq

Wichtig
=============
- **[Dev-Tree]** Benutzten auf eigene GEFAHR (Debugs, Tests usw.)
- **[Test-Tree]** Benutzten auf eigene GEFAHR (Tests usw.)
- Derzeitiger Status: **Alpha**
- `Links`
  - Spenden? https://www.paypal.com/cgi-bin/webscr?shell=_s-xclick&hosted_button_id=68PT9KPRABVCU&source=url
  - Discord: https://discord.gg/ykGnw49
  - Trello: https://trello.com/b/qJfbqaoq

Installation
=============

1. 1. Erstelle einen Benutzer `adduser kadmin`
   2. Installiere alle nötigen Module `sudo apt-get install openjdk-8-jre-headless screen unzip zip curl`
   3. Installiere NodeJS (min 15.6.0)
2. Log dich in den Benutzer ein `su kadmin`
3. Downloade den letzten Release `cd ~ && wget https://api.minecraft.kadmin-panels.de/sh/installer.sh && chmod 755 ./installer.sh && ./installer.sh master`
   1. Hierbei kann `master` zu `dev` oder `test` geändert werden jenachdem welche branch man benutzen will
4. Erstelle die eine Datenbank (MariaDB) und lade die Tabellen aus `./forInstaller` in diese (Todo Automatisiertes erstellen von Tabellen)
5. Konfiguriere:
   - `app/config/app.json`
   - `app/config/mysql.json`
6. Starte das Programm mit `./starter.sh`

Update
=============
- Funktioniert automatisch
- Manuell: `cd ~ && wget https://api.minecraft.kadmin-panels.de/sh/updater.sh && chmod 755 ./updater.sh && ./updater.sh master`
  - Hierbei kann `master` zu `dev` oder `test` geändert werden jenachdem welche branch man benutzen will

Autostart einrichten
=============
1. Logge dich in den benutzer `kadmin` ein `su kadmin`
2. Öffne den Crontab `crontab -e`
3. füge folgende Zeile hinzu: `@reboot sh ~/starter.sh` **(Hierbei kann der Pfad `~/starter.sh` abweichen!)**

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
| `lang`                | **wird nicht mehr verwendet** |
| `useDebug`            | Debug modus für die Konsole (**true** = an / **false** = aus) |

updater.json
=============
| Eigenschaften         | Wert | 
| :---                  | :--- |
| `useBranch`           | Welche Branch soll benutzt werden **(Erlaubt: dev, master, test)** |
| `automaticInstall`    | Sollen Updates automatisch Installiert werden oder nur gemeldet (**true** = Installer, **false** = nur melden) |

main.json
=============
**INFO:** Hier sollte nur etwas verändert werden wenn man weis was man tut!

| Eigenschaften                         | Wert | 
| :---                                  | :--- |
| `interval > getStateFromServers`      | Interval wo der Status der Server abgefragt wird |
| `interval > getTraffic`               | Interval wo der Server Traffic angefragt wird |
| `interval > doReReadConfig`           | Interval wo die Konfigurationen neu geladen werden |
| `interval > doServerBackgrounder`     | Interval wo Server Hintergrund aktionen ausgeführt werden (sowas wie Backups) |
| `interval > backgroundUpdater`        | Interval wo das Panel auf neue Updates prüft |
| `interval > doJob`                    | WIP (für Cronjobs) |
| `interval > getVersionList`           | Interval wo Die Versionsliste aktualisiert wird |
| `interval > getChangelogList`         | Interval wo der Changelog vom Server gelesen wird |
| `interval > getSpigotCraftbukkitList` | Interval wo Die Versionsliste **für Spigot & Craftbukkit** aktualisiert wird |

# Sprache Installieren

- Lade die JSON Dateien in `/lang/<lang>/` hoch 
- WICHTIG: Es wird derzeit nur Deutsch mitgeliefert 
- **derzeit gibt es noch keine Funktion zum wählen der Sprache! (daher überschreibt de_de)**

# Benötigt
- `Betriebssystem`
  - Linux | Getestet auf:
    - Debain 9
    - Ubuntu Server 20
  - Administrator Rechte bzw genügend Rechte, um Daten in den jeweiligen Ordner zu lesen, & zu Schreiben sowie Auslastung lesen zu dürfen
- `Node.JS` 
  - Version >= 15.6.0
    - Getestet auf:
    - 15.8.0, 15.6.0
  - NVM (empfohlen für Versionswechsel) > https://github.com/nvm-sh/nvm
- `MariaDB` 
  - Server   
  
# Andere Projekte:
| Projekt                     | Status            | URL | 
| :---                        | :---              | :--- |
| KAdmin-ArkLIN               | Release           | https://github.com/Kyri123/KAdmin-ArkLIN |
| KAdmin-ArkWIN               | Alpha (gestoppt)  | https://github.com/Kyri123/KAdmin-ArkWIN |
| Kleines Minecraft Plugin    | Beta              | https://github.com/Kyri123/KPlugins-1.12.2 |

# Danke
- Danke an **JetBrains** für die bereitstellung der IDE's für die Entwicklung dieser Open-Source-Software
  - Link: https://www.jetbrains.com
- Sowie allen Testern und jeden gemeldeten BUG!

# Links
 
- Frontend by **AdminLTE 3.1** (https://github.com/ColorlibHQ/AdminLTE)