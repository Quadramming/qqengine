import {Point, Size} from '../primitives/index.js';
import {Container} from '../Container.js';

export class Group extends Container {
	
	constructor(options = {}) {
		options.anchor = new Point(0, 0);
		options.size = new Size(0, 0);
		super(options);
	}
	
}
