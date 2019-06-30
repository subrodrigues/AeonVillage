import { AbstractScene } from './AbstractScene';
import { SCENES } from '../constants/service/scenes';
import { MAPS } from '../constants/assets/maps';

export class FirstLevel extends AbstractScene {
  constructor() {
    super(SCENES.FIRST_LEVEL, MAPS.firstLevel.key);
  }
}
