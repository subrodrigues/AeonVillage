import { FirstLevel } from './scenes/FirstLevel';
import { SecondLevel } from './scenes/SecondLevel';
import { Preloader } from './scenes/Preloader';
import { GameManager } from './scenes/GameManager';
import { HUD } from './scenes/HUD';
declare var Phaser: any;

class PhaserGame extends Phaser.Game {
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
          debug: true,
        },
      },
      scene: [Preloader, FirstLevel, SecondLevel, GameManager, HUD],
    };
    super(config);
  }
}

// tslint:disable-next-line
new PhaserGame();
