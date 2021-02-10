#!/bin/bash
echo "*******************************************************************************************"
echo "@author:  Oliver Kaufmann (Kyri123)"
echo "@copyright Copyright (c) 2021, Oliver Kaufmann"
echo "@license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE"
echo "Github: https://github.com/Kyri123/KAdmin-Minecraft"
echo "*******************************************************************************************"
BRANCH=$1
if test -z "$BRANCH"
then
	echo no Brach selected ... master, test or dev
else
  	echo -----------------------------------------
  	echo            Installiere Panel
  	echo -----------------------------------------

  	rm -R tmp
  	mkdir tmp
  	cd tmp
  	wget https://github.com/Kyri123/KAdmin-Minecraft/archive/$BRANCH.zip
  	unzip $BRANCH.zip
  	rm $BRANCH.zip
  	cd KAdmin-Minecraft-$BRANCH
  	yes | cp -rf ./ ./../../
  	cd ../../
  	rm -R tmp
 
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
fi
