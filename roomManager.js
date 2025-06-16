export default class RoomManager {
  constructor(scene) {
    this.scene = scene;
    this.rooms = {}; // Store room data by name
    this.currentRoom = null;
  }

  addRoom(name, data) {
    this.rooms[name] = data;
  }

  loadRoom(name) {
  if (!this.rooms[name]) {
    console.warn(`Room "${name}" not found`);
    return;
  }

  // Remove existing room props
  if (this.currentRoom && this.currentRoom.props) {
    this.currentRoom.props.forEach(obj => obj.destroy());
  }

  // Load new room
  const roomData = this.rooms[name];
  this.currentRoom = {
    name,
    props: []
  };

  roomData.forEach(prop => {
    const sprite = this.scene.physics.add.sprite(prop.x, prop.y, prop.key)
      .setOrigin(0, 0)
      .setImmovable(true)
      .setDisplaySize(prop.width, prop.height);

    if (prop.bodySize) {
      sprite.body.setSize(prop.bodySize.width, prop.bodySize.height);
    }

    if (prop.bodyOffset) {
      sprite.body.setOffset(prop.bodyOffset.x, prop.bodyOffset.y);
    }

    // ✅ SAFELY ADD COLLIDER
    if (this.scene.player && this.scene.player.body) {
      this.scene.physics.add.collider(this.scene.player, sprite);
    } else {
      console.warn('RoomManager: player not ready for collider');
    }

    this.currentRoom.props.push(sprite);
  });
}
