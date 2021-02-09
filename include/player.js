class Player {
   constructor(username, socket) {
      this.x = 100;
      this.y = 100;
      this.socket = socket;
      this.radius = 20;
      this.moveUp = false;
      this.moveLeft = false;
      this.moveDown = false;
      this.moveRight = false;
      this.username = username;
      this.color = `hsl(${Math.random() * 360}, 50%, 60%)`;
   }

   draw(d) {
      if (this.moveUp) {
         this.y--;
      }
      if (this.moveDown) {
         this.y++;
      }
      if (this.moveLeft) {
         this.x--;
      }
      if (this.moveRight) {
         this.x++;
      }
      if (this.x < 0) {
         this.x = canvas.width;
      } else if (this.x > canvas.width) {
         this.x = 0;
      } else if (this.y < 0) {
         this.y = canvas.height;
      } else if (this.y > canvas.height) {
         this.y = 0;
      }

      d.fillStyle = this.color;
      d.beginPath();
      d.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      d.fill();
      d.fillStyle = '#000';

      let font = '15px Roboto';
      d.font = font;
      /// draw text from top - makes life easier at the moment
      d.textBaseline = 'top';

      /// color for background
      d.fillStyle = '#000';

      /// get width of text
      var width = d.measureText(this.username).width;

      /// draw background rect assuming height of font
      d.fillRect(
         this.x - width / 2 - 5,
         this.y - this.radius - 15,
         width + 10,
         parseInt(font, 10)
      );

      /// text color
      d.fillStyle = '#fff';
      d.fillText(this.username, this.x, this.y - this.radius - 15);
   }

   collision(x, y, r) {
      var distance = Math.hypot(x - this.x, y - this.y);
      if (distance - r - this.radius < 1) {
         return true;
      } else {
         return false;
      }
   }
}

module.exports.Player = Player;
