import {Manager} from './Manager.js';
import {Seizure} from './Seizure.js';
import * as Subject from '../Subject/index.js';
import * as Sprite from '../Sprite/index.js';
import {Size, Point, Scale, Rect} from '../primitives/index.js';

class Loading extends Seizure {
	
	constructor(options) {
		super(options);
		this.setBackground('black');
		
		const o = new Subject.Sprite({
			angle: 0.3,
			position: new Point(2, 2),
			size: new Size(3, 3),
			image: 'char',
			onClick: (p)=>c(p)
		});
		const i = new Subject.Sprite({
			position: new Point(0, 0),
			size: new Size(1, 1),
			image: 'char',
			onClick: (p)=>c(p)
		});
		
		//o.addSubject(i);
		this.addSubject(o);
	}
	
}

Manager.addToRegister('Loading', Loading);
