//error handling

process.on('uncaughtException', function (err) {
  // handle the error safely
  console.log(400, ' Start Error Message: ', err)
  // send email

});

//SIPEDE Server
const express = require('express')
const http = require('http')
const next = require('next')
const socketServer = require('socket.io')

//modul mongodb utk koneksi mongo db database
const url = 'mongodb://127.0.0.1:27017/sp2020';
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

let runServer = () => {
  const port = 82
  const dev = process.env.NODE_ENV !== 'production'
  const app = next({ dev })
  const handle = app.getRequestHandler()

  app.prepare()
    .then(() => {
      const server = express()
      const cookieParser = require("cookie-parser");
      const bodyParser = require("body-parser");
      var sharedsession = require("express-socket.io-session");
      // server.use(session);
      const sessionWithMongo = session({
        resave: true,
        saveUninitialized: true,
        secret: "ID==&&%^&A&SHBJSAsjhbJGhUGkbKiUvii^%^#$%^&98G8UIugg==",
        store: new MongoStore({ mongooseConnection: mongoose.connection })
      })
      server.use(sessionWithMongo);
      server.use(cookieParser("ID==&&%^&A&SHBJSAsjhbJGhUGkbKiUvii^%^#$%^&98G8UIugg=="));
      server.use(bodyParser.urlencoded({ extended: true }));
      server.use(bodyParser.json())

      //socket.io
      const serve = http.createServer(server);

      // server.use('/api/login', require("./api/login.api"));

      //Kompresi gzip
      const compression = require('compression');
      server.use(compression());

      server.get('*', (req, res) => {
        return handle(req, res)
      })
      serve.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on https://localhost:${port}`)
      })

      const io = socketServer(serve);
      const all_connected_clients = require('./SocketConnections')
      io.use(sharedsession(sessionWithMongo, cookieParser("ID==&&%^&A&SHBJSAsjhbJGhUGkbKiUvii^%^#$%^&98G8UIugg==")));
      io.on('connection', function (client) {
        console.log("Hey, someone connected");
        // require('./api/socket/penilaian.api.socket')(client, all_connected_clients)
        client.on('disconnect', () => {
          console.log("Hey, someone disconnected");
        })
      })
    })
}

//modul mongodb utk koneksi mongo db database
const { exec } = require('child_process');

let start = () => {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
      exec(`powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c net start MongoDB'"`, (err, stdout, stderr) => {
        console.log('Trying to start MongoDB service...');
        setTimeout(start, 15000)
      })
    } else {
      runServer();
    }
  });
}

start();