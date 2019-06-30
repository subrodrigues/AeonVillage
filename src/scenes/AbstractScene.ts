import { Orientation } from '../geometry/orientation';
import { Player } from '../game-objects/Player';
import { Treant } from '../game-objects/Treant';
import { Monster } from '../game-objects/Monster';
import { Mole } from '../game-objects/Mole';
import { Npc } from '../game-objects/Npc';
import { MAP_CONTENT_KEYS } from '../constants/assets/map-content-keys';
import { ASSETS } from '../constants/assets/assets';
import { MonsterTypes } from '../constants/monster-types';
import { EmotionalEngineAgents, EmotionalEngineGoals } from '../constants/emotional-engine-variables';
import { GameUtils } from '../utils/GameUtils';
import { SCENES } from '../constants/service/scenes';
// import { PhaserGame } from '../index';

declare var TUDelft: any;

const PLAYER_INITIAL_POSITION = {
  x: 400,
  y: 270,
};

const musicConfig = {
  mute: false,
  volume: 0.7,
  rate: 1,
  detune: 0,
  seek: 0,
  loop: true,
  delay: 0,
};

interface InterSceneData {
  comesFrom: string;
}

export abstract class AbstractScene extends Phaser.Scene {
  // public static emotionEngine: TUDelft.Gamygdala;   //this simply creates an emotion engine without plugin support.

  public player: Player;
  public cursors: CursorKeys;
  public npcs: Npc[];
  public monsters: Monster[];
  public map: Phaser.Tilemaps.Tilemap;
  public monsterGroup: Phaser.Physics.Arcade.Group;
  public layers: {
    background: Phaser.Tilemaps.StaticTilemapLayer;
    deco: Phaser.Tilemaps.StaticTilemapLayer;
    deco_top: Phaser.Tilemaps.StaticTilemapLayer;
    deco_extra: Phaser.Tilemaps.StaticTilemapLayer;
    world_objects_lower: Phaser.Tilemaps.StaticTilemapLayer;
    world_objects: Phaser.Tilemaps.StaticTilemapLayer;
    collisions: Phaser.Tilemaps.StaticTilemapLayer;
    monster_collisions: Phaser.Tilemaps.StaticTilemapLayer;
  };

  public mapKey: string;

  public music: Phaser.Sound.BaseSound;

  private emotionEngine: TUDelft.Gamygdala;
  private score = 0;
  private totalEvilMoles = 0;
  private totalProtTreant = 0;
  private debugKey;

  constructor(key: string, mapKey: string) {
    super(key);

    /** Emotional Engine initialization **/
    // this.phaserGame = PhaserGame.instance;
    this.emotionEngine = new TUDelft.Gamygdala(); // this simply creates an emotion engine without plugin supports
    this.emotionEngine.debug = true;
    this.emotionEngine.setGain(20);
    /** Emotional Engine initialization **/

    this.mapKey = mapKey;

    this.player = null;
    this.cursors = null;
    this.npcs = [];
    this.monsters = [];
    this.monsterGroup = null;
    this.map = null;
    this.layers = null;
  }

  public update() {
    if (Phaser.Input.Keyboard.JustDown(this.debugKey)) {
      this.emotionEngine.debug = !this.emotionEngine.debug;
      console.log(this.emotionEngine.debug ? '[DEBUG ON] - Emotional log will be shown on console' :
        '[DEBUG OFF] - No emotional log on console');
    }

    const keyPressed = {
      left: this.cursors.left.isDown,
      right: this.cursors.right.isDown,
      up: this.cursors.up.isDown,
      down: this.cursors.down.isDown,
      space: this.cursors.space.isDown,
      shift: this.cursors.shift.isDown,
    };

    this.monsters.map((monster: Monster) => monster.updateMonster());
    this.player.updatePlayer(keyPressed);
    this.npcs.map((npc: Npc) => npc.update());
  }

