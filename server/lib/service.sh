#! /bin/sh
# /etc/init.d/boilerplate
#

NAME=Boilerplate
grunt=/usr/bin/grunt
gem=/usr/bin/gem
forever=/usr/bin/forever
npm=/usr/bin/npm
bower=/usr/bin/bower
SITEROOT=~/boilerplate
export PATH=$PATH:/usr/bin/

case "$1" in
  start)
    echo "Starting $NAME"
    cd $SITEROOT
    pwd
    $bower install
    $npm install
    $grunt
    $forever start boilerplate.js -p
    ;;
  stop)
    echo "Stopping script $NAME"
    cd $SITEROOT
    $forever stop boilerplate.js -p

    ;;
  install)
    echo "Beginning Installation for script $NAME"
    cd $SITEROOT
    $npm cache clean
    $npm install
    $bower install --allow-root
    git submodule init
    git submodule update

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
