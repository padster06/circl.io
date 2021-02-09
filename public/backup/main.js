var canvas;
var d;
var player;
var projectiles = [];
var enemies = [];
var running = false;
var gameLoop;
var makeEnemies;
var restartBtn;
var highscore = localStorage.getItem('high') || 0;
var score;
var color;
var scoreEl;
var mouseX;
var socket;
var mouseY;
var username;
var players = [];
var highscoreEl;

function init() {
   socket = new WebSocket('ws://localhost:4000');
   console.log(localStorage.getItem('high'));
   highscoreEl = document.getElementById('highScore');
   scoreEl = document.getElementById('score');
   restartBtn = document.getElementById('restart');
   restartBtn.addEventListener('click', () => {
      begin();
   });

   color = `hsl(${Math.random() * 360}, 50%, 50%)`;
   document.getElementById('gameOver').style.borderColor = color;
   restartBtn.style.backgroundColor = color;
   scoreEl.style.color = color;
   highscoreEl.style.color = color;
   document.querySelector('#name').style.color = color;

   canvas = document.getElementById('canvas');
   canvas.height = innerHeight;
   canvas.width = innerWidth;
   d = canvas.getContext('2d');
   gameLoop = setInterval(loop, 1);

   window.addEventListener('click', (e) => {
      if (running) {
         var angle = Math.atan2(mouseY - player.y, mouseX - player.x);
         projectiles.push(new Projectile(angle, canvas, player.x, player.y));
      }
   });

   window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
   });

   window.addEventListener('keydown', (e) => {
      if (running) {
         if (e.keyCode == 87) {
            player.moveUp = true;
         } else if (e.keyCode == 65) {
            player.moveLeft = true;
         } else if (e.keyCode == 83) {
            player.moveDown = true;
         } else if (e.keyCode == 68) {
            player.moveRight = true;
         }
      }
   });

   window.addEventListener('keyup', (e) => {
      if (running) {
         if (e.keyCode == 87) {
            player.moveUp = false;
         } else if (e.keyCode == 65) {
            player.moveLeft = false;
         } else if (e.keyCode == 83) {
            player.moveDown = false;
         } else if (e.keyCode == 68) {
            player.moveRight = false;
         }
      }
   });

   socket.onmessage = ({ data }) => {
      console.log(data);
   };
   // begin();
}

function begin() {
   color = `hsl(${Math.random() * 360}, 50%, 50%)`;
   document.getElementById('gameOver').style.borderColor = color;
   restartBtn.style.backgroundColor = color;
   scoreEl.style.color = color;
   highscoreEl.style.color = color;
   document.querySelector('#name').style.color = color;
   username = document.getElementById('username').value;
   console.log(username);
   score = 0;
   document.getElementById('gameOver').style.visibility = 'hidden';

   player = new Player(canvas, username);

   makeEnemies = setInterval(() => {
      enemies.push(new Enemy(canvas));
   }, 1000);

   gameLoop = setInterval(loop, 1);

   running = true;
   d.textAlign = 'center';
   let options = {
      player: player,
      username: username,
   };
   console.log(options.player);
   socket.send(JSON.stringify(options));
}

function loop() {
   highscoreEl.textContent = `HIGHSCORE: ${highscore}`;
   d.fillStyle = 'rgba(0, 0, 0, 0.1)';
   d.fillRect(0, 0, canvas.width, canvas.height);
   if (running) {
      scoreEl.textContent = `SCORE: ${score}`;
      for (var i = 0; i < enemies.length; i++) {
         enemies[i].draw(d, player.x, player.y);
         if (player.collision(enemies[i].x, enemies[i].y, enemies[i].radius)) {
            running = false;
         }
         for (var j = 0; j < projectiles.length; j++) {
            enemies[i].hit(projectiles[j]);
         }
         if (enemies[i].collision(canvas) || enemies[i].destroy) {
            if (enemies[i].destroy) {
               console.log('score');
               score++;
            }
            enemies.splice(i, 1);
         }
      }

      for (let i = 0; i < projectiles.length; i++) {
         projectiles[i].draw(d);
         if (projectiles[i].destroy) {
            projectiles.splice(i, 1);
         }
      }

      player.draw(d);
   } else {
      setTimeout(() => {
         document.getElementById('gameOver').style.visibility = 'visible';
         clearInterval(gameLoop);
         clearInterval(makeEnemies);

         projectiles = [];
         enemies = [];
         player = null;
      }, 500);
   }
   if (score > highscore) {
      highscore = score;
      localStorage.setItem('high', score);
   }
}
