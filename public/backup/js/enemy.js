class Enemy {
   constructor(c) {
      this.radius = Math.random() * 20 + 10;
      if (Math.random() < 0.5) {
         if (Math.random() < 0.5) {
            this.x = 0 + this.radius;
         } else {
            this.x = c.width + this.radius;
         }
         this.y = Math.random() * c.height;
      } else {
         this.x = Math.random() * c.width;
         if (Math.random() < 0.5) {
            this.y = 0 + this.radius;
         } else {
            this.y = c.height - this.radius;
         }
      }

      this.angle = Math.atan2(c.height / 2 - this.y, c.width / 2 - this.x);
      this.destroy = false;
      this.xVel = Math.cos(this.angle) / 1.5;
      this.yVel = Math.sin(this.angle) / 1.5;

      this.color = `hsl(${Math.random() * 360}, 50%, 40%)`;
   }

   draw(d, x, y) {
      this.angle = Math.atan2(y - this.y, x - this.x);
      this.xVel = Math.cos(this.angle) / 1.5;
      this.yVel = Math.sin(this.angle) / 1.5;
      this.x += this.xVel;
      this.y += this.yVel;

      d.fillStyle = this.color;
      d.beginPath();
      d.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      d.fill();
   }

   collision(c) {
      if (this.x - this.radius < -10 || this.x - this.radius > c.width + 10) {
         return true;
      } else if (
         this.y - this.radius < -10 ||
         this.y + this.radius > c.height + 10
      ) {
         return true;
      } else {
         return false;
      }
   }

   hit(p) {
      var distance = Math.hypot(p.x - this.x, p.y - this.y);

      if (distance - this.radius - p.radius < 1) {
         if (this.radius - 10 > 10) {
            this.radius -= 10;
         } else {
            this.destroy = true;
         }
         p.destroy = true;
      }
   }
}
