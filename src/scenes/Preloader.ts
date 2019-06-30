import { MAPS } from '../constants/assets/maps';
import { ASSETS } from '../constants/assets/assets';
import { SCENES } from '../constants/service/scenes';

export class Preloader extends Phaser.Scene {

  protected preload() {
    this.createProgressLoader();

    this.loadAssets();
    this.loadSoundAssets();
  }

  protected create() {

    this.createAnimations();
    this.scene.launch(SCENES.TITLE_SCREEN);
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
    this.load.image(ASSETS.IMAGES.TILES, 'assets/maps/assets/tileset-extrud.png');
    this.load.image(ASSETS.IMAGES.OBJECT_TILES, 'assets/maps/assets/world-objects.png');
    this.load.image(ASSETS.IMAGES.TILE_COLLIDER_OBJECTS, 'assets/maps/assets/tile-objects.png');
    this.load.image(ASSETS.IMAGES.ARROW, 'assets/sprites/misc/arrow.png');
    this.load.image(ASSETS.IMAGES.TREANT_ATTACK, 'assets/sprites/misc/trunk.png');
    this.load.image(ASSETS.IMAGES.HEART, 'assets/sprites/misc/hearts/heart.png');
    this.load.image(ASSETS.IMAGES.HEART_EMPTY, 'assets/sprites/misc/hearts/heart-empty.png');
    this.load.image(ASSETS.IMAGES.TOMB, 'assets/tomb.png');
    this.load.image(ASSETS.IMAGES.DIALOG_WINDOW, 'assets/dialogue_window.png');
    this.load.image(ASSETS.IMAGES.EMOTION_HOPE_WINDOW, 'assets/emotions/emotion-hope-window.png');
    this.load.image(ASSETS.IMAGES.EMOTION_HOPE_BAR, 'assets/emotions/emotion-bar.png');

    // Title Screen Images
    this.load.image(ASSETS.MENU.TITLE_SCREEN_CREDITS, 'assets/menu/credits-text.png');
    this.load.image(ASSETS.MENU.TITLE_SCREEN_GAME_OVER, 'assets/menu/game-over.png');
    this.load.image(ASSETS.MENU.TITLE_SCREEN_INSTRUCTIONS, 'assets/menu/instructions.png');
    this.load.image(ASSETS.MENU.TITLE_SCREEN_BACKGROUND, 'assets/menu/title-screen-bg.png');
    this.load.image(ASSETS.MENU.TITLE_SCREEN_LOGO, 'assets/menu/title-screen-logo.png');
    this.load.image(ASSETS.MENU.TITLE_SCREEN_BLINK_ENTER, 'assets/menu/title-screen-press-enter.png');


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
    this.load.spritesheet(ASSETS.IMAGES.NPC_WISEMAN, 'assets/spritesheets/wiseman/wise-man-idle-front.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(ASSETS.IMAGES.NPC_MALE_VILLAGER, 'assets/spritesheets/woodworker/woodworker-idle-front.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(ASSETS.IMAGES.NPC_FEMALE_VILLAGER, 'assets/spritesheets/woodworkerwife/woodworker-wife-idle-side.png', {
      frameWidth: 32,
      frameHeight: 32,
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

  /**
   * Method that creates the initial loading screen.
   * To be used when loading all the assets.
   *
   * NOTE: To be launched on 'preload()' functions.
   */
  private createProgressLoader() {
    const centexX = (1088 / 2) - 160;
    const centerY = (768 / 2) - 25;

    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();

    progressBox.fillStyle(0x8f2a2b, 0.8);
    progressBox.fillRect(centexX, centerY, 320, 50);

    this.load.on('progress', function(value) {
      progressBar.clear();
      progressBar.fillStyle(0xffb900, 1.0);
      progressBar.fillRect(centexX + 10, centerY + 10, 300 * value, 30);
    });

    // this.load.on('fileprogress', function(file) {
    //   console.log(file.src);
    //
    // });

    this.load.on('complete', function() {
      progressBar.destroy();
      progressBox.destroy();
    });
  }
}
