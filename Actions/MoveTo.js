import {Move} from './Move.js';

export class MoveTo extends Move {
	
	constructor(options) {
		options.from = options.subj.position();
		super(options);
	}
	
}
