import Boot from "./scenes/boot.scene.js";
import Play from "./scenes/play.scene.js";

export default function initGame() {
    new Phaser.Game({
		width: 800,
		height: 600,
		type: Phaser.AUTO,
		parent: 'game',
		backgroundColor: "#242424",
		physics: {
			default: "arcade",
			arcade: {
				debug: false
			}
		},
		scene: [Boot, Play],
		scale: {
			mode: Phaser.Scale.FIT,
			//autoCenter: Phaser.Scale.CENTER_BOTH
		}
	});
}
