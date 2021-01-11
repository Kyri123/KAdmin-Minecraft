/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

var express = require('express')
var router = express.Router()
var {isNotLoggedIn, isLoggedIn, logout} = require('./middleware/user')
var {isServerExsits} = require('./middleware/server')

// Login/Reg
router.use('/reg',                          isNotLoggedIn ,                     require('./pages/session_reg'))                    // RegisterPage                      | Darf nicht eingeloggt sein
router.use('/login',                        isNotLoggedIn ,                     require('./pages/session_login'))                  // Login                             | Darf nicht eingeloggt sein

// Allgemeine Seiten
router.use('/home',                         isLoggedIn    ,                     require('./pages/home'))                           // Startseite                       | Muss eingeloggt sein
router.use('/usersettings',                 isLoggedIn    ,                     require('./pages/usersettings'))                   // Benutzereinstellugen             | Muss eingeloggt sein
router.use('/servercontrolcenter',          isLoggedIn    ,                     require('./pages/serverControlCenter'))            // ServerControlCenter              | Muss eingeloggt sein
router.use('/userpanel',                    isLoggedIn    ,                     require('./pages/userPanel'))                      // Benutzer                         | Muss eingeloggt sein
router.use('/grouppanel',                   isLoggedIn    ,                     require('./pages/grouppanel'))                     // Benutzer Gruppen                 | Muss eingeloggt sein
router.use('/changelog',                    isLoggedIn    ,                     require('./pages/changelog'))                      // Changelogs                       | Muss eingeloggt sein

// Server Center
router.use('/servercenter/:name/logs',      isLoggedIn    , isServerExsits    , require('./pages/serverCenter_logs'))              // ServerCenter - Logs              | Muss eingeloggt sein
router.use('/servercenter/:name/api',       isLoggedIn    , isServerExsits    , require('./pages/serverCenter_api'))               // ServerCenter - Ark API           | Muss eingeloggt sein
router.use('/servercenter/:name/backups',   isLoggedIn    , isServerExsits    , require('./pages/serverCenter_backups'))           // ServerCenter - Backups           | Muss eingeloggt sein
router.use('/servercenter/:name/mods',      isLoggedIn    , isServerExsits    , require('./pages/serverCenter_mods'))              // ServerCenter - Modifikation      | Muss eingeloggt sein
router.use('/servercenter/:name/config',    isLoggedIn    , isServerExsits    , require('./pages/serverCenter_config'))            // ServerCenter - Konfiguration     | Muss eingeloggt sein
router.use('/servercenter/:name/home',      isLoggedIn    , isServerExsits    , require('./pages/serverCenter_home'))              // ServerCenter - Startseite        | Muss eingeloggt sein
router.use('/servercenter/:name',           isLoggedIn    , isServerExsits    , require('./pages/serverCenter'))                   // ServerCenter                     | Muss eingeloggt sein

// ajax
router.use('/ajax/serverCenterAny',         isLoggedIn    ,                     require('./ajax/serverCenterAny'))                 // ServerCenterAny                  | Muss eingeloggt sein
router.use('/ajax/serverCenterBackups',     isLoggedIn    ,                     require('./ajax/serverCenterBackups'))             // ServerCenter - Backups           | Muss eingeloggt sein
router.use('/ajax/serverCenterConfig',      isLoggedIn    ,                     require('./ajax/serverCenterConfig'))              // ServerCenter - Konfiguration     | Muss eingeloggt sein
router.use('/ajax/serverCenterMods',        isLoggedIn    ,                     require('./ajax/serverCenterMods'))                // ServerCenter - Modifikation      | Muss eingeloggt sein
router.use('/ajax/serverCenterLogs',        isLoggedIn    ,                     require('./ajax/serverCenterLogs'))                // ServerCenter - Logs              | Muss eingeloggt sein
router.use('/ajax/serverCenterAPI',         isLoggedIn    ,                     require('./ajax/serverCenterAPI'))                 // ServerCenter - Ark API                         | Muss eingeloggt sein
router.use('/ajax/usersettings',            isLoggedIn    ,                     require('./ajax/usersettings'))                    // Benutzereinstellugen             | Muss eingeloggt sein
router.use('/ajax/servercontrolcenter',     isLoggedIn    ,                     require('./ajax/serverControlCenter'))             // ServerControlCenter              | Muss eingeloggt sein
router.use('/ajax/userpanel',               isLoggedIn    ,                     require('./ajax/userPanel'))                       // Benutzer                         | Muss eingeloggt sein
router.use('/ajax/grouppanel',              isLoggedIn    ,                     require('./ajax/groupPanel'))                       // Benutzereinstellugen             | Muss eingeloggt sein


// Error seiten
router.use('/404' ,                                                         require('./pages/404'))                                // Error 404                         | IMMER
router.use('/401' ,                                                         require('./pages/401'))                                // Error 401                         | IMMER


// Ausloggen
router.use('/logout',     isLoggedIn    ,   logout)

// / darf nicht so stehen > zu /home außer wenn !LoggedIn /login
router.all('/',     isLoggedIn    , function(req, res, next) {
    res.redirect('/home')
})

// 404
router.all('*', function(req, res, next) {
  res.redirect('/404')
})

module.exports = router;
