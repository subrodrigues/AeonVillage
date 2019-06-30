import { REGISTRY_KEYS } from '../constants/service/registry';
import { SCENES } from '../constants/service/scenes';
import { EVENTS } from '../constants/service/events';

export class GameManager extends Phaser.Scene {
  constructor() {
    super(SCENES.GAME_MANAGER);
  }

  public get playerHp(): number {
    return this.registry.get(REGISTRY_KEYS.PLAYER.HP);
  }

  public set playerHp(newHp: number) {
    this.registry.set(REGISTRY_KEYS.PLAYER.HP, newHp);
    this.events.emit(EVENTS.UPDATE_HP);
  }

  public showDialogueMessage(message: string) {
    this.events.emit(EVENTS.SHOW_DIALOGUE_MESSAGE, message);
  }

  protected create() {
    this.scene.launch(SCENES.HUD);
  }
}
