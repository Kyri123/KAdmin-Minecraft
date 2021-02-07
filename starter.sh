#!/bin/bash
# *******************************************************************************************
# @author:  Oliver Kaufmann (Kyri123)
# @copyright Copyright (c) 2021, Oliver Kaufmann
# @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
# Github: https://github.com/Kyri123/KAdmin-Minecraft
# *******************************************************************************************
 
while true
do
  npm i --force
  npm update
  npm fund
  npm audit fix
  node app.js startedWithUpdater dev
done