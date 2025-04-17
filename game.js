const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 400,
  parent: 'game-container',
  scene: {
    preload,
    create,
    update
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false // Set to true to visualize hitboxes
    }
  }
};

const game = new Phaser.Game(config);

let player;
let items;
let background;
let collectedIcons = [];
let targetPosition = null;
const speed = 4 * 60;
let collectedCount = 0;
let lastDirection = 'idle';
let idleTimer = 0;

function preload() {
  this.load.image('background', 'Background_Grey+.png');
  this.load.image('up1', 'up1+.png');
  this.load.image('up2', 'up2+.png');
  this.load.image('down1', 'down1+.png');
  this.load.image('down2', 'down2+.png');
  this.load.image('left1', 'left1+.png');
  this.load.image('left2', 'left2+.png');
  this.load.image('right1', 'right1+.png');
  this.load.image('right2', 'right2+.png');
  this.load.image('idle1', 'idle1+.png');
  this.load.image('idle2', 'idle2+.png');
  this.load.image('bed', 'BG_Bed.png'); // Add your bed sprite

  const graphics = this.add.graphics();
  graphics.fillStyle(0xff0000, 1).fillRect(0, 0, 16, 16);
  graphics.generateTexture('item', 16, 16);
  graphics.clear().fillStyle(0x00ff00, 1).fillRect(0, 0, 16, 16);
  graphics.generateTexture('icon', 16, 16);
  graphics.destroy();
}

function create() {
  background = this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(400, 400);

  player = this.physics.add.sprite(200, 200, 'idle1')
    .setCollideWorldBounds(true)
    .setDisplaySize(96, 96);

  player.body.setSize(32, 32).setOffset(1, 1);

  // Bed object setup
  const bed = this.physics.add.sprite(150, 300, 'bed')
    .setImmovable(true)
    .setOrigin(0, 0)
    .setDisplaySize(120, 60); // Resize to match visuals

  bed.body.setSize(100, 25);   // Hitbox width & height
  bed.body.setOffset(10, 30);  // Push hitbox to mattress area

  this.physics.add.collider(player, bed, () => {
    console.log('💥 Player collided with the bed!');
  });

  this.anims.create({ key: 'up', frames: [{ key: 'up1' }, { key: 'up2' }], frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'down', frames: [{ key: 'down1' }, { key: 'down2' }], frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'left', frames: [{ key: 'left1' }, { key: 'left2' }], frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'right', frames: [{ key: 'right1' }, { key: 'right2' }], frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'idle', frames: [{ key: 'idle1' }, { key: 'idle2' }], frameRate: 2, repeat: -1 });

  player.anims.play('idle');

  items = this.physics.add.group();
  for (let i = 0; i < 3; i++) {
    const x = Phaser.Math.Between(50, 350);
    const y = Phaser.Math.Between(50, 350);
    const item = items.create(x, y, 'item');
    item.setImmovable(true);
    item.body.setCircle(16);
  }

  this.physics.add.overlap(player, items, collectItem, null, this);

  this.input.on('pointerdown', pointer => {
    targetPosition = new Phaser.Math.Vector2(pointer.x, pointer.y);
  });
}

function update(time, delta) {
  player.setVelocity(0);

  if (targetPosition) {
    const dist = Phaser.Math.Distance.Between(player.x, player.y, targetPosition.x, targetPosition.y);

    if (dist > 4) {
      this.physics.moveToObject(player, targetPosition, speed);

      const dx = targetPosition.x - player.x;
      const dy = targetPosition.y - player.y;

      let direction = lastDirection;

      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? 'right' : 'left';
      } else {
        direction = dy > 0 ? 'down' : 'up';
      }

      if (direction !== lastDirection || player.anims.currentAnim?.key !== direction) {
        player.anims.play(direction, true);
        lastDirection = direction;
      }

      idleTimer = 0;
    } else {
      stopPlayerMovement();
    }
  } else {
    if (
      player.body.blocked.left ||
      player.body.blocked.right ||
      player.body.blocked.up ||
      player.body.blocked.down
    ) {
      stopPlayerMovement();
    }

    idleTimer += delta;

    if (idleTimer > 1000 && lastDirection !== 'idle') {
      player.anims.play('idle', true);
      lastDirection = 'idle';
    }
  }

  player.x = Phaser.Math.Clamp(player.x, 0, config.width);
  player.y = Phaser.Math.Clamp(player.y, 0, config.height);
}

function stopPlayerMovement() {
  player.setVelocity(0);
  targetPosition = null;
  idleTimer = 0;

  if (lastDirection !== 'idle') {
    player.anims.play('idle', true);
    lastDirection = 'idle';
  }
}

function collectItem(player, item) {
  item.destroy();

  const icon = game.scene.scenes[0].add.image(10 + collectedCount * 18, 10, 'icon').setScrollFactor(0).setOrigin(0, 0);
  collectedIcons.push(icon);
  collectedCount++;

  if (collectedCount === 3) {
    const victoryObject = game.scene.scenes[0].add.image(350, 350, 'item').setScrollFactor(0).setInteractive();
    victoryObject.on('pointerdown', () => {
      alert('🎉 Victory! All items collected!');
      window.mintPrizeNFT?.();
    });
  }
}
