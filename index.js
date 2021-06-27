const express = require('express');
const app = express();
const http = require('http').createServer(app);
const WebSoscket = require('ws');
const server = new WebSoscket.Server({ server: http });
const Player = require('./include/player.js');
const { recieved, closed, connected } = require('./include/scoketFuncts.js');

let clients = {};
let gameState = {
   sounds: {
      shooting: false,
   },
   players: {
      p1: new Player(`hsl(${Math.random() * 360}, 50%, 50%)`),
   },
   bullets: [],
};

gameState.players.p1.username = 'bot';
gameState.players.p1.xVel = 1;
server.getUniqueID = function () {
   function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
         .toString(16)
         .substring(1);
   }
   return s4() + s4() + '-' + s4();
};

server.on('connection', (socket) => {
   connected(socket, gameState, server, clients);
   socket.on('message', (msg) => recieved(msg, socket, gameState));
   socket.on('close', () => closed(gameState, socket));
});

app.use(express.static('./public'));

const port = process.env.PORT || 4000;

http.listen(port, () => {
   console.log(`server listening on http://localhost:${port}`);
});

function mainLoop() {
   for (const index in gameState.players) {
      const player = gameState.players[index];
      player.update(gameState, index);
   }
   for (const bullet of gameState.bullets) {
      bullet.update(gameState);
   }
   sendGame();
   gameState.sounds.shooting = false;

   setTimeout(mainLoop, 1000 / 60);
}

function sendGame() {
   for (const client in clients) {
      clients[client].send(
         JSON.stringify({
            id: client,
            gameState,
         })
      );
   }
}

mainLoop();
