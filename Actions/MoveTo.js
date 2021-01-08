// QQDOC

import {Move} from './Move.js';

export class MoveTo extends Move {
	
	constructor(options = {}) {
		options.from = null;
		super(options);
	}
	
}
