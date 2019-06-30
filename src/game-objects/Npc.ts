import { AbstractScene } from '../scenes/AbstractScene';
import { ASSETS } from '../constants/assets/assets';
import { GameManager } from '../scenes/GameManager';
import { SCENES } from '../constants/service/scenes';

export class Npc extends Phaser.Physics.Arcade.Sprite {
  public scene: AbstractScene;
  protected uiScene: GameManager;
  private readonly message: string;

  constructor(scene: AbstractScene, x: number, y: number, text: string) {
    super(scene, x, y, ASSETS.IMAGES.NPCS, 0);
    this.scene = scene;
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.message = text;

    const uiScene: any = this.scene.scene.get(SCENES.GAME_MANAGER);
    this.uiScene = uiScene;

    this.setDepth(5);
    this.setSize(12, 12);

    this.setImmovable(true);
  }

  public talk = () => {
    this.uiScene.showDialogueMessage(this.message);
  }
}
