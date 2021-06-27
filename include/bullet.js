class Bullet {
   constructor(angle, x, y) {
      this.yVel = Math.sin(angle) * 4;
      this.xVel = Math.cos(angle) * 4;
      this.r = 10;
      this.destroy = false;
      this.x = x;
      this.y = y;
      this.origin = {
         x: x,
         y: y,
      };
   }

   draw(d) {
      d.fillStyle = '#fff';
      d.beginPath();
      d.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      d.fill();

      this.x += this.xVel;
      this.y += this.yVel;
   }
}

module.exports.Bullet = Bullet;
