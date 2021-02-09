const express = require('express');
const app = express();
const http = require('http').createServer(app);
const WebSoscket = require('ws');
const server = new WebSoscket.Server({ server: http });
const PlayerJS = require('./include/player');
const BulletJS = require('./include/bullet');
let gameObj = { players: {}, bullets: [] };

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
   socket.on('message', (msg) => {
      const obj = JSON.parse(msg);
      // console.log(players);
      if (obj.start == false) {
         if (gameObj.players[socket.id]) {
            gameObj.players[socket.id].x += obj.xVel;
            gameObj.players[socket.id].y += obj.yVel;
            if (obj.shooting) {
               const angle = Math.atan2(
                  obj.mouseY - gameObj.players[socket.id].y,
                  obj.mouseX - gameObj.players[socket.id].x
               );

               gameObj.bullets.push(
                  new BulletJS.Bullet(
                     angle,
                     gameObj.players[socket.id].x,
                     gameObj.players[socket.id].y
                  )
               );
            }
         }
      } else if (obj.start) {
         gameObj.players[socket.id] = new PlayerJS.Player(obj.username, socket);
      } else {
         console.log(msg);
      }
      // console.log(gameObj.players[socket.id]);
      // console.log(gameObj);
   });
   socket.on('disconnect', function () {
      console.log('disconnected');
      gameObj.players[socket.id] = null;
      console.log(gameObj);
   });
});

app.use(express.static('./public'));

http.listen(process.env.PORT || 4000, () => {
   console.log('server lsitening');
});

function mainLoop() {
   for (let i = 0; i < gameObj.bullets.length; i++) {
      const e = gameObj.bullets[i];
      e.x += e.xVel;
      e.y += e.yVel;
      const originDist = Math.hypot(e.origin.x - e.x, e.y - e.origin.y);

      for (const j in gameObj.players) {
         const x = gameObj.players[j];

         const dist = Math.hypot(e.x - x.x, x.y - e.y);
         if (
            dist - e.radius - x.radius <= 0 &&
            originDist > x.radius + e.radius + 20
         ) {
            x.socket.send(
               JSON.stringify({
                  dead: true,
               })
            );
            delete gameObj.players[j];
         }
      }
      if (originDist > 1000) {
         gameObj.bullets.splice(i, 1);
      }
   }
   // console.log('loop');

   server.clients.forEach((client) => {
      var newGameObj = { ...gameObj };
      client.send(JSON.stringify(newGameObj));
   });

   // console.log(newGameObj);
   setTimeout(mainLoop, 1000 / 240);
}

mainLoop();

function createBullet(x, y, mouseX, mouseY, bool) {}
