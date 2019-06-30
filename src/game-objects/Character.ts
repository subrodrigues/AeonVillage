import { Orientation } from '../geometry/orientation';
import { AbstractScene } from '../scenes/AbstractScene';
import { SCENES } from '../constants/service/scenes';
import { GameManager } from '../scenes/GameManager';
import { GameUtils } from '../utils/GameUtils';
import { ASSETS } from '../constants/assets/assets';

type CharacterAnimation = {
  [K in Orientation]: {
    flip: boolean;
    anim: string;
  };
};

export abstract class Character extends Phaser.Physics.Arcade.Sprite {
  private EMOTION_NAME_VERTICAL_OFFSET = 23;
  private EMOTION_CONTAINER_VERTICAL_OFFSET = 16;

  protected scene: AbstractScene;
  protected uiScene: GameManager;

  protected emotionAgent;

  protected strongestEmotion: TUDelft.Gamygdala.Emotion; // To be dealt with and updated with the leaf instanced object
  protected uiEmotionContainer;
  protected uiEmotionName;
  protected uiEmotionBar;

  constructor(scene: AbstractScene, x: number, y: number, sprite: string) {
    super(scene, x, y, sprite, 0);
    this.scene = scene;
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    this.setupEmotionalUI();

    const uiScene: any = this.scene.scene.get(SCENES.GAME_MANAGER);
    this.uiScene = uiScene;
  }

  /**
   * Setups the initial Emotional UI
   */
  private setupEmotionalUI() {
    this.uiEmotionName = this.scene.add.text(this.x, this.y - this.EMOTION_NAME_VERTICAL_OFFSET, '', {
      font: '66px Calibri',
      fill: '#00ff00',
    }).setScale(0.1);
    this.uiEmotionName.setOrigin(0.5);
    this.uiEmotionContainer = this.scene.add.image(this.x, this.y - this.EMOTION_NAME_VERTICAL_OFFSET, ASSETS.IMAGES.EMOTION_HOPE_WINDOW);
    this.uiEmotionBar = this.scene.add.image(this.x, this.y, ASSETS.IMAGES.EMOTION_HOPE_BAR);

    this.uiEmotionName.setDepth(1100);
    this.uiEmotionContainer.setDepth(1100);
    this.uiEmotionBar.setDepth(1100);
  }

  protected animate(
    animationKeys: CharacterAnimation,
    orientation: Orientation,
  ) {
    const { flip, anim } = animationKeys[orientation];
    this.setFlipX(flip);
    this.play(anim, true);
  }

  /**
   * Method that acquires and renders the most strong emotion for this entity
   */
  protected renderStrongestEmotion() {
    this.updateEmotionUI();

    let emotions = this.emotionAgent.getEmotionalState(true);
    if (emotions.length == 0) return;

    let strongestEmotion = emotions[0];
    for (let i = 1; i < emotions.length; i++) {
      if (emotions[i].intensity > strongestEmotion.intensity)
        strongestEmotion = emotions[i];
    }
    if (this.strongestEmotion === undefined ||
      (this.strongestEmotion.name != strongestEmotion.name &&
        this.strongestEmotion.intensity != strongestEmotion.intensity)) {
      this.strongestEmotion = strongestEmotion;

      var color = GameUtils.getEmotionColor(this.strongestEmotion.name);
      console.log('EMOTION :' + this.strongestEmotion.name + ' ' + this.strongestEmotion.intensity + " color: " + color);

      this.uiEmotionName.setColor(color);
      this.uiEmotionName.setShadow(5, 5, 'rgba(0,0,0,0.8)', 10);
      this.uiEmotionName.setText(this.strongestEmotion.name);
      this.uiEmotionBar.setScale(this.strongestEmotion.intensity, 1);
      this.uiEmotionBar.tint = Phaser.Display.Color.HexStringToColor(color).color;
    }

  }

  /**
   * Method that updates the Emotional UI position
   */
  private updateEmotionUI() {
    this.uiEmotionContainer.x = this.x;
    this.uiEmotionContainer.y = this.y - this.EMOTION_CONTAINER_VERTICAL_OFFSET;
    this.uiEmotionBar.x = this.x;
    this.uiEmotionBar.y = this.y - this.EMOTION_CONTAINER_VERTICAL_OFFSET;
    this.uiEmotionName.x = this.x;
    this.uiEmotionName.y = this.y - this.EMOTION_NAME_VERTICAL_OFFSET;
  }

  public setEmotionalAgent(agent){
    this.emotionAgent = agent;
    this.renderStrongestEmotion();
  }

  public getEmotionalAgent(){
    return this.emotionAgent;
  }

  protected destroyInstance() {
    this.uiEmotionName.destroy();
    this.uiEmotionContainer.destroy();
    this.uiEmotionBar.destroy();

    this.destroy();
  }

}
