import RoomManager from './roomManager.js';

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 400,
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
let background;
let collectedIcons = [];
let targetPosition = null;
let tenk1;
let tenk;
let goldy; 
let laptop; 
const speed = 4 * 60;
let collectedCount = 0;
let lastDirection = 'idle';
let idleTimer = 0;
let bedProp;
let rug2;
let whimp;

function preload() {
  this.load.image('background', 'Background_Grey+.png');
  this.load.image('10k1', '10k1.png');
  this.load.image('10k2', '10k2.png');
  this.load.image('10k3', '10k3.png');
  this.load.image('10k4', '10k4.png');
  this.load.image('whimp1', 'whimp1.png');
  this.load.image('whimp2', 'whimp2.png');
  this.load.image('goldy1', 'goldy1.png');
  this.load.image('goldy2', 'goldy2.png');
  this.load.image('goldy3', 'goldy3.png');
  this.load.image('goldy4', 'goldy4.png');
  this.load.image('goldy5', 'goldy5.png');
  this.load.image('goldy6', 'goldy6.png');
  this.load.image('goldy7', 'goldy7.png');
  this.load.image('goldy8', 'goldy8.png');
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
  this.load.image('bed', 'BG_Bed.png'); // Optional second bed
  this.load.image('BG_Bed', 'BG_Bed.png'); // ✅ New prop
  this.load.image('wall', 'wall.png');
  this.load.image('wall2', 'wall2.png');
  this.load.image('wall3', 'wall2.png');
  this.load.image('plant', 'plant.png');
  this.load.image('rug2', 'rug2.png');
  this.load.image('laptop1', 'LaptopDesk.png');
  
  const graphics = this.add.graphics();
  graphics.fillStyle(0x00ff00, 1).fillRect(0, 0, 16, 16); // Only green icon
  graphics.generateTexture('icon', 16, 16);
  graphics.clear().fillStyle(0xffcc00, 1).fillRect(0, 0, 16, 16);
  graphics.generateTexture('item', 16, 16);
  graphics.destroy();
}

