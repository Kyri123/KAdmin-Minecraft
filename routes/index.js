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
router.use('/reg',                  isNotLoggedIn,                   require('./pages/session_reg'))                    // RegisterPage                        | Darf nicht eingeloggt sein
router.use('/login',                isNotLoggedIn,                   require('./pages/session_login'))                  // Login                               | Darf nicht eingeloggt sein

// Allgemeine Seiten
router.use('/home',                 isLoggedIn,                      require('./pages/home'))                           // Startseite                          | Muss eingeloggt sein

// Server Center

// ajax

// Error seiten
router.use('/404',                                                   require('./pages/404'))                            // Error 404                           | IMMER
router.use('/401',                                                   require('./pages/401'))                            // Error 401                           | IMMER


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

module.exports = router;
