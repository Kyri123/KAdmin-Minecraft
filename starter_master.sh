#!/bin/bash
# *******************************************************************************************
# @author:  Oliver Kaufmann (Kyri123)
# @copyright Copyright (c) 2021, Oliver Kaufmann
# @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
# Github: https://github.com/Kyri123/KAdmin-Minecraft
# *******************************************************************************************
 
while true
do
  echo -----------------------------------------
  echo             UpdatePanel
  echo -----------------------------------------

  rm -R tmp
  mkdir tmp
  cd tmp
  wget https://github.com/Kyri123/KAdmin-Minecraft/archive/master.zip
  unzip master.zip
  rm master.zip
  cd KAdmin-Minecraft-master
  rm ./app/config/app.json
  rm ./app/config/mysql.json
  rm ./public/json/serverInfos/mcVersionsCraftbukkit.json
  rm ./public/json/serverInfos/mcVersionsSpigot.json
  rm -R ./app/json/server
  yes | cp -rf ./ ./../../
  cd ../../
  rm -R tmp

  echo Done!

  echo -----------------------------------------
  echo        Update Module + Start
  echo -----------------------------------------
  npm i --force
  npm update
  npm fund
  echo Done! ... start Server
  node app.js startedWithUpdater master
done