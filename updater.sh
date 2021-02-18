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
	echo           UpdatePanel - $BRANCH
	echo -----------------------------------------

  	rm -R tmp
  	mkdir tmp
  	cd tmp
  	wget https://github.com/Kyri123/KAdmin-Minecraft/archive/$BRANCH.zip
  	unzip $BRANCH.zip
  	rm $BRANCH.zip
  	cd KAdmin-Minecraft-$BRANCH
  	rm ./app/config/app.json
  	rm ./app/config/mysql.json
  	rm ./public/json/serverInfos/mcVersionsCraftbukkit.json
  	rm ./public/json/serverInfos/mcVersionsSpigot.json
  	rm -R ./app/json/server/5c68f48w.json
	rm -R ./app/json/server/5g28f48x.json
	rm -R ./app/json/panel/changelog.json
  	yes | cp -rf ./ ./../../
  	cd ../../
  	rm -R tmp

  	echo Done!
fi

