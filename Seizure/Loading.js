import {Manager} from './Manager.js';
import {Seizure} from './Seizure.js';
import * as Subject from '../Subject/index.js';
import * as Sprite from '../Sprite/index.js';
import {Size, Point, Scale, Rect} from '../primitives/index.js';

class Loading extends Seizure {
	
	constructor(options) {
		super(options);
		this.setBackground('black');
		
		let g = new Subject.Group({
			position: new Point(-4, 0),
			parent: this.getWorld().getStage(),
			selfAdd: true
		});
		
		let s = Subject.make({
			/*
			size: new Size(3, 3),
			position: new Point(3.5, 3.5),
			anchor: new Point(1, 1),
			angle: 0.4,
			scale: new Scale(1, 3),
			*/
			selfAdd: true,
			parent: g,
			image: 'char',
			onClick: ()=>c(1),
			tickFn: ()=>c(2)
		});
	}
	
}

Manager.addToRegister('Loading', Loading);
