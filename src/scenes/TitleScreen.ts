import { SCENES } from '../constants/service/scenes';
import { ASSETS } from '../constants/assets/assets';

export class TitleScreen extends Phaser.Scene {

  private state: number;
  private title;
  private instructions;
  private pressEnter: Phaser.GameObjects.Image;
  private enterKey;

  constructor() {
    super(SCENES.TITLE_SCREEN);
  }

  protected init() {
    // this.physics.world.setBounds(0, 0, 1088, 768);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  public update(){
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.startGame();
    }
  }

  protected create() {
    this.state = 1;

    this.initCamera();

    this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, ASSETS.MENU.TITLE_SCREEN_BACKGROUND);

    this.title = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2.15, ASSETS.MENU.TITLE_SCREEN_LOGO);
    // this.title.setOrigin(0.5, 1);
    var tween = this.tweens.add({
      targets: this.title,
      y: { value: (this.cameras.main.height/2.15) - 10,
        duration: 1200,
        ease: 'Quad.easeInOut'
      },
      yoyo: true,
      loop: -1
    });
    tween.resume();

    //
    this.pressEnter = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 + 66, ASSETS.MENU.TITLE_SCREEN_BLINK_ENTER);
    this.pressEnter.alpha = 1;
    this.pressEnter.setOrigin(0.5);
    //
    this.time.addEvent({
      delay: 900, // ms
      callback: this.blinkText,
      loop: true,
      callbackScope: this,
    });

    //
    this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 + 95, ASSETS.MENU.TITLE_SCREEN_CREDITS);
  }

  private initCamera() {
    this.cameras.main.setBounds(0, 0, 1088, 768);
    this.cameras.main.setZoom(3.4);
  }

  private blinkText() {
    if (this.pressEnter !== undefined && this.pressEnter.alpha) {
      this.pressEnter.alpha = 0;
    } else if(this.pressEnter !== undefined ){
      this.pressEnter.alpha = 1;
    }
  }

  private startGame() {
    if (this.state == 1) {
      this.state = 2;
      this.instructions = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 12, ASSETS.MENU.TITLE_SCREEN_INSTRUCTIONS);
      this.instructions.setOrigin(0.5);
      this.title.destroy();
    } else {
      this.scene.launch(SCENES.FIRST_LEVEL);
      this.scene.launch(SCENES.GAME_MANAGER);
    }
  }
}
