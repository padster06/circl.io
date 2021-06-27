const Player = require('./player');

const recieved = (msg, socket, gameState) => {
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
};

const closed = (gameState, socket) => {
   console.log('disconnected');
   if (gameState.players[socket.id]) {
      delete gameState.players[socket.id];
   }
};

const connected = (socket, gameState, server, clients) => {
   socket.id = server.getUniqueID();
   clients[socket.id] = socket;
   gameState.players[socket.id] = new Player(
      `hsl(${Math.random() * 360}, 50%, 60%)`
   );
   console.log('user connetced');
};

module.exports = { recieved: recieved, closed: closed, connected };
