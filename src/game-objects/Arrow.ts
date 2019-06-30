import { Orientation } from '../geometry/orientation';
import { Player } from './Player';
import { ASSETS } from '../constants/assets/assets';

const ARROW_SPEED = 150;

export class Arrow extends Phaser.Physics.Arcade.Sprite {
  public scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, player: Player, direction: Orientation) {
    let xPos = player.x;
    let yPos = player.y;

    switch (direction) {
      case Orientation.Up:
        yPos -= 16;
        break;
      case Orientation.Down:
        yPos += 8;
        break;
      case Orientation.Left:
        yPos += 4;
        xPos -= 8;
        break;
      case Orientation.Right:
        yPos += 4;
        xPos += 8;
        break;
      default:
        break;
    }

    super(scene, xPos, yPos, ASSETS.IMAGES.ARROW);
    this.scene = scene;

    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    this.setDepth(1000);

    switch (direction) {
      case Orientation.Up:
        this.setVelocityY(-ARROW_SPEED);
        break;
      case Orientation.Down:
        this.setVelocityY(ARROW_SPEED);
        this.setRotation(Math.PI);
        break;
      case Orientation.Left:
        this.setVelocityX(-ARROW_SPEED);
        this.setRotation(-Math.PI / 2);
        break;
      case Orientation.Right:
        this.setVelocityX(ARROW_SPEED);
        this.setRotation(Math.PI / 2);
        break;
      default:
        break;
    }
  }
}
