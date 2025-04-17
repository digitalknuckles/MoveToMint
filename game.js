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
      debug: false
    }
  }
};

const game = new Phaser.Game(config);

let player;
let items;
let background;
let bed;
let collectedIcons = [];
let targetPosition = null;
const speed = 240;
let collectedCount = 0;
let lastDirection = 'idle';
let idleTimer = 0;
let bedBounds;

function preload() {
  this.load.image('background', 'Background_Grey+.png');
  this.load.image('bg_bed', 'BG_Bed.png');
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

  const graphics = this.add.graphics();
  graphics.fillStyle(0xff0000, 1).fillRect(0, 0, 16, 16);
  graphics.generateTexture('item', 16, 16);
  graphics.clear().fillStyle(0x00ff00, 1).fillRect(0, 0, 16, 16);
  graphics.generateTexture('icon', 16, 16);
  graphics.destroy();
}

function create() {
  background = this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(400, 400);

  // Add bed object
  bed = this.physics.add.staticImage(32, 200, 'bg_bed').setOrigin(0, 0);
  bedBounds = bed.getBounds();

  // Debug rectangle for bed
  const debug = this.add.graphics();
  debug.lineStyle(2, 0xff0000, 1).strokeRectShape(bedBounds);

  // Player setup
  player = this.physics.add.sprite(200, 200, 'idle1')
    .setCollideWorldBounds(true)
    .setDisplaySize(96, 96);

  player.body.setSize(32, 32).setOffset(1, 1);

  // Animations
  this.anims.create({ key: 'up', frames: [{ key: 'up1' }, { key: 'up2' }], frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'down', frames: [{ key: 'down1' }, { key: 'down2' }], frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'left', frames: [{ key: 'left1' }, { key: 'left2' }], frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'right', frames: [{ key: 'right1' }, { key: 'right2' }], frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'idle', frames: [{ key: 'idle1' }, { key: 'idle2' }], frameRate: 2, repeat: -1 });

  player.anims.play('idle');

  // Items group
  items = this.physics.add.group();
  for (let i = 0; i < 3; i++) {
    let x, y, overlap;
    do {
      x = Phaser.Math.Between(50, 350);
      y = Phaser.Math.Between(50, 350);
      const itemRect = new Phaser.Geom.Rectangle(x - 8, y - 8, 16, 16);
      overlap = Phaser.Geom.Rectangle.Overlaps(bedBounds, itemRect);
    } while (overlap);

    const item = items.create(x, y, 'item');
    item.setImmovable(true);
    item.body.setCircle(16);
  }

  this.physics.add.overlap(player, items, collectItem, null, this);
  this.physics.add.collider(player, bed);

  // Click to move
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

  const icon = game.scene.scenes[0].add.image(10 + collectedCount * 18, 10, 'icon')
    .setScrollFactor(0)
    .setOrigin(0, 0);

  collectedIcons.push(icon);
  collectedCount++;

  if (collectedCount === 3) {
    const victoryObject = game.scene.scenes[0].add.image(350, 350, 'item')
      .setScrollFactor(0)
      .setInteractive();

    victoryObject.on('pointerdown', () => {
      alert('🎉 Victory! All items collected!');
      window.mintPrizeNFT?.();
    });
  }
}
