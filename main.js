import * as QQ from './QQ.js';
import {game} from './gameGlobal.js';

const images = [
	['AAA', 'images/doge.jpg'],
	['rpg', 'images/rpg.png'],
	['anime', 'images/animation.png'],
	['checkBoxEmpty', 'images/unCheck.png'],
	['checkBoxChecked', 'images/check.png'],
];

const sounds = [
	// ['battle', 'sounds/battle.ogg'],
	['arrow',  'sounds/arrow.ogg'],
	['coin',   'sounds/coin.ogg'],
	['hitted', 'sounds/punch.ogg'],
	['throw',  'sounds/throw.ogg']
];

const appConfig = {
	imgs: images,
	sounds: sounds,
	showFps: false,
	game: game
};

QQ.start(appConfig);
