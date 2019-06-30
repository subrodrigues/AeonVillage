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
  protected scene: AbstractScene;
  protected uiScene: GameManager;

  public emotionAgent;
  protected strongestEmotion: TUDelft.Gamygdala.Emotion; // To be dealt with and updated with the leaf instanced object

  constructor(scene: AbstractScene, x: number, y: number, sprite: string) {
    super(scene, x, y, sprite, 0);
    this.scene = scene;
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    const uiScene: any = this.scene.scene.get(SCENES.GAME_MANAGER);
    this.uiScene = uiScene;

  }

  protected animate(
    animationKeys: CharacterAnimation,
    orientation: Orientation,
  ) {
    const { flip, anim } = animationKeys[orientation];
    this.setFlipX(flip);
    this.play(anim, true);
  }

  protected renderStrongestEmotion() {
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

    }

  }

}
