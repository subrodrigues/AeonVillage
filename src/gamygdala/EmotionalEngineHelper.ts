
declare var TUDelft: any;

export class EmotionalEngineHelper {

  private emotionEngine: TUDelft.Gamygdala;
  private AGENTS_GAIN = 20;

  constructor(){
    /** Emotional Engine initialization **/
    // this.phaserGame = PhaserGame.instance;
    this.emotionEngine = new TUDelft.Gamygdala(); // this simply creates an emotion engine without plugin supports
    this.emotionEngine.debug = true;

    this.emotionEngine.setGain(this.AGENTS_GAIN);
    /** Emotional Engine initialization **/
  }

  public toggleDebug(){
    this.emotionEngine.debug = !this.emotionEngine.debug;
    console.log(this.emotionEngine.debug ? '[DEBUG ON] - Emotional log will be shown on console' :
      '[DEBUG OFF] - No emotional log on console');
  }


}
