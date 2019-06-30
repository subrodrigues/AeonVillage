import { Orientation } from '../geometry/orientation';
import { Character } from './Character';
import { Arrow } from './Arrow';
import { Monster } from './Monster';
import { AbstractScene } from '../scenes/AbstractScene';
import { ASSETS } from '../constants/assets/assets';

const HIT_DELAY = 2000;
const PLAYER_SPEED = 16;

export class Player extends Character {
  public static MAX_HP = 3;

  private static MOVE_ANIMATION = {
    down: { flip: false, anim: ASSETS.ANIMATIONS.PLAYER_MOVE_DOWN },
    up: { flip: false, anim: ASSETS.ANIMATIONS.PLAYER_MOVE_UP },
    left: { flip: true, anim: ASSETS.ANIMATIONS.PLAYER_MOVE_LEFT },
    right: { flip: false, anim: ASSETS.ANIMATIONS.PLAYER_MOVE_RIGHT },
  };

  private static PUNCH_ANIMATION = {
    down: { flip: false, anim: ASSETS.ANIMATIONS.PLAYER_ATTACK_DOWN },
    up: { flip: false, anim: ASSETS.ANIMATIONS.PLAYER_ATTACK_UP },
    left: { flip: true, anim: ASSETS.ANIMATIONS.PLAYER_ATTACK_SIDE },
    right: { flip: false, anim: ASSETS.ANIMATIONS.PLAYER_ATTACK_SIDE },
  };

  private static IDLE_ANIMATION = {
    down: { flip: false, anim: ASSETS.ANIMATIONS.PLAYER_IDLE_DOWN },
    up: { flip: false, anim: ASSETS.ANIMATIONS.PLAYER_IDLE_UP },
    left: { flip: true, anim: ASSETS.ANIMATIONS.PLAYER_IDLE_SIDE },
    right: { flip: false, anim: ASSETS.ANIMATIONS.PLAYER_IDLE_SIDE },
  };

  private static SHOOT_ANIMATION = {
    down: { flip: false, anim: ASSETS.ANIMATIONS.PLAYER_ATTACK_WEAPON_DOWN },
    up: { flip: false, anim: ASSETS.ANIMATIONS.PLAYER_ATTACK_WEAPON_UP },
    left: { flip: true, anim: ASSETS.ANIMATIONS.PLAYER_ATTACK_WEAPON_SIDE },
    right: { flip: false, anim: ASSETS.ANIMATIONS.PLAYER_ATTACK_WEAPON_SIDE },
  };

  private orientation: Orientation;
  private lastTimeHit: number;
  private tomb: Phaser.GameObjects.Sprite;

  private isShooting: boolean;
  private attackAnimationIsConcluded: boolean;
  private isShotKeyPressed: boolean;

  constructor(scene: AbstractScene, x: number, y: number) {
    super(scene, x, y, ASSETS.IMAGES.PLAYER_IDLE_DOWN);

    if (!this.hp) {
      this.hp = Player.MAX_HP;
    }

    this.orientation = Orientation.Down;
    this.lastTimeHit = new Date().getTime();
    this.setCollideWorldBounds(true);
    this.setSize(12, 12);
    this.setOffset(10, 16);
    this.setDepth(10);

    this.isShooting = false;
    this.tomb = null;

    this.attackAnimationIsConcluded = false;
    this.isShotKeyPressed = false;

    this.on('animationcomplete', this.onAnimationComplete, this);
  }

  private onAnimationComplete(animation, frame) {
      switch (animation.key) {
        // Deal with Bow Attack
        case Player.SHOOT_ANIMATION.left.anim:
        case Player.SHOOT_ANIMATION.right.anim:
        case Player.SHOOT_ANIMATION.up.anim:
        case Player.SHOOT_ANIMATION.down.anim:
          if (frame.index === animation.frames.length) {
            this.attackAnimationIsConcluded = true;
          }

          break;
        default:
          break;
      }
  }