function create() {
  background = this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(400, 400);

  rug2 = this.physics.add.sprite(225, 200, 'rug2')
    .setCollideWorldBounds(true)
    .setDisplaySize(142, 85);

   laptop = this.physics.add.sprite(50, 0, 'laptop1')
    .setImmovable(true)
    .setOrigin(0, 0)
    .setDisplaySize(85, 75);
  laptop.body.setSize(60, 35);
  laptop.body.setOffset(0, 0);

  tenk1 = this.physics.add.sprite(36, 50, '10k1')
    .setImmovable(true)
    .setOrigin(0, 0)
    .setDisplaySize(50, 72);
  tenk1.body.setSize(50, 50);
  tenk1.body.setOffset(0, 0);

   // this.physics.add.collider(player, 10k1);
  console.log(tenk1.body);
    this.anims.create({
    key: 'tenk1_anim',
    frames: [
      { key: '10k1' },
      { key: '10k2' },
      { key: '10k3' },
      { key: '10k4' }
    ],
    frameRate: 5,
    repeat: -1
  });

  tenk1.anims.play('tenk1_anim');

  goldy = this.physics.add.sprite(100, -120, 'goldy1')
    .setImmovable(true)
    .setOrigin(0, 0)
    .setDisplaySize(300, 300);
  goldy.body.setSize(100, 100);
  goldy.body.setOffset(0, 0);
  
 // this.physics.add.collider(player, goldy);
  console.log(goldy.body);
    this.anims.create({
    key: 'goldy_anim',
    frames: [
      { key: 'goldy1' },
      { key: 'goldy2' },
      { key: 'goldy3' },
      { key: 'goldy4' },
      { key: 'goldy5' },
      { key: 'goldy6' },
      { key: 'goldy7' },
      { key: 'goldy8' }
    ],
    frameRate: 5,
    repeat: -1
  });

  goldy.anims.play('goldy_anim');
  
  player = this.physics.add.sprite(200, 200, 'idle1')
    .setCollideWorldBounds(true)
    .setDisplaySize(96, 96);
  player.body.setSize(20, 28).setOffset(16, 8);

  // ✅ Add solid bed prop
  bedProp = this.physics.add.sprite(32, 160, 'BG_Bed')
    .setImmovable(true)
    .setOrigin(0, 0)
    .setDisplaySize(120, 60); // Adjust to match image
  bedProp.body.setSize(108, 48);
  bedProp.body.setOffset(4, 18);

  this.physics.add.collider(player, bedProp);

  const whimp = this.physics.add.sprite(64, 150, 'whimp1')
    .setImmovable(true)
    .setOrigin(0, 0)
    .setDisplaySize(48, 48);
  whimp.body.setSize(4, 4).setOffset(16, 32);
  this.physics.add.collider(player, whimp);
  
    console.log(whimp.body);
    this.anims.create({
    key: 'whimp_anim',
    frames: [
      { key: 'whimp1' },
      { key: 'whimp2' }
    ],
    frameRate: 5,
    repeat: -1
  });

  whimp.anims.play('whimp_anim');
  
  // Optional: second decorative bed object
  const wall = this.physics.add.sprite(2, 2, 'wall')
    .setImmovable(true)
    .setOrigin(0, 0)
    .setDisplaySize(24, 400);
  wall.body.setSize(32, 400).setOffset(12, 0);
  this.physics.add.collider(player, wall);

    const wall2 = this.physics.add.sprite(180, -55, 'wall2')
    .setImmovable(true)
    .setOrigin(0, 0)
    .setDisplaySize(80, 100);
  wall2.body.setSize(90, 20).setOffset(30, 40);
  this.physics.add.collider(player, wall2);

    const wall3 = this.physics.add.sprite(20, -50, 'wall2')
    .setImmovable(true)
    .setOrigin(0, 0)
    .setDisplaySize(85, 95);
  wall3.body.setSize(100, 25).setOffset(10, 30);
  this.physics.add.collider(player, wall3);
  
    const plant = this.physics.add.sprite(25, 250, 'plant')
    .setImmovable(true)
    .setOrigin(0, 0)
    .setDisplaySize(59, 96);
  plant.body.setSize(25, 25).setOffset(10, 48);
  this.physics.add.collider(player, plant);

    const tenk = this.physics.add.sprite(50, 75, 'wall2')
    .setImmovable(true)
    .setOrigin(0, 0)
    .setDisplaySize(50, 50);
  tenk.body.setSize(36, 36).setOffset(0, 0);
  this.physics.add.collider(player, tenk);


  // ✅ Setup manual animation for Goldy
  //this.goldyFrames = ['goldy1', 'goldy2', 'goldy3', 'goldy4', 'goldy5', 'goldy6', 'goldy7', 'goldy8'];
  //this.goldyFrameIndex = 0;
  //this.goldyTimer = this.time.addEvent({
   // delay: 180, // 100ms per frame (10 FPS)
   // callback: () => {
   //   this.goldyFrameIndex = (this.goldyFrameIndex + 1) % this.goldyFrames.length;
   //   goldy.setTexture(this.goldyFrames[this.goldyFrameIndex]);
   // },
   // callbackScope: this,
   // loop: true
  //});

  this.anims.create({ key: 'up', frames: [{ key: 'up1' }, { key: 'up2' }], frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'down', frames: [{ key: 'down1' }, { key: 'down2' }], frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'left', frames: [{ key: 'left1' }, { key: 'left2' }], frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'right', frames: [{ key: 'right1' }, { key: 'right2' }], frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'idle', frames: [{ key: 'idle1' }, { key: 'idle2' }], frameRate: 2, repeat: -1 });

  player.anims.play('idle');

    // After player setup
  this.roomManager = new RoomManager(this);
  this.roomManager.addRoom('room1', [
    { x: 2, y: 2, key: 'wall', width: 24, height: 400, bodySize: { width: 32, height: 400 }, bodyOffset: { x: 12, y: 0 } },
    { x: 180, y: -55, key: 'wall2', width: 80, height: 100, bodySize: { width: 90, height: 20 }, bodyOffset: { x: 30, y: 40 } },
    { x: 20, y: -50, key: 'wall2', width: 85, height: 95, bodySize: { width: 100, height: 25 }, bodyOffset: { x: 10, y: 30 } },
    { x: 25, y: 250, key: 'plant', width: 59, height: 96, bodySize: { width: 25, height: 25 }, bodyOffset: { x: 10, y: 48 } }
  ]);
  
  // Load initial room
  this.roomManager.loadRoom('room1');

  // ✅ Function to avoid bedProp area when spawning items
  const safeSpawn = (x, y) => {
    const bedZone = new Phaser.Geom.Rectangle(bedProp.x, bedProp.y, bedProp.displayWidth, bedProp.displayHeight);
    const goldyZone = new Phaser.Geom.Rectangle(goldy.x, goldy.y, goldy.displayWidth, goldy.displayHeight);
     const tenk1Zone = new Phaser.Geom.Rectangle(tenk1.x, tenk1.y, tenk1.displayWidth, tenk1.displayHeight);
    const tenkZone = new Phaser.Geom.Rectangle(tenk.x, tenk.y, tenk.displayWidth, tenk.displayHeight);
    const laptopZone = new Phaser.Geom.Rectangle(laptop.x, laptop.y, laptop.displayWidth, laptop.displayHeight);
    return !bedZone.contains(x, y) && !goldyZone.contains(x, y)  && !laptopZone.contains(x, y) && !tenk1Zone.contains(x, y) && !tenkZone.contains(x, y);
  };

  // ✅ Spawn items in safe positions
  items = this.physics.add.group();
  let attempts = 0;
  while (items.getChildren().length < 3 && attempts < 100) {
    const x = Phaser.Math.Between(50, 350);
    const y = Phaser.Math.Between(50, 350);
    if (safeSpawn(x, y)) {
      const item = items.create(x, y, 'item');
      item.setImmovable(true);
      item.body.setCircle(8); // smaller collision for better pickup feel
    }
    attempts++;
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
