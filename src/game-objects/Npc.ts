import { AbstractScene } from '../scenes/AbstractScene';
import { ASSETS } from '../constants/assets/assets';
import { GameManager } from '../scenes/GameManager';
import { SCENES } from '../constants/service/scenes';
import { GameUtils } from '../utils/GameUtils';

// TODO: Refactor Emotional things into a class
export class Npc extends Phaser.Physics.Arcade.Sprite {
  private EMOTION_NAME_VERTICAL_OFFSET = 23;
  private EMOTION_CONTAINER_VERTICAL_OFFSET = 16;

  public scene: AbstractScene;
  protected uiScene: GameManager;
  // @ts-ignore
  private readonly joyText: string;
  private readonly standardMessage: string;

  protected emotionAgent;
  protected strongestEmotion: TUDelft.Gamygdala.Emotion; // To be dealt with and updated with the leaf instanced object
  protected uiEmotionContainer;
  protected uiEmotionName;
  protected uiEmotionBar;

  constructor(scene: AbstractScene, type: string, x: number, y: number, joyText: string, standardMessage: string) {
    super(scene, x, y, type, 0);

    this.scene = scene;
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.joyText = joyText;
    this.standardMessage = standardMessage;

    const uiScene: any = this.scene.scene.get(SCENES.GAME_MANAGER);
    this.uiScene = uiScene;

    this.setDepth(5);
    this.setSize(12, 12);

    this.setImmovable(true);

    this.setupEmotionalUI();
  }

  public update(){
    this.renderStrongestEmotion();
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

    this.uiEmotionName.setDepth(1050);
    this.uiEmotionContainer.setDepth(1050);
    this.uiEmotionBar.setDepth(1050);
  }

  public talk = () => {
    var color = GameUtils.getEmotionColor(this.strongestEmotion.name);

    if(color === '#198C19') // green
      this.uiScene.showDialogueMessage(this.joyText);
    else
      this.uiScene.showDialogueMessage(this.standardMessage);
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
      // console.log('EMOTION :' + this.strongestEmotion.name + ' ' + this.strongestEmotion.intensity + " color: " + color);

      this.uiEmotionName.setColor(color);
      this.uiEmotionName.setShadow(5, 5, 'rgba(0,0,0,0.8)',10);
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
}
