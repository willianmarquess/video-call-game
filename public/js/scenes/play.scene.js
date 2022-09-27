import NameText from "../gameObjects/name-text.go.js";
import Player from "../gameObjects/player.go.js";
import global from "../utils/global.js";
import UsersListComponent from "../pageComponents/usersList.component.js";
import WebSocketManager from "../utils/web-socket-manager.util.js";

export default class Play extends Phaser.Scene {

    #playersLayer = null;
    #player = null;
    #otherPlayers = {};
    #playerData = global.user;
    #nameOtherPlayers = {};
    #obstacles = null;
    #socket = null;

    constructor() {
        super('play');
        this.#socket = WebSocketManager.getInstance();
    }

    init() {
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN, 
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    }

    create() {
        this.#configMap();
        this.#playersLayer = this.add.layer(); 
        this.#player = new Player(this, 100, 100, 'player');
        this.#playersLayer.add(this.#player);

        this.physics.add.collider(this.#obstacles, this.#player);

        this.cameras.main.startFollow(this.#player, true);
        this.cameras.main.setBounds(0, 0, 800, 640, true);

        this.#handleServerEvents();
    }

    #configMap() {
        const tilemap = this.make.tilemap({ key: 'mapa1' });
        const grass_tiles = tilemap.addTilesetImage('grass', 'grass');
        tilemap.createLayer('ground', grass_tiles);
        const fences_tiles = tilemap.addTilesetImage('fences', 'fences');
        const plains_tiles = tilemap.addTilesetImage('plains', 'plains');
        tilemap.createLayer('obs', [fences_tiles, plains_tiles]);

        const objLayerMap = tilemap.getObjectLayer('obj');
        this.#obstacles = this.physics.add.staticGroup();

        objLayerMap.objects.forEach(obj => {
            const { x, y, width, height } = obj;
            const rect = this.add.rectangle(x, y, width, height).setOrigin(0);
            this.#obstacles.add(rect);
        })
    }
    
    #handleServerEvents() {
        this.#socket.emit('player-start', this.#player.getUpdateData());
    
        this.#socket.on('current-players', players => {
            UsersListComponent.initUsersListComponent(players); 
            delete players[this.#playerData.id];
            for (const id in players) {
                this.#renderOtherPlayer(players[id]);
            }
        });
    
        this.#socket.on('new-player', player => { 
            UsersListComponent.addUserToListComponent(player);
            this.#renderOtherPlayer(player);
        })
    
        this.#socket.on('player-moved', player => { 
            if(this.#playerData.id !== player.id) {
                this.#renderOtherPlayer(player);
            }
        });
    
        this.#socket.on('player-disconnected', (otherPlayerId) => { 
            UsersListComponent.removeUserFromListComponent(otherPlayerId);
            this.#destroyOtherPlayer(otherPlayerId);
        });
    }

    #destroyOtherPlayer(otherPlayerId) {
        const playerExists = this.#otherPlayers[otherPlayerId];
        if(playerExists) {
            this.#nameOtherPlayers[otherPlayerId].destroy();
            delete this.#nameOtherPlayers[otherPlayerId];
            playerExists.destroy();
            delete this.#otherPlayers[otherPlayerId];
        }
    }

    #renderOtherPlayer(otherPlayer) {
        const playerExists = this.#otherPlayers[otherPlayer.id];
        if(playerExists) {
            this.#updateOtherPlayer(otherPlayer);
        } else {
            this.#createNewOtherPlayer(otherPlayer);
        }
    }

    update(time, dt) {
        if(this.#player)
        this.#player.update(time, dt);

        if(this.#nameOtherPlayers) {
            for (const id in this.#nameOtherPlayers) {
                this.#nameOtherPlayers[id].update();
            }
        }
    }

    #updateOtherPlayer(otherPlayer) {
        this.#otherPlayers[otherPlayer.id].setPosition(otherPlayer.gameObject.body.x + 8, otherPlayer.gameObject.body.y)
        this.#otherPlayers[otherPlayer.id].anims.play(otherPlayer.gameObject.animation.currentAnimKey, true);
        this.#otherPlayers[otherPlayer.id].flipX = otherPlayer.gameObject.flipX;
        this.#nameOtherPlayers[otherPlayer.id].setPlayer(this.#otherPlayers[otherPlayer.id]);
    }

    #createNewOtherPlayer(otherPlayer) {
        const newOtherPlayer = this.physics.add.sprite(otherPlayer.gameObject.body.x + 8, otherPlayer.gameObject.body.y);
        newOtherPlayer.anims.play(otherPlayer.gameObject.animation.currentAnimKey, true);
        newOtherPlayer.flipX = otherPlayer.gameObject.flipX;
        newOtherPlayer.body.setSize(16, 16);
        newOtherPlayer.body.setOffset(16, 16 + (16 / 2));
        this.#otherPlayers[otherPlayer.id] = newOtherPlayer;
        const newPlayerName = new NameText(this, newOtherPlayer, otherPlayer.name, '#fff');
        this.#nameOtherPlayers[otherPlayer.id] = newPlayerName;
    }

}