  public updatePlayer(keyPressed) {
    if (!this.active) {
      return;
    }

    this.setVelocity(0);
    this.handleMovement(keyPressed);

    if (keyPressed.shift) {
      this.punch();
    }

    const noKeyPressed = Object.values(keyPressed).filter(x => x).length === 0;
    if (noKeyPressed) {
      this.beIdle();
    }

    this.handleBowAttackKey(keyPressed);

    if (this.alpha < 1.0 && this.canGetHit()) {
      this.alpha = 1.0;
    }

    this.renderStrongestEmotion();

  }

  public canGetHit() {
    return new Date().getTime() - this.lastTimeHit > HIT_DELAY;
  }

  public loseHp() {
    this.scene.sound.play('hurt');
    this.hp--;

    this.lastTimeHit = new Date().getTime();
    this.alpha = 0.5;

    if (this.hp > 0) {
      return;
    }

    // Player dies
    if (!this.tomb) {
      this.tomb = this.scene.add
        .sprite(this.x, this.y, ASSETS.IMAGES.TOMB)
        .setScale(0.9);
    }

    this.scene.requestGameOverScreen();

    this.destroy();
  }

  private get hp() {
    return this.uiScene.playerHp;
  }

  private set hp(newHp: number) {
    this.uiScene.playerHp = newHp;
  }

  private go(direction: Orientation, shouldAnimate = true) {
    switch (direction) {
      case Orientation.Left:
        this.setVelocityX(-PLAYER_SPEED);
        break;
      case Orientation.Right:
        this.setVelocityX(PLAYER_SPEED);
        break;
      case Orientation.Up:
        this.setVelocityY(-PLAYER_SPEED);
        break;
      case Orientation.Down:
        this.setVelocityY(PLAYER_SPEED);
        break;
      default:
        break;
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.body.velocity.normalize().scale(PLAYER_SPEED);

    if (!shouldAnimate) {
      return;
    }

    this.orientation = direction;

    this.animate(Player.MOVE_ANIMATION, this.orientation);
  }

  private handleHorizontalMovement(keyPressed) {
    const isUpDownPressed = keyPressed.up || keyPressed.down;

    if (keyPressed.left) {
      this.go(Orientation.Left, !isUpDownPressed);
      return;
    }

    if (keyPressed.right) {
      this.go(Orientation.Right, !isUpDownPressed);
      return;
    }
  }

  private handleVerticalMovement(keyPressed) {
    if (keyPressed.up) {
      this.go(Orientation.Up);
    } else if (keyPressed.down) {
      this.go(Orientation.Down);
    }
  }

  private handleMovement(keyPressed) {
    if (this.isShooting) {
      return;
    }
    this.handleHorizontalMovement(keyPressed);
    this.handleVerticalMovement(keyPressed);
  }

  private punch() {
    this.animate(Player.PUNCH_ANIMATION, this.orientation);
  }

  private beIdle() {
    this.animate(Player.IDLE_ANIMATION, this.orientation);
  }

  private concludeShot() {
    this.isShooting = false;

    if (this.attackAnimationIsConcluded) {
      this.attackAnimationIsConcluded = false;
      this.releaseAttack();
    }
  }

  private prepareBow() {
    this.isShooting = true;

    this.animate(Player.SHOOT_ANIMATION, this.orientation);
    // Arrow will be spawned at the end of the animation
  }

  private handleBowAttackKey(keyPressed) {
    if (keyPressed.space) {
      this.isShotKeyPressed = true;
      
      if (!this.isShooting) {
        this.prepareBow();
      }

    } else if (this.isShotKeyPressed) {
      this.isShotKeyPressed = false;
      this.concludeShot();
    }
  }

  private releaseAttack() {
    this.scene.sound.play('slash');

    const arrow = new Arrow(this.scene, this, this.orientation);
    this.scene.physics.add.collider(arrow, this.scene.monsterGroup, (a: Arrow, m: Monster) => {
      m.loseHp(a);
    });
  }

}
