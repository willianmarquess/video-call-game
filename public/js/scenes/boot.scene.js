import ProgressText from "../gameObjects/progress-text.go.js";


export default class Boot extends Phaser.Scene {

    constructor() {
        super('boot');
    }

    #configProgressText() {
        const progressText = new ProgressText(this, 600, 500);
        progressText.setOrigin(0.5, 0.5);
		progressText.text = "0%";
		progressText.setStyle({ "fontSize": "60px" });
    }

    preload() {
        this.#configProgressText();
        this.load.spritesheet('player', 'assets/characters/player.png', { frameWidth: 48, frameHeight: 48 });
        this.load.tilemapTiledJSON('mapa1', 'assets/map/map1.json');
        this.load.image('fences', 'assets/map/tilesets/fences.png');
        this.load.image('grass', 'assets/map/tilesets/grass.png');
        this.load.image('plains', 'assets/map/tilesets/plains.png');
    }

    create() {
        this.anims.create({
            key: 'player_idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'player_run',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'player_atk',
            frames: this.anims.generateFrameNumbers('player', { start: 11, end: 14 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.start('play');
    }
}