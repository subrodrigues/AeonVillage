import { Player } from '../game-objects/Player';
import { ASSETS } from '../constants/assets/assets';
import { SCENES } from '../constants/service/scenes';
import { EVENTS } from '../constants/service/events';
import { GameManager } from './GameManager';

const DISTANCE_BETWEEN_HEARTS = 36;
const HEARTS_MARGIN = 24;

const DIALOGUE_WINDOW_WIDTH_MARGIN = 60;
const DIALOGUE_WINDOW_HEIGHT_FRACTION = 5;
const DIALOGUE_WINDOW_BOTTOM_MARGIN = 20;

export class HUD extends Phaser.Scene {
  private DIALOGUE_WINDOW_VIEWING_TIME = 3000;

  private hearts: Phaser.GameObjects.Sprite[];
  private gameManager: GameManager;

  private dialogueWindow: Phaser.GameObjects.Image;
  private textGameObject: Phaser.GameObjects.Text;

  private isDialogueWindowVisible: boolean;

  constructor() {
    super(SCENES.HUD);

    this.hearts = [];
  }

  protected create() {
    const gameManager: any = this.scene.get(SCENES.GAME_MANAGER);
    this.gameManager = gameManager;

    this.gameManager.events.on(EVENTS.UPDATE_HP, () => {
      this.updateHearts();
    });

    this.gameManager.events.on(EVENTS.SHOW_DIALOGUE_MESSAGE, (message) => {
      this.showDialogueWindow(message);
    });

    this.initHearts();
    this.initDialogueWindow();
  }

  private initDialogueWindow() {
    const dialogueWindowWidth = this.cameras.main.width - DIALOGUE_WINDOW_WIDTH_MARGIN;
    const dialogueWindowHeight = this.cameras.main.height / DIALOGUE_WINDOW_HEIGHT_FRACTION;

    this.dialogueWindow = this.add.image(this.cameras.main.width / 2,
      this.cameras.main.height - (dialogueWindowHeight / 2) - DIALOGUE_WINDOW_BOTTOM_MARGIN, ASSETS.IMAGES.DIALOG_WINDOW);
    this.dialogueWindow.setDisplaySize(dialogueWindowWidth, dialogueWindowHeight);

    // Text Object
    this.textGameObject = this.add.text(0, 0, "", { align: 'left', fontSize: '28px', color: '#000000', stroke : '#212121', strokeThickness: 2});
    this.textGameObject.setWordWrapWidth(dialogueWindowWidth - 22);

    this.textGameObject.setPosition(
      DIALOGUE_WINDOW_WIDTH_MARGIN,
      this.cameras.main.height - dialogueWindowHeight - DIALOGUE_WINDOW_BOTTOM_MARGIN + 18,
    );

    this.hideDialogueWindow();
  }

  private initHearts() {
    Array(Player.MAX_HP)
      .fill(0)
      .map((_, i) => {
        return this.add
          .sprite(
            (i + 1) * DISTANCE_BETWEEN_HEARTS + HEARTS_MARGIN,
            DISTANCE_BETWEEN_HEARTS + HEARTS_MARGIN,
            ASSETS.IMAGES.HEART_EMPTY,
          )
          .setScrollFactor(0)
          .setDepth(50);
      });

    this.hearts = Array(this.gameManager.playerHp)
      .fill(0)
      .map((_, i) => {
        return this.add
          .sprite((i + 1) * DISTANCE_BETWEEN_HEARTS + HEARTS_MARGIN,
            DISTANCE_BETWEEN_HEARTS + HEARTS_MARGIN,
            ASSETS.IMAGES.HEART)
          .setScrollFactor(0)
          .setDepth(100);
      });
  }

  private updateHearts() {
    this.hearts.map((heart, index) => {
      if (index >= this.gameManager.playerHp) {
        heart.setAlpha(0);
      }
    });
  }

  public showDialogueWindow(message: string){
    if(this.isDialogueWindowVisible) return;

    this.textGameObject.setText(message);
    this.textGameObject.setAlpha(1);

    this.isDialogueWindowVisible = true;
    this.dialogueWindow.setAlpha(1);

    this.time.addEvent({
      delay: this.DIALOGUE_WINDOW_VIEWING_TIME,
      callback: this.hideDialogueWindow,
      callbackScope: this,
    });
  }

  public hideDialogueWindow(){
    this.dialogueWindow.setAlpha(0);
    this.textGameObject.setAlpha(0);
    this.isDialogueWindowVisible = false;
  }

}
