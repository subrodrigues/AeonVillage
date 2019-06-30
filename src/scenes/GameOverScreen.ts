import { SCENES } from '../constants/service/scenes';
import { ASSETS } from '../constants/assets/assets';

export class GameOverScreen extends Phaser.Scene {

  private pressEnter: Phaser.GameObjects.Image;
  private enterKey;
  private gameOverContainer;

  constructor() {
    super(SCENES.GAME_OVER);
  }

  protected init() {
    // this.physics.world.setBounds(0, 0, 1088, 768);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  public update(){
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.returnToTitleScreen();
    }
  }

  protected create() {
    this.initCamera();

    this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, ASSETS.MENU.TITLE_SCREEN_BACKGROUND);

    this.pressEnter = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 + 66, ASSETS.MENU.TITLE_SCREEN_BLINK_ENTER);
    this.pressEnter.alpha = 1;
    this.pressEnter.setOrigin(0.5);

    this.time.addEvent({
      delay: 900, // ms
      callback: this.blinkText,
      loop: true,
      callbackScope: this,
    });

    this.gameOverContainer = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 12, ASSETS.MENU.TITLE_SCREEN_GAME_OVER);
    this.gameOverContainer.setOrigin(0.5);

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

  private returnToTitleScreen() {
      this.pressEnter.destroy();
      this.enterKey.destroy();

      this.scene.remove(SCENES.GAME_OVER);
      window.location.reload();
  }
}
