const express = require('express');
const app = express();
const http = require('http').createServer(app);
const WebSoscket = require('ws');
const server = new WebSoscket.Server({ server: http });

let clients = {};
let gameState = {
   players: {
      p1: {
         xVel: 1,
         yVel: 1,
         x: 20,
         y: 20,
         col: 'hsl(53, 50%, 50%)',
      },
   },
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
   clients[socket.id] = socket;
   gameState.players[socket.id] = {
      xVel: 0,
      yVel: 0,
      x: 200,
      y: 200,
      col: 'hsl(53, 50%, 50%)',
   };
   console.log('user connetced');
   socket.on('message', (msg) => {
      const data = JSON.parse(msg);
      if (data.xVel != null && data.yVel !== null) {
         gameState.players[socket.id].xVel = data.xVel;
         gameState.players[socket.id].yVel = data.yVel;
         console.log(data);
      } else {
         console.log('haha');
      }
   });
   socket.on('disconnect', function () {
      console.log('disconnected');
      delete gameObj.players[socket.id];
      console.log(gameObj);
   });
});

app.use(express.static('./public'));

http.listen(process.env.PORT || 4000, () => {
   console.log('server lsitening');
});

function mainLoop() {
   for (const index in gameState.players) {
      const player = gameState.players[index];
      player.x += player.xVel;
      player.y += player.yVel;
   }
   for (const client in clients) {
      clients[client].send(
         JSON.stringify({
            id: client,
            gameState,
         })
      );
   }
   setTimeout(mainLoop, 1000 / 60);
}

mainLoop();
