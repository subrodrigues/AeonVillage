import emotionColorMap from '../constants/emotion-colors';
import { NpcTypes } from '../constants/npc-types';
import { ASSETS } from '../constants/assets/assets';

export class GameUtils {

  public static getEmotionColor(emotion: string){
    return emotionColorMap.get(emotion);
  }

  public static getNpcSpriteByType(type: string){
    switch(type){
      case NpcTypes.wiseman:
        return ASSETS.IMAGES.NPC_WISEMAN;
      case NpcTypes.male_villager:
        return ASSETS.IMAGES.NPC_MALE_VILLAGER;
      case NpcTypes.female_villager:
        return ASSETS.IMAGES.NPC_FEMALE_VILLAGER;
    }
  }
}
