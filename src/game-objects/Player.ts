import { Orientation } from '../geometry/orientation';
import { Character } from './Character';
import { Arrow } from './Arrow';
import { Monster } from './Monster';
import { AbstractScene } from '../scenes/AbstractScene';
import { ASSETS } from '../constants/assets';

const HIT_DELAY = 2000;
const PLAYER_SPEED = 16;
const PLAYER_RELOAD = 1000;

export class Player extends Character {
  public static MAX_HP = 3;
  // public emotionAgent;

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
  private isLoading: boolean;
  private isShooting: boolean;
  private tomb: Phaser.GameObjects.Sprite;
  private attackFlag: number;

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

    this.isLoading = false;
    this.isShooting = false;
    this.tomb = null;
    this.attackFlag = 0;

    this.isShotKeyPressed = false;

    this.on('animationrepeat', event => {
      switch (event.key) {
        case Player.SHOOT_ANIMATION.left.anim:
        case Player.SHOOT_ANIMATION.right.anim:
        case Player.SHOOT_ANIMATION.up.anim:
        case Player.SHOOT_ANIMATION.down.anim:
          this.concludeShoot();
          break;
        default:
          break;
      }
    }, this);
    //
    //
    // this.emotionAgent = AbstractScene.emotionEngine.createAgent('player');
    // AbstractScene.emotionEngine.createGoalForAgent('player','survive', 1);
    // AbstractScene.emotionEngine.createGoalForAgent('player','win', 0.7);
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
    if (noKeyPressed && !this.isLoading) {
      this.beIdle();
    }

    this.handleShootKey(keyPressed);

    if (this.alpha < 1.0 && this.canGetHit()) {
      this.alpha = 1.0;
    }
  }

  public canGetHit() {
    return new Date().getTime() - this.lastTimeHit > HIT_DELAY;
  }

  public loseHp() {
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
        .setScale(0.1);
    }
    this.destroy();
  }

  private get hp() {
    return this.uiScene.playerHp;
  }

  private set hp(newHp: number) {
    this.uiScene.playerHp = newHp;
  }

  private reload() {
    this.isLoading = true;
    this.scene.time.addEvent({
      delay: PLAYER_RELOAD,
      callback: this.readyToFire,
      callbackScope: this,
    });
  }

  private readyToFire() {
    this.isLoading = false;
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

  private concludeShoot = () => {
    this.isShooting = false;
    const arrow = new Arrow(this.scene, this, this.orientation);
    this.scene.physics.add.collider(arrow, this.scene.monsterGroup, (a: Arrow, m: Monster) => {
      m.loseHp(a);
    });
  }

  private shoot() {
    this.scene.sound.play('slash');

    this.isShooting = true;

    this.animate(Player.SHOOT_ANIMATION, this.orientation);
    // Arrow will be spawned at the end of the animation
  }

  private handleShootKey(keyPressed) {
    if (keyPressed.space && !this.isShotKeyPressed) {
      this.isShotKeyPressed = true;
      if (this.isLoading) {
        return;
      }
      this.reload();
      this.shoot();
    } else {
        this.isShotKeyPressed = false;
    }
  }
}
