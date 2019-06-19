import { Monster } from './Monster';
import { ASSETS } from '../constants/assets';

export class Mole extends Monster {

  protected WALK_ANIMATION = {
    down: { flip: false, anim: ASSETS.ANIMATIONS.MOLE_WALK_DOWN },
    up: { flip: false, anim: ASSETS.ANIMATIONS.MOLE_WALK_UP },
    left: { flip: true, anim: ASSETS.ANIMATIONS.MOLE_WALK_SIDE },
    right: { flip: false, anim: ASSETS.ANIMATIONS.MOLE_WALK_SIDE },
  };
  protected MONSTER_IDLE_DOWN = ASSETS.ANIMATIONS.MOLE_IDLE_DOWN;

  protected MONSTER_SPEED = 15;

  constructor(scene, x: number = 400, y: number = 400, moveBehavior: integer = 0) {
    super(scene, x, y, moveBehavior, ASSETS.IMAGES.MOLE_IDLE_DOWN);

    this.hp = 3;
    this.setDepth(5);
    this.setCollideWorldBounds(true);
    this.setImmovable(true);

    this.setSize(16, 20);
  }

  protected animateAttack() {
    return undefined;
  }
}
