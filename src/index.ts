import { FirstLevel } from './scenes/FirstLevel';
import { SecondLevel } from './scenes/SecondLevel';
import { Preloader } from './scenes/Preloader';
import { GameManager } from './scenes/GameManager';
import { HUD } from './scenes/HUD';
import { TitleScreen } from './scenes/TitleScreen';
import { GameOverScreen } from './scenes/GameOverScreen';

declare var Phaser: any;

export class PhaserGame extends Phaser.Game {
  private static _instance = new PhaserGame();

  constructor() {
    const config = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: 1088,
      height: 768,
      pixelArt: true,
      roundPixels: true,
      fps: {
        target: 60,
        min: 30,
        forceSetTimeOut: true
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        gravity: { y: 0 }, // Top down game, so no gravity
        arcade: {
          debug: false,
        },
      },
      scene: [Preloader, TitleScreen, FirstLevel, SecondLevel, GameManager, HUD, GameOverScreen],
    };
    super(config);

    // this.plugins.add(new Phaser.Plugin.GamygdalaExpression(this, player, player.emotionAgent));
  }

  static get instance() {
    return this._instance;
  }

  // @ts-ignore
  /**
   * Method that adds a new Gamygdala Expression to use the Gamygdala.Expression plugin functionality to visually express the emotions.
   * Note: If we make our own emotion expressions and effects, this is not needed.
   *
   * @param sprite
   * @param agent
   * @param showOnlyMaxIntensity
   */
  // public addGamygdalaExpression(sprite, agent, showOnlyMaxIntensity?){
  //   this.plugins.add(new Phaser.Plugin.GamygdalaExpression(this, sprite, agent));
  // }

}

// tslint:disable-next-line
// export default new PhaserGame();
