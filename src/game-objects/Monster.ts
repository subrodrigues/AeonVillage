import { Orientation } from '../geometry/orientation';
import { Character } from './Character';
import { ASSETS } from '../constants/assets/assets';

export abstract class Monster extends Character {
  private static WANDER_DELAY = () => (1000 + 1000 * Math.random());
  private static WANDER_LENGTH = () => (1000 + 5000 * Math.random());

  protected abstract WALK_ANIMATION;
  protected abstract MONSTER_IDLE_DOWN;
  protected MONSTER_SPEED = 20;
  protected MONSTER_HIT_DELAY = 100;
  protected CHASING_DISTANCE = 40;

  protected hp: number;
  private moveBehavior: integer; // 0: Moves Horizontally - 1: Moves Vertically - 2: Moves Randomly
  private chasingPlayerTimerEvent: Phaser.Time.TimerEvent;
  private isWandering: boolean = false;
  private isStartled: boolean = false;

  private isPacifier: boolean = false; // To be used by originaly pacific creatures

  private fixedDirection = {x: 1, y: 1};
  private monsterType: string;

  protected abstract animateAttack(): void;

  protected constructor(scene, type: string, x: number = 400, y: number = 400, moveBehavior: integer = 0, sprite: string) {
    super(scene, x, y, sprite);
    this.monsterType = type;

    this.moveBehavior = moveBehavior;

    this.body.bounce.x = 0.01;
    this.body.bounce.y = 0.01;
  }

  public updateMonster() {
    if (!this.active) {
      return;
    }

    this.renderStrongestEmotion();

    this.handleChase();
  }

  public attack = () => {
    if (!this.scene.player.canGetHit()) {
      return;
    }

    this.scene.player.loseHp();
    this.animateAttack();
  }

  public loseHp = (projectile: Phaser.Physics.Arcade.Sprite) => {
    this.hp--;
    this.isStartled = true;
    this.setTint(0xff0000);
    this.scene.time.addEvent({
      delay: this.MONSTER_HIT_DELAY,
      callback: () => this.clearTint(),
      callbackScope: this,
    });
    projectile.destroy();
    if (this.hp === 0) {
      this.die();
    }
  }

  protected die() {
    this.scene.monsterKilledByPlayer(this.monsterType);

    const deathAnim = this.scene.add
      .sprite(
        this.x,
        this.y,
        ASSETS.IMAGES.MONSTER_DEATH,
      );
    this.destroyInstance();
    deathAnim.play(ASSETS.ANIMATIONS.MONSTER_DEATH, false);
  }

  private shouldChase = () => {

    // While a pacifier monster is not startled, it will not attack
    if ((this.isPacifier && !this.isStartled) ||
      (this.emotionAgent.currentRelations.length > 0 && this.emotionAgent.getRelation('player').like > 0.2)) { // If the monster likes the player, we will not attack
      return;
    }

    const playerPoint = this.scene.player.getCenter();
    const monsterPoint = this.getCenter();
    const distance = monsterPoint.distance(playerPoint);

    if (distance < this.CHASING_DISTANCE) {
      return true;
    }

    if (this.isStartled) {
      return true;
    }

    return false;
  }

  private getOrientationFromTargettedPosition(x: number, y: number): Orientation {
    if (Math.abs(y) > Math.abs(x)) {
      return y < 0 ? Orientation.Up : Orientation.Down;
    }

    return x < 0 ? Orientation.Left : Orientation.Right;
  }

  private moveTowardsPlayer() {
    if (!this.active) {
      return;
    }

    const playerPoint = this.scene.player.getCenter();
    const monsterPoint = this.getCenter();
    const { x, y } = playerPoint.subtract(monsterPoint);

    this.run(x, y);
  }

  private run(x: number, y: number) {
    if (x === 0 && y === 0) {
      return;
    }

    if (!this.active) {
      return;
    }

    this.setVelocityX(Math.sign(x) * this.MONSTER_SPEED);
    this.setVelocityY(Math.sign(y) * this.MONSTER_SPEED);

    this.body.velocity.normalize().scale(this.MONSTER_SPEED);

    const orientation = this.getOrientationFromTargettedPosition(x, y);
    this.animate(this.WALK_ANIMATION, orientation);
  }

  private stopRunning() {
    if (!this.active) {
      return;
    }

    this.setVelocity(0);
    this.beIdle();
  }

  private startChasing() {
    this.chasingPlayerTimerEvent = this.scene.time.addEvent({
      delay: 500,
      callback: this.moveTowardsPlayer,
      callbackScope: this,
      repeat: Infinity,
      startAt: 2000,
    });
  }

  private beIdle() {
    this.play(this.MONSTER_IDLE_DOWN);
  }

  private stopChasing() {
    if (this.active) {
      this.stopRunning();
    }
    this.chasingPlayerTimerEvent.destroy();
    this.chasingPlayerTimerEvent = null;
  }

  private handleChase() {
    if (!this.chasingPlayerTimerEvent && this.shouldChase()) {
      this.startChasing();
      return;
    }

    if (this.chasingPlayerTimerEvent && !this.shouldChase()) {
      this.stopChasing();
    }

    if (!this.shouldChase()) {
      this.wanderAround();
    }
  }

  private wanderAround() {
    if (this.isWandering) {
      return;
    }

    this.isWandering = true;

    this.updateMonsterDirection();
    this.run(this.fixedDirection.x, this.fixedDirection.y);

    this.scene.time.addEvent({
      delay: Monster.WANDER_LENGTH(),
      callbackScope: this,
      callback: () => {
        this.stopRunning();

        if (!this.active) {
          return;
        }

        this.scene.time.addEvent({
          delay: Monster.WANDER_DELAY(),
          callbackScope: this,
          callback: () => {
            this.isWandering = false;
          },
        });
      },
    });
  }

  /**
   * Method that updates the monster direction based on its behavior.
   */
  private updateMonsterDirection() {
    switch (this.moveBehavior) {
      case 0: // horizontal movement
        this.fixedDirection.x *= -1;
        this.fixedDirection.y = 0;
        break;
      case 1: // vertical movement
        this.fixedDirection.y *= -1;
        this.fixedDirection.x = 0;
        break;
      default:
        this.fixedDirection = this.getRandomDirection();
        break;
    }
  }

// @ts-ignore
  private getRandomDirection() {
    const randomBetweenMinusOneAndOne = () => Math.round(2 * Math.random()) - 1;
    const x = randomBetweenMinusOneAndOne();
    const y = randomBetweenMinusOneAndOne();

    return { x, y };
  }

  public setIsPacifier(condition: boolean ){
    this.isPacifier = condition;
  }

  // @ts-ignore
  public getMonsterType(){
    return this.monsterType;
  }

  public setMonsterType(type: string) {
    this.monsterType = type;
  }

}
