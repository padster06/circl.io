const express = require('express');
const app = express();
const http = require('http').createServer(app);
const WebSoscket = require('ws');

server.broadcast = (data, sender) => {
   server.clients.forEach(function (client) {
      if (client !== sender) {
         client.send(data);
      }
   });
};

server.getUniqueID = function () {
   function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
         .toString(16)
         .substring(1);
   }
   return s4() + s4() + '-' + s4();
};

server.on('connection', (socket) => {
   socket.id = server.getUniqueID();
   console.log('user connetced');
   socket.on('message', (msg) => {});
   socket.on('disconnect', function () {
      console.log('disconnected');
   });
});

app.use(express.static('./public'));

http.listen(process.env.PORT || 4000, () => {
   console.log('server lsitening');
});

function mainLoop() {
   // console.log(newGameObj);
   setTimeout(mainLoop, 1000 / 240);
}

mainLoop();
