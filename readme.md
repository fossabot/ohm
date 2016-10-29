[![StackShare](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](http://stackshare.io/camwes/ohm-fm)
# Installing
Assuming you are running homebrew up-to-date on a Mac, here is how you configure your dev environment
```sh
brew install mongodb
brew install nvm
brew install redis
# Configure Dependencies
brew services start mongodb
nvm install v4.6.1
nvm alias default v4.6.1
npm install -g bower
redis-server &
```
Next install app dependencies
```sh
npm install
```
Finally, compile the client assets.
```sh
grunt
```
You are ready to run the server
```sh
npm start
```
# Dependencies:
For Full details see [package.json](https://github.com/ohmlabs/ohm/blob/master/package.json)

* [Node.js](https://nodejs.org/en/)
* [Express.js](http://expressjs.com/guide.html)
* [Parse Server](https://github.com/ParsePlatform/parse-server)
* [Ghost](https://ghost.org/)
* [React.js](https://facebook.github.io/react/)
* [Socket.io](https://github.com/socketio/socket.io)
* [underscore](http://underscorejs.org/)
* [Grunt](http://gruntjs.com/)
* [Webpack](https://webpack.github.io/)
* [Babel](https://babeljs.io/)

# Architecture
The server architecture is evolving more information to come.
```sh
├── client
│   ├── js                        # client scripts
│   ├── images                    # raw image files 
│   └── sass                      # sass files
├── ohm
│   ├── apis                      # API initializations (Parse, AWS)
│   ├── config                    # config files for Compass, Express, Auth, etc.
│   ├── models                    # app models
│   ├── ghost
│   ├── controllers               # app controllers
│   ├── routes                    # url routing
│   └── views                     # jade files for pages and templates
│   |   └── includes              # include files such as google analytics
├── static
│   ├── components                # bower managed client dependencies
│   ├── css                       # compiled css files
│   ├── img                       # compressed images
│   └── js                        # compiled js
├── package.json
├── gruntfile.js                  # gruntfile (necessary for cli to work)
└── ohm.js
```

### Debugging
If you are using [node-inspector](https://github.com/node-inspector/node-inspector) the run command by default passes the necessary flag to attach to the debugger, but you must start node inspector like so first:
```sh
grunt node-inspector &
# navigate to http://127.0.0.1:8090/debug?port=5960
```
