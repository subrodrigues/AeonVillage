import { Orientation } from '../geometry/orientation';
import { Player } from '../game-objects/Player';
import { Treant } from '../game-objects/Treant';
import { Monster } from '../game-objects/Monster';
import { Mole } from '../game-objects/Mole';
import { Npc } from '../game-objects/Npc';
import { MAP_CONTENT_KEYS } from '../constants/map-content-keys';
import { ASSETS } from '../constants/assets';
import { MONSTERS } from '../constants/monsters';
// declare var TUDelft: any;

const PLAYER_INITIAL_POSITION = {
  x: 368,
  y: 416,
};

const musicConfig = {
  mute: false,
  volume: 0.7,
  rate: 1,
  detune: 0,
  seek: 0,
  loop: true,
  delay: 0
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
    world_objects: Phaser.Tilemaps.StaticTilemapLayer;
    collisions: Phaser.Tilemaps.StaticTilemapLayer;
  };

  public mapKey: string;

  public music: Phaser.Sound.BaseSound;

  constructor(key: string, mapKey: string) {
    super(key);

    // AbstractScene.emotionEngine = new TUDelft.Gamygdala();

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

  }

  protected init(data: InterSceneData) {
    this.createMapWithLayers();

    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    const levelChangerObjectLayer = this.map.objects.find(
      o => o.name === MAP_CONTENT_KEYS.objects.ZONES,
    );

    const playerInitialPosition = this.getPlayerInitialPosition(levelChangerObjectLayer, data);
    this.player = new Player(this, playerInitialPosition.x, playerInitialPosition.y);

    const npcsMapObjects = this.map.objects.find(o => o.name === MAP_CONTENT_KEYS.objects.NPCS);
    const npcs: any = npcsMapObjects ? npcsMapObjects.objects : [];
    this.npcs = npcs.map(npc => {
      return new Npc(this, npc.x, npc.y, npc.properties.message);
    });

    const monstersMapObjects = this.map.objects.find(o => o.name === MAP_CONTENT_KEYS.objects.MONSTERS);
    const monsters: any = monstersMapObjects ? monstersMapObjects.objects : [];

    this.monsters = monsters.map((monster: any): Monster => {
      switch (monster.type) {
        case MONSTERS.evil_mole:
          return new Mole(this, monster.x, monster.y, monster.properties[0].value);
        case MONSTERS.protector_treant:
          return new Treant(this, monster.x, monster.y, monster.properties[0].value);
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
    //
    // for (let i = 0; i < this.monsters.length; i++){
    //   // create the Gamygdala agent and store it in the bad_guy object for easy reference later, because when the player gets hit, we need to tell gamygdala who did it.
    //   this.monsters[i].emotionAgent = AbstractScene.emotionEngine.createAgent(this.monsters[i] instanceof Mole ? "mole_" + i: "treant_" + i);
    //   // add a relation between player and monster for fun, the first monster hates the player, the second one likes the player, the third hates, etc..
    //   const relation = this.monsters[i] instanceof Mole ? -1.0 : 0.0;
    //   AbstractScene.emotionEngine.createRelation(monsters[i].type + i, 'player', relation);
    //
    //   // add expression to the bad guy so we see something
    //   // this.game.plugins.add(new Phaser.Plugin.GamygdalaExpression(game, enemies_group.getAt(i), enemies_group.getAt(i).emotionAgent));
    //   // We don't need to set goals for these bad guys. In our setup they achieve nothing, just react to what happens with the player: feel pity, gloating, etc...
    // }
    //
    // AbstractScene.emotionEngine.setGain(20);
    // AbstractScene.emotionEngine.debug=true;

    this.sound.play('music', musicConfig);

  }

  private createMapWithLayers() {
    this.map = this.make.tilemap({ key: this.mapKey });
    const tileset = this.map.addTilesetImage(ASSETS.TILESET, ASSETS.IMAGES.TILES, 16, 16, 0, 0);
    const objsTileset = this.map.addTilesetImage(ASSETS.OBJECTS_TILESET, ASSETS.IMAGES.OBJECT_TILES, 16, 16, 0, 0);

    this.layers = {
      background: this.map.createStaticLayer(MAP_CONTENT_KEYS.layers.BACKGROUND, tileset, 0, 0),
      deco: this.map.createStaticLayer(MAP_CONTENT_KEYS.layers.DECORATION, tileset, 0, 0),
      deco_top: this.map.createStaticLayer(MAP_CONTENT_KEYS.layers.DECORATION_TOP, tileset, 0, 0),
      deco_extra: this.map.createStaticLayer(MAP_CONTENT_KEYS.layers.DECORATION_EXTRA, tileset, 0, 0),
      world_objects: this.map.createStaticLayer(MAP_CONTENT_KEYS.layers.WORLD_OBJECTS, objsTileset, 0, 0),
      collisions: this.map.createStaticLayer(MAP_CONTENT_KEYS.layers.COLLISION_LAYER, tileset, 0, 0),
    };
    // this.layers.collisions.setCollisionByProperty({ collides: true });

    // this.layers.collisions.setCollisionBetween(0, 59);
    this.layers.deco.setCollisionByProperty({ collides: true });
    // this.layers.deco.setCollisionBetween(0, 59);

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.layers.deco.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
  }

  private addColliders() {
    this.physics.add.collider(this.player, this.layers.deco);
    this.physics.add.collider(this.player, this.layers.deco_top);
    this.physics.add.collider(this.player, this.layers.deco_extra);
    this.physics.add.collider(this.player, this.layers.world_objects);


    this.monsterGroup = this.physics.add.group(this.monsters.map(monster => monster));
    this.physics.add.collider(this.monsterGroup, this.layers.collisions);
    // this.physics.add.collider(this.monsterGroup, this.layers.deco);
    this.physics.add.overlap(this.monsterGroup, this.player, (_: Player, m: Monster) => {
      m.attack();
    });

    // this.physics.add.collider(this.player, this.layers.collisions);
    // this.physics.add.collider(this.player, this.layers.deco);
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

}