  protected init(data: InterSceneData) {
    this.createMapWithLayers();

    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    const levelChangerObjectLayer = this.map.objects.find(
      o => o.name === MAP_CONTENT_KEYS.objects.ZONES,
    );

    const playerInitialPosition = this.getPlayerInitialPosition(levelChangerObjectLayer, data);
    this.player = new Player(this, playerInitialPosition.x, playerInitialPosition.y);

    /** GAMYGDALA Player initialization**/
    this.player.setEmotionalAgent(this.emotionEngine.createAgent(EmotionalEngineAgents.player));
    this.emotionEngine.createAgent(EmotionalEngineAgents.village);

    this.emotionEngine.createGoalForAgent(EmotionalEngineAgents.player, EmotionalEngineGoals.player_survive, 1);
    this.emotionEngine.createGoalForAgent(EmotionalEngineAgents.player, EmotionalEngineGoals.player_win, 1.0);
    this.emotionEngine.createGoalForAgent(EmotionalEngineAgents.player, EmotionalEngineGoals.village_in_danger, -1);
    this.emotionEngine.createGoalForAgent(EmotionalEngineAgents.player, EmotionalEngineGoals.protect_village, 1);
    this.emotionEngine.createGoalForAgent(EmotionalEngineAgents.village, EmotionalEngineGoals.village_in_danger, -1);

    this.emotionEngine.createRelation(EmotionalEngineAgents.player, EmotionalEngineAgents.village, 0.8);
    /** GAMYGDALA Player initialization**/


    const npcsMapObjects = this.map.objects.find(o => o.name === MAP_CONTENT_KEYS.objects.NPCS);
    const npcs: any = npcsMapObjects ? npcsMapObjects.objects : [];
    let i = 0;
    this.npcs = npcs.map(npc => {
      // TODO: do a proper properties parse. Looking into key names.
      let newNpc = new Npc(this, GameUtils.getNpcSpriteByType(npc.type), npc.x, npc.y, npc.properties[0].value, npc.properties[1].value);
      const agentNpcName = EmotionalEngineAgents.npc + i;
      newNpc.setEmotionalAgent(this.emotionEngine.createAgent(agentNpcName));
      i++;

      this.emotionEngine.createRelation(agentNpcName, EmotionalEngineAgents.village, 1.0);
      this.emotionEngine.createRelation(agentNpcName, EmotionalEngineAgents.player, 0.0);
      this.emotionEngine.createGoalForAgent(agentNpcName, EmotionalEngineGoals.village_in_danger, -1);

      return newNpc;
    });

    const monstersMapObjects = this.map.objects.find(o => o.name === MAP_CONTENT_KEYS.objects.MONSTERS);
    const monsters: any = monstersMapObjects ? monstersMapObjects.objects : [];
    let j = 0;
    let k = 0;
    this.monsters = monsters.map((monster: any): Monster => {
      switch (monster.type) {

        case MonsterTypes.evil_mole:
          this.totalEvilMoles += 1;
          var mole = new Mole(this, MonsterTypes.evil_mole, monster.x, monster.y, monster.properties[0].value);

          /** GAMYGDALA Mole initialization **/
            // create the Gamygdala agent and store it in the bad_guy object for easy reference later,
            // because when the player gets hit, we need to tell gamygdala who did it.
          const agentMoleName = EmotionalEngineAgents.evil_mole + j;

          mole.setEmotionalAgent(this.emotionEngine.createAgent(agentMoleName));
          j++;

          //add a relation between player and monster for fun,
          // mole hates the player
          const relationMole = -1.0;
          this.emotionEngine.createRelation(agentMoleName, EmotionalEngineAgents.player, relationMole);
          this.emotionEngine.createRelation(agentMoleName, EmotionalEngineAgents.village, relationMole);
          this.emotionEngine.createGoalForAgent(agentMoleName, EmotionalEngineGoals.village_in_danger, 1);
          this.emotionEngine.createGoalForAgent(agentMoleName, EmotionalEngineGoals.protect_village, -1);

          /** GAMYGDALA Mole initialization **/
          return mole;
        case MonsterTypes.protector_treant:
          this.totalProtTreant += 1;

          var treant = new Treant(this, MonsterTypes.protector_treant, monster.x, monster.y, monster.properties[0].value);

          /** GAMYGDALA Treant initialization **/
            // create the Gamygdala agent and store it in the bad_guy object for easy reference later,
            // because when the player gets hit, we need to tell gamygdala who did it.
          const agentTreantName = EmotionalEngineAgents.protector_treant + k;

          treant.setEmotionalAgent(this.emotionEngine.createAgent(agentTreantName));
          k++;

          //add a relation between player and monster for fun,
          // treant is neutral towards the player
          const relationTreant = 0.0;
          this.emotionEngine.createRelation(agentTreantName, EmotionalEngineAgents.player, relationTreant);
          this.emotionEngine.createRelation(agentTreantName, EmotionalEngineAgents.village, relationTreant);
          this.emotionEngine.createGoalForAgent(agentTreantName, EmotionalEngineGoals.protect_village, 1);
          /** GAMYGDALA Treant initialization **/

          return treant;

        default:
      }
    });


    if (levelChangerObjectLayer) {
      levelChangerObjectLayer.objects.map((o: any) => {
        const zone = this.add.zone(o.x, o.y, o.width, o.height);
        this.physics.add.existing(zone);
        this.physics.add.overlap(zone, this.player, () => {
          this.scene.start(o.properties.scene, { comesFrom: this.scene.key });
        });
      });
    }

    this.addColliders();

    this.initCamera();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.sound.play('music', musicConfig);

    this.emotionEngine.appraiseBelief(0.8, '', [EmotionalEngineGoals.village_in_danger], [1]);
    this.emotionEngine.appraiseBelief(0.2, EmotionalEngineAgents.player, [EmotionalEngineGoals.protect_village], [1]);

    this.debugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
  }

