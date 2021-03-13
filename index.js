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
         mPos: { x: 0, y: 0 },
         shooting: false,
         timeout: 0,
         col: `hsl(${Math.random() * 360}, 50%, 50%)`,
         username: 'bot',
      },
   },
   bullets: [],
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
      timeout: 0,
      x: 200,
      mPos: { x: 0, y: 0 },
      y: 200,
      username: 'loading...',
      shooting: false,
      col: `hsl(${Math.random() * 360}, 50%, 50%)`,
   };
   console.log('user connetced');
   socket.on('message', (msg) => {
      const data = JSON.parse(msg);
      if (data.username) {
         gameState.players[socket.id].username = data.username;
      } else if (data.xVel != null && data.yVel !== null) {
         gameState.players[socket.id].xVel = data.xVel;
         gameState.players[socket.id].yVel = data.yVel;
         console.log(data);
      } else if (data.shootBool !== null) {
         gameState.players[socket.id].shooting = data.shootBool;
         gameState.players[socket.id].mPos.y = data.mouseY;
         gameState.players[socket.id].mPos.x = data.mouseX;
      }
   });
   socket.on('close', function () {
      console.log('disconnected');
      if (gameState.players[socket.id]) {
         delete gameState.players[socket.id];
      }
      // console.log(gameObj);
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
      if (player.x > 800) {
         player.x = 0;
      } else if (player.x < 0) {
         player.x = 800;
      }

      if (player.y > 800) {
         player.y = 0;
      } else if (player.y < 0) {
         player.y = 800;
      }
      if (player.shooting && player.timeout <= 0) {
         const angle = Math.atan2(
            player.mPos.y - player.y,
            player.mPos.x - player.x
         );
         gameState.bullets.push({
            x: player.x,
            y: player.y,
            angle,
            xVel: Math.cos(angle) * 5,
            yVel: Math.sin(angle) * 5,
            startPos: { x: player.x, y: player.y },
            dist: 0,
            ownerId: index,
         });
         player.timeout = 20;
      } else if (player.shooting && player.timeout > 0) {
         player.timeout--;
      }
   }
   for (const client in clients) {
      clients[client].send(
         JSON.stringify({
            id: client,
            gameState,
         })
      );
   }
   for (const bullet of gameState.bullets) {
      bullet.x += bullet.xVel;
      bullet.y += bullet.yVel;
      bullet.dist = Math.hypot(
         bullet.x - bullet.startPos.x,
         bullet.y - bullet.startPos.y
      );
      if (bullet.dist > 800) {
         gameState.bullets.splice(gameState.bullets.indexOf(bullet), 1);
      }

      for (const index in gameState.players) {
         const player = gameState.players[index];
         const dist = Math.hypot(player.x - bullet.x, player.y - bullet.y);
         if (dist < 30 && bullet.ownerId !== index) {
            delete gameState.players[index];
            gameState.bullets.splice(gameState.bullets.indexOf(bullet), 1);
         }
      }
   }

   setTimeout(mainLoop, 1000 / 60);
}

mainLoop();
