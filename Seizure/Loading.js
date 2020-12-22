import * as Subject from '../Subject/index.js';
import * as Sprite from '../Sprite/index.js';
import {Manager} from './Manager.js';
import {Seizure} from './Seizure.js';
import {Size, Point, Scale, Rect} from '../primitives/index.js';

class Loading extends Seizure {
	
	constructor(options) {
		super(options);
		this.setBackground('black');
	}
	
}

Manager.registerSeizure('Loading', Loading);
