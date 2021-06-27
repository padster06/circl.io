const Bullet = require('./bullet.js');

class Player {
   constructor(col) {
      this.x = Math.floor(Math.random() * 400);
      this.y = Math.floor(Math.random() * 400);
      this.r = 20;
      this.xVel = 0;
      this.yVel = 0;
      this.shooting = false;
      this.timeout = 0;
      this.kills = 0;
      this.mPos = { x: 0, y: 0 };
      this.username = 'loading...';
      this.col = col;
      this.powerUp = [false, false]; // [0] = burst
   }

   update(gameState, i) {
      this.x += this.xVel;
      this.y += this.yVel;
      if (this.x > 800) {
         this.x = 0;
      } else if (this.x < 0) {
         this.x = 800;
      }

      if (this.y > 800) {
         this.y = 0;
      } else if (this.y < 0) {
         this.y = 800;
      }

      if (this.shooting && this.timeout <= 0) {
         this.createBullet(gameState, i);
         if (this.powerUp[0]) {
            this.timeout = 30;
         } else {
            this.timeout = 20;
         }
      } else if (this.shooting && this.timeout > 0) {
         this.timeout--;
         if (this.powerUp[0]) {
            if (this.timeout == 5 || this.timeout == 10) {
               this.createBullet(gameState, i);
            }
         }
      }
   }

   createBullet(gameState, i) {
      const angle = Math.atan2(this.mPos.y - this.y, this.mPos.x - this.x);
      gameState.bullets.push(new Bullet(angle, this.x, this.y, i, 5));
      gameState.sounds.shooting = true;
   }
}

module.exports = Player;
