import { AbstractScene } from './AbstractScene';
import { SCENES } from '../constants/service/scenes';
import { MAPS } from '../constants/assets/maps';

export class SecondLevel extends AbstractScene {
  constructor() {
    super(SCENES.SECOND_LEVEL, MAPS.secondLevel.key);
  }
}
