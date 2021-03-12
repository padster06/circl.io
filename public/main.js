let webSoscket;
let username;
let canvas;
let display;
let moving = false;
let mouse = { x: 0, y: 0 };
let vel = { x: 0, y: 0, curX: 0, curY: 0 };
let angle;
let lerpVal = 0;
let curAngle = null;
let speed = 4;

function init() {
   canvas = document.getElementById('canvas');
   canvas.width = innerWidth;
   canvas.height = innerHeight;
   display = canvas.getContext('2d');
   window.addEventListener('keydown', (e) => {
      switch (e.key) {
         case 'w':
            vel.y = -speed;
            break;
         case 's':
            vel.y = speed;
            break;
         case 'a':
            vel.x = -speed;
            break;
         case 'd':
            vel.x = speed;
            break;
         default:
            console.log(e.key);
      }
   });
   window.addEventListener('keyup', (e) => {
      switch (e.key) {
         case 'w':
            vel.y = 0;
            break;
         case 's':
            vel.y = 0;
            break;
         case 'a':
            vel.x = 0;
            break;
         case 'd':
            vel.x = 0;
            break;
      }
   });
   window.addEventListener('mousemove', (e) => {
      mouse.y = e.clientY;
      mouse.x = e.clientX;
   });
}

function start() {
   document.getElementById('gameOver').style.display = 'none';
   username = document.getElementById('username').value;
   webSoscket = new WebSocket(location.origin.replace(/^http/, 'ws'));
   webSoscket.onopen = () => {
      webSoscket.send(JSON.stringify({ username }));
      webSoscket.onmessage = (msg) => {
         const data = JSON.parse(msg.data);
         // if (data.gameState.players[data.id]) {
         loop(data);
         // } else {
         //    document.getElementById('gameOver').style.display = 'initial';
         //    display.fillStyle = 'black';
         //    display.fillRect(0, 0, canvas.width, canvas.height);
         //    webSoscket.close();
         // }
      };
   };
}

function loop(data) {
   if (curAngle == null) {
   }
   display.fillStyle = '#000';
   display.fillRect(0, 0, canvas.width, canvas.height);

   for (const index in data.gameState.players) {
      const player = data.gameState.players[index];
      display.beginPath();
      display.arc(player.x, player.y, 20, Math.PI * 2, 0);
      display.fillStyle = player.col;
      display.fill();
   }

   if (vel.curX != vel.x || vel.curY != vel.y) {
      vel.curX = vel.x;
      vel.curY = vel.y;
      const xVel = vel.curX;
      const yVel = vel.curY;
      console.log(xVel);
      webSoscket.send(JSON.stringify({ xVel, yVel }));
   }
}

function lerp(min, max, value) {
   return (min - max) * value + min;
}
