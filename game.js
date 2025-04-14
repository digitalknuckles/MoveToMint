// game.js

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 400,
  backgroundColor: '#1e1e1e',
  parent: 'game-container',
  scene: {
    preload: preload,
    create: create,
    update: update
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
let collectedIcons = [];
let targetPosition = null;
const speed = 4 * 60;
let collectedCount = 0;

function preload() {
  // Placeholder graphics created in create()
}

function create() {
  const graphics = this.add.graphics();

  graphics.fillStyle(0xffffff, 1);
  graphics.fillRect(0, 0, 32, 32);
  graphics.generateTexture('player', 32, 32);

  graphics.clear();
  graphics.fillStyle(0xff0000, 1);
  graphics.fillRect(0, 0, 16, 16);
  graphics.generateTexture('item', 16, 16);

  graphics.clear();
  graphics.fillStyle(0x00ff00, 1);
  graphics.fillRect(0, 0, 16, 16);
  graphics.generateTexture('icon', 16, 16);

  graphics.destroy();

  player = this.physics.add.sprite(200, 200, 'player');
  player.setCollideWorldBounds(true);

  items = this.physics.add.group();
  for (let i = 0; i < 3; i++) {
    const x = Phaser.Math.Between(50, 350);
    const y = Phaser.Math.Between(50, 350);
    items.create(x, y, 'item');
  }

  this.physics.add.overlap(player, items, collectItem, null, this);

  this.input.on('pointerdown', pointer => {
    targetPosition = new Phaser.Math.Vector2(pointer.x, pointer.y);
  });
}

function update() {
  player.setVelocity(0);

  if (targetPosition) {
    const distance = Phaser.Math.Distance.Between(player.x, player.y, targetPosition.x, targetPosition.y);

    if (distance > 4) {
      this.physics.moveToObject(player, targetPosition, speed);
    } else {
      player.setVelocity(0);
      player.x = targetPosition.x;
      player.y = targetPosition.y;
      targetPosition = null;
    }
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
      window.mintPrizeNFT();
    });
  }
}
