/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const router                              = require('express').Router();
let {isNotLoggedIn, isLoggedIn, logout}   = require('./middleware/user')
let {isServerExsits}                      = require('./middleware/server')

// Login/Reg
router.use('/reg',                           isNotLoggedIn,                      require('./pages/session_reg'))
router.use('/login',                         isNotLoggedIn,                      require('./pages/session_login'))

// Allgemeine Seiten
router.use('/home',                             isLoggedIn     ,                       require('./pages/home'))
router.use('/changelog',                        isLoggedIn     ,                       require('./pages/changelog'))
router.use('/usersettings',                     isLoggedIn     ,                       require('./pages/usersettings'))
router.use('/grouppanel',                       isLoggedIn     ,                       require('./pages/groupPanel'))
router.use('/userpanel',                        isLoggedIn     ,                       require('./pages/userPanel'))
router.use('/servercontrolcenter',              isLoggedIn     ,                       require('./pages/serverControlCenter'))

// Server Center
router.use('/servercenter/:name/backups',       isLoggedIn     , isServerExsits    ,   require('./pages/servercenter/serverCenter_backups'))
router.use('/servercenter/:name/config',        isLoggedIn     , isServerExsits    ,   require('./pages/servercenter/serverCenter_config'))
router.use('/servercenter/:name/home',          isLoggedIn     , isServerExsits    ,   require('./pages/servercenter/serverCenter_home'))
router.use('/servercenter/:name/filebrowser',   isLoggedIn     , isServerExsits    ,   require('./pages/servercenter/serverCenter_filebrowser'))
router.use('/servercenter/:name',               isLoggedIn     , isServerExsits    ,   require('./pages/servercenter/serverCenter'))

// ajax
router.use('/ajax/usersettings',                isLoggedIn     ,                       require('./ajax/usersettings'))
router.use('/ajax/userpanel',                   isLoggedIn     ,                       require('./ajax/userPanel'))
router.use('/ajax/grouppanel',                  isLoggedIn     ,                       require('./ajax/groupPanel'))
router.use('/ajax/servercontrolcenter',         isLoggedIn     ,                       require('./ajax/serverControlCenter'))
router.use('/ajax/all',                         isLoggedIn     ,                       require('./ajax/all'))

// ajax - ServerCenter
router.use('/ajax/serverCenterHome',            isLoggedIn     ,                       require('./ajax/servercenter/serverCenterHome'))
router.use('/ajax/serverCenterAny',             isLoggedIn     ,                       require('./ajax/servercenter/serverCenterAny'))
router.use('/ajax/serverCenterBackups',         isLoggedIn     ,                       require('./ajax/servercenter/serverCenterBackups'))
router.use('/ajax/serverCenterConfig',          isLoggedIn     ,                       require('./ajax/servercenter/serverCenterConfig'))
router.use('/ajax/serverCenterFilebrowser',     isLoggedIn     ,                       require('./ajax/servercenter/serverCenterFilebrowser'))

// Error seiten
router.use('/404',                                                                  require('./pages/404'))
router.use('/401',                                                                  require('./pages/401'))

// Ausloggen
router.use('/logout',                           isLoggedIn     ,                    logout)

// / darf nicht so stehen > zu /home außer wenn !LoggedIn /login
router.all('/', isLoggedIn, (req, res, next) => {
   res.redirect('/home')
   return true
})

// 404
router.all('*', (req, res, next) => {
   res.redirect('/404')
   return true
})

module.exports = router
