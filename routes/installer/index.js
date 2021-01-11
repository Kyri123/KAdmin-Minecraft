/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

let express = require('express')
let router = express.Router()

// Login/Reg
router.use('/step/1', require('./step1'));                    // RegisterPage                         | Darf nicht eingeloggt sein
router.use('/step/2', require('./step2'));                    // RegisterPage                         | Darf nicht eingeloggt sein
router.use('/step/3', require('./step3'));                    // RegisterPage                         | Darf nicht eingeloggt sein
router.use('/ajax', require('./ajax'));                    // RegisterPage                         | Darf nicht eingeloggt sein

router.all('*', (req, res, next) => {
   res.redirect('/step/1')
})

module.exports = router
