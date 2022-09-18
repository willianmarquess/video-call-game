export default class NameText extends Phaser.GameObjects.Text{

    #player;

    constructor(scene, player, namePlayer = 'default_name', color){
        super(scene, 0, 0);
        this.scene = scene;
        this.scene.add.existing(this);
        this.#player = player; 
        this.text = namePlayer;
        this.setColor(color)
    }

    setPlayer(player) {
        this.#player = player;
    }

    update(){
        this.y = (this.#player.body.position.y - 25);
        this.x = (this.#player.body.position.x + (this.#player.body.width / 2)) - (this.width / 2);
    }
}