  private createMapWithLayers() {
    this.map = this.make.tilemap({ key: this.mapKey });
    const tileset = this.map.addTilesetImage(ASSETS.TILESET, ASSETS.IMAGES.TILES, 16, 16, 0, 0);
    const objsTileset = this.map.addTilesetImage(ASSETS.OBJECTS_TILESET, ASSETS.IMAGES.OBJECT_TILES, 16, 16, 0, 0);
    const tileObjs = this.map.addTilesetImage(ASSETS.TILE_OBJECTS, ASSETS.IMAGES.TILE_COLLIDER_OBJECTS, 16, 16, 16, 0);

    this.layers = {
      background: this.map.createStaticLayer(MAP_CONTENT_KEYS.layers.BACKGROUND, tileset, 0, 0),
      deco: this.map.createStaticLayer(MAP_CONTENT_KEYS.layers.DECORATION, tileset, 0, 0),
      deco_top: this.map.createStaticLayer(MAP_CONTENT_KEYS.layers.DECORATION_TOP, tileset, 0, 0),
      deco_extra: this.map.createStaticLayer(MAP_CONTENT_KEYS.layers.DECORATION_EXTRA, tileset, 0, 0),
      world_objects_lower: this.map.createStaticLayer(MAP_CONTENT_KEYS.layers.WORLD_OBJECTS_LOWER, objsTileset, 0, 0),
      world_objects: this.map.createStaticLayer(MAP_CONTENT_KEYS.layers.WORLD_OBJECTS, objsTileset, 0, 0),
      collisions: this.map.createStaticLayer(MAP_CONTENT_KEYS.layers.COLLISION_LAYER, tileObjs, 0, 0),
      monster_collisions: this.map.createStaticLayer(MAP_CONTENT_KEYS.layers.MONSTER_COLLISION_LAYER, tileObjs, 0, 0),
    };

    this.layers.collisions.setCollisionByProperty({ collides: true });
    this.layers.monster_collisions.setCollisionByProperty({ collides: true });

    this.layers.world_objects.setDepth(20);

    /** DEBUG COLLIDERS **/
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // this.layers.collisions.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });
    /** DEBUG COLLIDERS **/

  }

