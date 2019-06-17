import { MAPS } from '../constants/maps';
import { ASSETS } from '../constants/assets';
import { SCENES } from '../constants/scenes';

export class Preloader extends Phaser.Scene {

  protected preload() {
    this.loadAssets();
    this.loadSoundAssets();
  }

  protected create() {

    this.createAnimations();
    this.scene.launch(SCENES.FIRST_LEVEL);
    this.scene.launch(SCENES.GAME_MANAGER);

    // this.input.on('pointerdown', () => this.loadSoundAssets());
  }

  private loadSoundAssets() {
    // audio
    this.load.audio('music', ['assets/sound/ancient_path.ogg', 'assets/sound/ancient_path.mp3']);
    this.load.audio('hurt', ['assets/sound/hurt.ogg', 'assets/sound/hurt.mp3']);
    this.load.audio('slash', ['assets/sound/slash.ogg', 'assets/sound/slash.mp3']);
    this.load.audio('item', ['assets/sound/item.ogg', 'assets/sound/item.mp3']);
    this.load.audio('enemy-death', ['assets/sound/enemy-death.ogg', 'assets/sound/enemy-death.mp3']);
  }

  private loadAssets() {
    this.load.tilemapTiledJSON(MAPS.firstLevel.key, `assets/maps/${MAPS.firstLevel.file}`);
    // this.load.tilemapTiledJSON(MAPS.secondLevel.key, `assets/${MAPS.secondLevel.file}`);

    // Images
    this.load.image(ASSETS.IMAGES.LOGO, 'assets/logo.png');
    this.load.image(ASSETS.IMAGES.TILES, 'assets/maps/assets/tileset-extruded.png');
    this.load.image(ASSETS.IMAGES.OBJECT_TILES, 'assets/maps/assets/world-objects.png');
    this.load.image(ASSETS.IMAGES.ARROW, 'assets/sprites/misc/arrow.png');
    this.load.image(ASSETS.IMAGES.TREANT_ATTACK, 'assets/sprites/misc/trunk.png');
    this.load.image(ASSETS.IMAGES.HEART, 'assets/sprites/misc/hearts/heart.png');
    this.load.image(ASSETS.IMAGES.HEART_EMPTY, 'assets/sprites/misc/hearts/heart-empty.png');
    this.load.image(ASSETS.IMAGES.TOMB, 'assets/tomb.png');

    // Spritesheets
    this.load.spritesheet(
      ASSETS.IMAGES.PLAYER_IDLE_DOWN,
      'assets/spritesheets/hero/idle/hero-idle-front.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.PLAYER_IDLE_UP,
      'assets/spritesheets/hero/idle/hero-idle-back.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.PLAYER_IDLE_SIDE,
      'assets/spritesheets/hero/idle/hero-idle-side.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.PLAYER_WALK_DOWN,
      'assets/spritesheets/hero/walk/hero-walk-front.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.PLAYER_WALK_UP,
      'assets/spritesheets/hero/walk/hero-walk-back.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.PLAYER_WALK_SIDE,
      'assets/spritesheets/hero/walk/hero-walk-side.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.PLAYER_ATTACK_DOWN,
      'assets/spritesheets/hero/attack/hero-attack-front.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.PLAYER_ATTACK_UP,
      'assets/spritesheets/hero/attack/hero-attack-back.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.PLAYER_ATTACK_SIDE,
      'assets/spritesheets/hero/attack/hero-attack-side.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.PLAYER_ATTACK_WEAPON_DOWN,
      'assets/spritesheets/hero/attack-weapon/hero-attack-front-weapon.png',
      { frameWidth: 32, frameHeight: 32 },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.PLAYER_ATTACK_WEAPON_UP,
      'assets/spritesheets/hero/attack-weapon/hero-attack-back-weapon.png',
      { frameWidth: 32, frameHeight: 32 },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.PLAYER_ATTACK_WEAPON_SIDE,
      'assets/spritesheets/hero/attack-weapon/hero-attack-side-weapon.png',
      { frameWidth: 32, frameHeight: 32 },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.TREANT_IDLE_DOWN,
      'assets/spritesheets/treant/idle/treant-idle-front.png',
      { frameWidth: 34, frameHeight: 34 },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.TREANT_WALK_SIDE,
      'assets/spritesheets/treant/walk/treant-walk-side.png',
      { frameWidth: 34, frameHeight: 34 },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.TREANT_WALK_UP,
      'assets/spritesheets/treant/walk/treant-walk-back.png',
      { frameWidth: 34, frameHeight: 34 },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.TREANT_WALK_DOWN,
      'assets/spritesheets/treant/walk/treant-walk-front.png',
      { frameWidth: 34, frameHeight: 34 },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.MOLE_IDLE_DOWN,
      'assets/spritesheets/mole/idle/mole-idle-front.png',
      { frameWidth: 32, frameHeight: 32 },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.MOLE_WALK_SIDE,
      'assets/spritesheets/mole/walk/mole-walk-side.png',
      { frameWidth: 32, frameHeight: 32 },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.MOLE_WALK_UP,
      'assets/spritesheets/mole/walk/mole-walk-back.png',
      { frameWidth: 32, frameHeight: 32 },
    );
    this.load.spritesheet(
      ASSETS.IMAGES.MOLE_WALK_DOWN,
      'assets/spritesheets/mole/walk/mole-walk-front.png',
      { frameWidth: 32, frameHeight: 32 },
    );
    this.load.spritesheet(ASSETS.IMAGES.PLAYER, 'assets/player.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet(ASSETS.IMAGES.NPCS, 'assets/npc.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet(ASSETS.IMAGES.MONSTER_DEATH, 'assets/spritesheets/misc/enemy-death.png', {
      frameWidth: 30,
      frameHeight: 32,
    });
  }

  private createAnimations() {
    this.anims.create({
      key: ASSETS.ANIMATIONS.PLAYER_MOVE_LEFT,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.PLAYER_WALK_SIDE, { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.PLAYER_MOVE_RIGHT,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.PLAYER_WALK_SIDE, { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.PLAYER_MOVE_UP,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.PLAYER_WALK_UP, { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.PLAYER_MOVE_DOWN,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.PLAYER_WALK_DOWN, { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.PLAYER_IDLE_UP,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.PLAYER_IDLE_UP, { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.PLAYER_IDLE_DOWN,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.PLAYER_IDLE_DOWN, { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.PLAYER_IDLE_SIDE,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.PLAYER_IDLE_SIDE, { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.PLAYER_ATTACK_DOWN,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.PLAYER_ATTACK_DOWN, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.PLAYER_ATTACK_UP,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.PLAYER_ATTACK_UP, { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.PLAYER_ATTACK_SIDE,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.PLAYER_ATTACK_SIDE, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.PLAYER_ATTACK_WEAPON_DOWN,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.PLAYER_ATTACK_WEAPON_DOWN, {
        start: 0,
        end: 2,
      }),
      frameRate: 7,
      repeat: 0,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.PLAYER_ATTACK_WEAPON_UP,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.PLAYER_ATTACK_WEAPON_UP, {
        start: 0,
        end: 2,
      }),
      frameRate: 7,
      repeat: 0,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.PLAYER_ATTACK_WEAPON_SIDE,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.PLAYER_ATTACK_WEAPON_SIDE, {
        start: 0,
        end: 2,
      }),
      frameRate: 7,
      repeat: 0,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.TREANT_IDLE_DOWN,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.TREANT_IDLE_DOWN, { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.TREANT_WALK_SIDE,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.TREANT_WALK_SIDE, { start: 0, end: 3 }),
      frameRate: 7,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.TREANT_WALK_DOWN,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.TREANT_WALK_DOWN, { start: 0, end: 3 }),
      frameRate: 7,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.TREANT_WALK_UP,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.TREANT_WALK_UP, { start: 0, end: 3 }),
      frameRate: 7,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.MOLE_IDLE_DOWN,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.MOLE_IDLE_DOWN, { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.MOLE_WALK_SIDE,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.MOLE_WALK_SIDE, { start: 0, end: 3 }),
      frameRate: 7,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.MOLE_WALK_DOWN,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.MOLE_WALK_DOWN, { start: 0, end: 3 }),
      frameRate: 7,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.MOLE_WALK_UP,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.MOLE_WALK_UP, { start: 0, end: 3 }),
      frameRate: 7,
      repeat: -1,
    });
    this.anims.create({
      key: ASSETS.ANIMATIONS.MONSTER_DEATH,
      frames: this.anims.generateFrameNumbers(ASSETS.IMAGES.MONSTER_DEATH, { start: 0, end: 6 }),
      frameRate: 15,
      hideOnComplete: true,
    });
  }
}
