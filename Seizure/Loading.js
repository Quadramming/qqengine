import {Manager} from './Manager.js';
import {Seizure} from './Seizure.js';
import * as Subject from '../Subject/index.js';
import * as Sprite from '../Sprite/index.js';
import {Size, Point, Scale, Rect} from '../primitives/index.js';

class Loading extends Seizure {
	
	constructor(options) {
		super(options);
		this.setBackground('black');
		let s = Subject.make({
			seizure: this,
			size: new Size(3, 3),
			anchor: new Point(0.5, 0.5),
			scale: new Scale(1, 1),
			position: new Point(3, 3),
			angle: 0.4,
			selfAdd: true,
			isActor: false,
			image: 'char',
			isClickable: true
		});
	}
	
}

Manager.addToRegister('Loading', Loading);
