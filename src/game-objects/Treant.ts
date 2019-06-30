import { Monster } from './Monster';
import { ASSETS } from '../constants/assets/assets';

// const DESTROY_SPRITE_ATTACK_DELAY = 200;

export class Treant extends Monster {
  protected WALK_ANIMATION = {
    down: { flip: false, anim: ASSETS.ANIMATIONS.TREANT_WALK_DOWN },
    up: { flip: false, anim: ASSETS.ANIMATIONS.TREANT_WALK_UP },
    left: { flip: true, anim: ASSETS.ANIMATIONS.TREANT_WALK_SIDE },
    right: { flip: false, anim: ASSETS.ANIMATIONS.TREANT_WALK_SIDE },
  };
  protected MONSTER_IDLE_DOWN = ASSETS.ANIMATIONS.TREANT_IDLE_DOWN;

  protected MONSTER_SPEED = 14;

  constructor(scene, type: string, x: number = 400, y: number = 400, moveBehavior: integer = 0) {
    super(scene, type, x, y, moveBehavior, ASSETS.IMAGES.TREANT_IDLE_DOWN);

    this.hp = 3;
    this.setDepth(5);
    this.setCollideWorldBounds(true);
    this.setImmovable(true);
    this.setIsPacifier(true);

    this.setSize(22, 28);
  }

  protected animateAttack() {
    // TODO
    // const treantAttack = this.scene.physics.add.sprite(
    //   this.scene.player.x,
    //   this.scene.player.y,
    //   ASSETS.IMAGES.TREANT_ATTACK,
    // );
    // this.scene.time.addEvent({
    //   delay: DESTROY_SPRITE_ATTACK_DELAY,
    //   callback: () => (treantAttack ? treantAttack.destroy() : null),
    //   callbackScope: this,
    // });
  }

}
