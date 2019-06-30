import emotionColorMap from '../constants/emotion-colors';

export class GameUtils {

  public static getEmotionColor(emotion: string){
    return emotionColorMap.get(emotion);
  }

}
