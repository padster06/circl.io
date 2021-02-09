let socket;
let canvas;
let display;
let username;
let xVel = 0;
let yVel = 0;
let running = false;
let mouseX;
let shooting = false;
let mouseY;
let connection = false;

function init() {
   canvas = document.getElementById('canvas');
   canvas.width = innerWidth;
   canvas.height = innerHeight;
   display = canvas.getContext('2d');
   display.fillStyle = 'rgba(0, 0, 0, 1)';
   display.fillRect(0, 0, canvas.width, canvas.height);

   // begin();
   let vel = 1.2;
   window.addEventListener('keydown', (e) => {
      if (running) {
         if (e.keyCode == 87) {
            yVel = -vel;
         } else if (e.keyCode == 65) {
            xVel = -vel;
         } else if (e.keyCode == 83) {
            yVel = vel;
         } else if (e.keyCode == 68) {
            xVel = vel;
         }
      }
   });

   window.addEventListener('keyup', (e) => {
      if (running) {
         if (e.keyCode == 87) {
            yVel = 0;
         } else if (e.keyCode == 65) {
            xVel = 0;
         } else if (e.keyCode == 83) {
            yVel = 0;
         } else if (e.keyCode == 68) {
            xVel = 0;
         }
      }
   });

   window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
   });

   window.addEventListener('click', (e) => {
      if (running) {
         const options = {
            xVel,
            yVel,
            shooting: true,
            mouseX,
            mouseY,
            start: false,
         };
         socket.send(JSON.stringify(options));
      }
   });

   window.addEventListener('mouseup', (e) => {
      shooting = false;
   });

   socket = new WebSocket('ws://circlio.herokuapp.com/');
   socket.onopen = () => {
      connection = true;
   };
}
function begin() {
   username = document.getElementById('username').value;
   const options = {
      username: username,
      start: true,
   };

   document.getElementById('gameOver').style.display = 'none';

   socket.send(JSON.stringify(options));
   socket.onmessage = ({ data }) => {
      // console.log(data);
      let res;
      res = JSON.parse(data);
      if (res.dead) {
         document.getElementById('gameOver').style.display = 'initial';
         running = false;
         display.fillStyle = 'black';
         display.fillRect(0, 0, canvas.width, canvas.height);
      } else if (running) {
         loop(res);
      }
   };
   running = true;
}

function loop(data) {
   // console.log('loop');
   const options = {
      xVel,
      yVel,
      shooting: false,
      mouseX,
      mouseY,
      start: false,
   };
   socket.send(JSON.stringify(options));
   display.textAlign = 'center';
   display.fillStyle = 'rgba(0, 0, 0, 0.1)';
   display.fillRect(0, 0, canvas.width, canvas.height);
   // console.log(data.players);

   for (var i = 0; i < data.bullets.length; i++) {
      drawBullet(data.bullets[i].x, data.bullets[i].y, data.bullets[i].radius);
   }

   for (let player in data.players) {
      drawPlayer(
         data.players[player].x,
         data.players[player].y,
         data.players[player].color,
         data.players[player].radius,
         data.players[player].username
      );
      // console.log(data.players[player]);
   }
}

function drawPlayer(x, y, color, radius, username) {
   let font = '15px Roboto';
   display.font = font;
   /// draw text from top - makes life easier at the moment
   display.textBaseline = 'top';

   /// color for background
   display.fillStyle = '#000';

   /// get width of text
   var width = display.measureText(username).width;

   /// draw background rect assuming height of font
   display.fillStyle = '#000';
   display.fillRect(
      x - width / 2 - 5,
      y - radius - 15,
      width + 10,
      parseInt(font, 10)
   );
   // console.log('draw');

   /// text color
   display.fillStyle = '#fff';
   display.fillText(username, x, y - radius - 15);
   display.fillStyle = color;
   display.beginPath();
   display.arc(x, y, radius, 0, Math.PI * 2);
   display.fill();
}

function drawBullet(x, y, radius) {
   display.fillStyle = '#fff';
   display.beginPath();
   display.arc(x, y, radius, 0, Math.PI * 2);
   display.fill();
}
