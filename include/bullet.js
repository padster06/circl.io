class Bullet {
   constructor(a, x, y, i, s) {
      this.x = x;
      this.y = y;
      this.angle = a;
      this.speed = s;
      this.xVel = Math.cos(this.angle) * this.speed;
      this.yVel = Math.sin(this.angle) * this.speed;
      this.startPos = { x, y };
      this.r = 7;
      this.ownerId = i;
   }

   update(gameState) {
      this.x += this.xVel;
      this.y += this.yVel;
      this.dist = Math.hypot(
         this.x - this.startPos.x,
         this.y - this.startPos.y
      );
      if (this.dist > 800) {
         gameState.bullets.splice(gameState.bullets.indexOf(this), 1);
      }
      this.checkPlayers(gameState);
   }
   checkPlayers(gameState) {
      for (const index in gameState.players) {
         const player = gameState.players[index];
         const dist = Math.hypot(player.x - this.x, player.y - this.y);
         if (dist < 30 && this.ownerId !== index) {
            delete gameState.players[index];
            gameState.bullets.splice(gameState.bullets.indexOf(this), 1);
            gameState.players[this.ownerId].kills++;
            console.log(gameState.players[this.ownerId]);
         }
      }
   }
}

module.exports = Bullet;
