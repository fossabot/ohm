#! /bin/sh
# /etc/init.d/boilerplate
# update these paths so that the script works correctly
NAME=boilerplate.fm
grunt=/usr/bin/grunt
gem=/usr/bin/gem
forever=/usr/bin/forever
npm=/usr/bin/npm
GHOST=/home/ubuntu/ghost
bower=/usr/bin/bower
SITEROOT=/home/ubuntu/production
export PATH=$PATH:/usr/bin/

case "$1" in
  start)
    echo "Starting $NAME"
    cd $SITEROOT
    pwd
    $grunt prod
    $forever start boilerplate.js -p
    sudo service ghost start
    ;;
  stop)
    echo "Stopping script $NAME"
    cd $SITEROOT
    $forever stop boilerplate.js -p
    sudo service ghost stop

    ;;
  compile)
    echo "Compiling $NAME"
    cd $SITEROOT
    $grunt prod
    $forever restart boilerplate.js -p
    sudo service ghost restart
    
    ;;
  install)
    echo "Beginning Installation for script $NAME"
    cd $SITEROOT
    $npm cache clean
    $npm install
    $bower install --allow-root

    ;;
  list)
    echo "List"
    $forever list
    ;;
  *)
    echo "Usage: /etc/init.d/boilerplate {start|stop|list}"
    exit 1
    ;;
esac

exit 0
