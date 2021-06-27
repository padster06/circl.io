let webSoscket;
let username;
let canvas;
let display;
let moving = false;
let mouseY, mouseX;
let vel = { x: 0, y: 0, curX: 0, curY: 0 };
let angle;
let lerpVal = 0;
let curAngle = null;
let speed = 4;
let x = 100;
let shooting = { cur: false, local: false };
let y = 100;
let score = 0;
let shotSound;

function init() {
   shotSound = new Audio('audio/shot.wav');
   canvas = document.getElementById('canvas');
   canvas.width = 800;
   canvas.height = 800;
   display = canvas.getContext('2d');
   display.textAlign = 'center';
   display.textBaseline = 'middle';

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
   canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseY = e.clientY - rect.top;
      mouseX = e.clientX - rect.left;

      if (shooting.cur && webSoscket) {
         const shootBool = shooting.cur;
         webSoscket.send(JSON.stringify({ shootBool, mouseX, mouseY }));
         console.log(mouseX);
      }
   });
   window.addEventListener('mousedown', () => (shooting.local = true));
   window.addEventListener('mouseup', () => (shooting.local = false));

   document.getElementById('highScore').textContent = `HIGHSCORE: ${
      localStorage.getItem('high score') || 0
   }`;
}

function start() {
   document.getElementById('gameOver').style.display = 'none';
   username = document.getElementById('user-input').value;
   console.log(username);
   webSoscket = new WebSocket(location.origin.replace(/^http/, 'ws'));
   webSoscket.onopen = () => {
      webSoscket.onmessage = (msg) => {
         const data = JSON.parse(msg.data);
         if (data.gameState.players[data.id]) {
            loop(data);
         } else {
            document.getElementById('gameOver').style.display = 'initial';
            display.fillStyle = 'black';
            display.fillRect(0, 0, canvas.width, canvas.height);
            webSoscket.close();
            if (!localStorage.getItem('high score')) {
               localStorage.setItem('high score', score);
               document.getElementById(
                  'highScore'
               ).textContent = `HIGHSCORE: ${score}`;
            } else if (localStorage.getItem('high score') < score) {
               localStorage.setItem('high score', score);
               document.getElementById(
                  'highScore'
               ).textContent = `HIGHSCORE: ${score}`;
            }
         }
      };
      webSoscket.send(JSON.stringify({ username }));
   };
}

function loop(data) {
   if (curAngle == null) {
   }

   display.fillStyle = 'rgba(0, 0,0, 0.5)';
   display.fillRect(0, 0, canvas.width, canvas.height);
   if (data.gameState.sounds.shooting) {
      shotSound.pause();
      shotSound.play();
   }

   for (const index in data.gameState.players) {
      const player = data.gameState.players[index];

      if (index === data.id) {
         display.beginPath();
         display.arc(player.x, player.y, 20, Math.PI * 2, 0);
         display.fillStyle = player.col;
         display.fill();

         document.getElementById(
            'score'
         ).textContent = `SCORE: ${player.kills}`;
         score = player.kills;
         // console.log(player);
      } else {
         display.beginPath();
         display.arc(player.x, player.y, 20, Math.PI * 2, 0);
         display.strokeStyle = player.col;
         display.fillStyle = 'black';
         display.lineWidth = 3;
         display.fill();
         display.stroke();
         display.fillStyle = player.col;
         display.fillText(player.username, player.x, player.y);
      }
   }

   for (const bullet of data.gameState.bullets) {
      display.fillStyle = '#aaa';
      display.beginPath();
      display.arc(bullet.x, bullet.y, 7, 0, Math.PI * 2);
      display.fill();
   }

   const player = data.gameState.players[data.id];

   if (shooting.cur !== shooting.local) {
      shooting.cur = shooting.local;
      const shootBool = shooting.cur;
      webSoscket.send(JSON.stringify({ shootBool, mouseX, mouseY }));
      console.log(shootBool);
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
