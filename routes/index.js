/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

let express                               = require('express')
let router                                = express.Router()
let {isNotLoggedIn, isLoggedIn, logout}   = require('./middleware/user')
let {isServerExsits}                      = require('./middleware/server')

// Login/Reg
router.use('/reg',                  isNotLoggedIn,                   require('./pages/session_reg'))
router.use('/login',                isNotLoggedIn,                   require('./pages/session_login'))

// Allgemeine Seiten
router.use('/home',                 isLoggedIn,                      require('./pages/home'))
router.use('/usersettings',         isLoggedIn,                      require('./pages/usersettings'))
router.use('/grouppanel',           isLoggedIn,                      require('./pages/groupPanel'))
router.use('/userpanel',            isLoggedIn,                      require('./pages/userPanel'))

// Server Center

// ajax
router.use('/ajax/usersettings',    isLoggedIn    ,                     require('./ajax/usersettings'))
router.use('/ajax/userpanel',       isLoggedIn    ,                     require('./ajax/userPanel'))
router.use('/ajax/grouppanel',      isLoggedIn    ,                     require('./ajax/groupPanel'))

// Error seiten
router.use('/404',                                                   require('./pages/404'))
router.use('/401',                                                   require('./pages/401'))


// Ausloggen
router.use('/logout',               isLoggedIn,                      logout)

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