  private addColliders() {
    this.physics.add.collider(this.player, this.layers.collisions);

    this.monsterGroup = this.physics.add.group(this.monsters.map(monster => monster));
    this.physics.add.collider(this.monsterGroup, this.layers.collisions);
    this.physics.add.collider(this.monsterGroup, this.layers.monster_collisions);

    this.physics.add.overlap(this.monsterGroup, this.player, (_: Player, m: Monster) => {
      m.attack();
    });

    this.npcs.map((npc: Npc) =>
      this.physics.add.collider(npc, this.player, npc.talk),
    );
  }

  private getPlayerInitialPosition(
    levelChangerObjectLayer: Phaser.Tilemaps.ObjectLayer,
    data: InterSceneData,
  ): { x: number; y: number } {
    let playerX = PLAYER_INITIAL_POSITION.x;
    let playerY = PLAYER_INITIAL_POSITION.y;

    if (data && data.comesFrom) {
      const levelChanger: any = levelChangerObjectLayer.objects.find((o: any) => {
        return o.properties.scene === data.comesFrom;
      });

      // We shift the player position because we can't make him spawn on the
      // zone changer directly
      let xShift = 0;
      let yShift = 0;
      const SHIFT_VALUE = 50;
      switch (levelChanger.properties.comesBackFrom) {
        case Orientation.Right:
          xShift = SHIFT_VALUE;
          yShift = 0;
          break;
        case Orientation.Left:
          xShift = -SHIFT_VALUE;
          yShift = 0;
          break;
        case Orientation.Up:
          xShift = 0;
          yShift = -SHIFT_VALUE;
          break;
        case Orientation.Down:
          xShift = 0;
          yShift = SHIFT_VALUE;
          break;
        default:
          break;
      }

      playerX = levelChanger.x + levelChanger.width / 2 + xShift;
      playerY = levelChanger.y + levelChanger.height / 2 + yShift;
    }

    return { x: playerX, y: playerY };
  }

  private initCamera() {
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.cameras.main.setZoom(4);
  }

  /**
   * GAMYGDALA METHODS
   **/
  public monsterKilledByPlayer(type: string) {
    this.score += 1;

    for (var i = 0; i < this.monsters.length; i++) {
      if (this.monsters[i].getMonsterType() === type) {
        this.monsters[i].getEmotionalAgent().getRelation(EmotionalEngineAgents.player).like = -5;
      } else {
        this.monsters[i].getEmotionalAgent().getRelation(EmotionalEngineAgents.player).like = 5;
      }

      // this.emotionEngine.appraiseBelief(1, this.monsters[i].getEmotionalAgent(),[EmotionalEngineGoals.village_in_danger],
      //   this.monsters[i].getMonsterType() === MonsterTypes.evil_mole ? -0.1 : 0.1);
    }

    switch (type) {
      case MonsterTypes.evil_mole:
        this.emotionEngine.appraiseBelief(1, EmotionalEngineAgents.player,
          [EmotionalEngineGoals.player_win],
          [this.score / this.totalEvilMoles],
          true);

        this.emotionEngine.appraiseBelief(1, EmotionalEngineAgents.village,
          [EmotionalEngineGoals.village_in_danger],
          [-this.score / this.totalEvilMoles],
          true);
        break;
      case MonsterTypes.protector_treant:
        this.emotionEngine.appraiseBelief(1, EmotionalEngineAgents.player,
          [EmotionalEngineGoals.player_win],
          [-this.score / this.totalProtTreant],
          true);

        this.emotionEngine.appraiseBelief(1, EmotionalEngineAgents.village,
          [EmotionalEngineGoals.village_in_danger],
          [this.score / this.totalProtTreant],
          true);
        break;

    }
  }

  /**
   * Method to be invoked when the player dies.
   */
  requestGameOverScreen() {
    this.time.addEvent({
      delay: 900, // ms
      callback: this.launchGameOverScreen,
      loop: true,
      callbackScope: this,
    });
  }

  private launchGameOverScreen() {
    // this.sound.destroy();
    this.scene.remove(SCENES.HUD);
    this.scene.remove(SCENES.FIRST_LEVEL);
    this.scene.remove(SCENES.GAME_MANAGER);

    this.scene.launch(SCENES.GAME_OVER);
  }
}
