import global from "../utils/global.js";
import UserSevice from "../services/user.service.js";
import StateMachine from "../utils/state-machine.util.js";
import WebSocketManager from "../utils/web-socket-manager.util.js";
import NameText from "./name-text.go.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    #realWidth = 16;
    #realHeight = 16;
    #stateMachine = null;
    #speedX = 150;
    #speedY = 120;
    #lastInfo = { x: 0, y: 0, currentAnim: null };
    #nameText = null;
    #socket = null;

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.#socket = WebSocketManager.getInstance();
        this.#config();
        this.#initStateMachine();
        //this.getCenter()
    }

    #config() {
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setSize(this.#realWidth, this.#realHeight);
        this.body.setOffset(this.#realWidth, this.#realHeight + (this.#realHeight / 2));
        this.#speedX = 150;
        this.#speedY = 120;

        this.#nameText = new NameText(this.scene, this, global.user.name, '#f00');
    }

    #initStateMachine() {
        this.#stateMachine = new StateMachine(this);
        this.#stateMachine
        .addState('idle', { onEnter: this.#idleOnEnter, onUpdate: this.#idleOnUpdate })
        .addState('run', { onEnter: this.#runOnEnter, onUpdate: this.#runOnUpdate })
        .addState('atk', { onEnter: this.#atkOnEnter, onUpdate: this.#atkOnUpdate })
        .setState('idle');
    }

    #idleOnEnter() {
        this.anims.play('player_idle', true);
    }

    #idleOnUpdate(){
        if (this.scene.cursors.right.isDown || this.scene.cursors.left.isDown || this.scene.cursors.up.isDown || this.scene.cursors.down.isDown) {
            this.#stateMachine.setState('run');
            return;
        }
        if (this.scene.cursors.space.isDown) {
            this.#stateMachine.setState('atk');
            return;
        }
    }

    #runOnEnter(){
        this.anims.play('player_run', true);
    }

    #runOnUpdate(){
        if (this.scene.cursors.right.isDown && this.scene.cursors.down.isDown) {
            this.setVelocity(this.#speedX, this.#speedY);
            this.flipX = false;
            return;
        }
        if (this.scene.cursors.right.isDown && this.scene.cursors.up.isDown) {
            this.setVelocity(this.#speedX, -this.#speedY);
            this.flipX = false;
            return;
        }
        
        if (this.scene.cursors.left.isDown && this.scene.cursors.down.isDown) {
            this.setVelocity(-this.#speedX, this.#speedY);
            this.flipX = true;
            return;
        }
        if (this.scene.cursors.left.isDown && this.scene.cursors.up.isDown) {
            this.setVelocity(-this.#speedX, -this.#speedY);
            this.flipX = true;
            return;
        }

        if (this.scene.cursors.right.isDown) {
            this.setVelocity(this.#speedX, 0);
            this.flipX = false;
            return;
        } 
        if (this.scene.cursors.left.isDown) {
            this.setVelocity(-this.#speedX, 0);
            this.flipX = true;
            return;
        }
        if (this.scene.cursors.up.isDown) {
            this.setVelocity(0, -this.#speedY);
            return;
        }
        if (this.scene.cursors.down.isDown) {
            this.setVelocity(0, this.#speedY);
            return;
        }
        if (this.scene.cursors.space.isDown) {
            this.#stateMachine.setState('atk');
            return;
        }

        this.setVelocityX(0);
        this.setVelocityY(0);
        this.#stateMachine.setState('idle');
    }

    #atkOnEnter(){
        this.anims.play('player_atk', true);
    }

    #atkOnUpdate(){
        if (this.scene.cursors.space.isDown) {
            this.setVelocity(0, 0);
            return;
        }
        if (this.scene.cursors.up.isDown 
            || this.scene.cursors.down.isDown
            || this.scene.cursors.left.isDown
            || this.scene.cursors.right.isDown) {
            this.#stateMachine.setState('run');
            return;
        }

        this.#stateMachine.setState('idle');
    }

    update(_, deltaTime){
        if(this.body.x !== this.#lastInfo.x || this.body.y !== this.#lastInfo.y || this.#lastInfo.currentAnim !== this.anims.currentAnim) {
            this.#lastInfo = { x: this.body.x, y: this.body.y, currentAnim: this.anims.currentAnim };
            this.#sendPlayerUpdate();
        }
        this.#stateMachine.update(deltaTime);
        this.#nameText.update();
    }

    getUpdateData() {
        return {
            id: global.user.id,
            gameObject: {
                body: {
                    x: this.body.x,
                    y: this.body.y
                },
                animation: {
                    currentAnimKey: this.anims.currentAnim.key,
                },
                flipX: this.flipX
            }
        }
    }

    #sendPlayerUpdate() {
        this.#socket.emit('player-movement', this.getUpdateData());
    }
    
    getCenterX(){
        return (this.body.position.x + (this.body.width / 2));
    }
}