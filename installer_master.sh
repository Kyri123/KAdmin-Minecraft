#!/bin/bash
# *******************************************************************************************
# @author:  Oliver Kaufmann (Kyri123)
# @copyright Copyright (c) 2021, Oliver Kaufmann
# @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
# Github: https://github.com/Kyri123/KAdmin-Minecraft
# *******************************************************************************************
  echo -----------------------------------------
  echo            Installiere Panel
  echo -----------------------------------------

  rm -R tmp
  mkdir tmp
  cd tmp
  wget https://github.com/Kyri123/KAdmin-Minecraft/archive/master.zip
  unzip master.zip
  rm master.zip
  cd KAdmin-Minecraft-master
  yes | cp -rf ./ ./../../
  cd ../../
  rm -R tmp
  chmod 777 -R ./

  echo Done!

  echo -----------------------------------------
  echo        Installiere Module  
  echo -----------------------------------------
  npm i --force
  npm update
  npm fund
  echo Done!
  echo Konfiguriere nun Folgende Dateien
  echo ./app/config/mysql.json
  echo ./app/config/app.json
  echo danach start den Server in einem Screen mit ./start_master
