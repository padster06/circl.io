class Projectile {
   constructor(angle, canvas, x, y) {
      this.x = x;
      this.y = y;
      this.yVel = Math.sin(angle) * 2;
      this.xVel = Math.cos(angle) * 2;
      this.radius = 10;
      this.destroy = false;
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
