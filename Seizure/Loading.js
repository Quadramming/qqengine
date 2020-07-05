import {Manager} from './Manager.js';
import {Seizure} from './Seizure.js';
import * as Subject from '../Subject/index.js';
import * as Sprite from '../Sprite/index.js';
import {Size, Point, Scale, Rect} from '../primitives/index.js';

class Loading extends Seizure {
	
	constructor(options) {
		options.scrollable = true;
		options.scrollClip = new Rect(1,2,3,4);
		
		super(options);
		this.setBackground('black');
		
		let g = new Subject.Group({
			position: new Point(0, 0),
			parent: this.getWorld().getStage(),
			selfAdd: true
		});
		
		new Subject.DnD({
			size: new Size(3, 3),
			selfAdd: true,
			parent: g,
			image: 'char',
			onClick: ()=>c(1)
		});
		
		const o = new Subject.Sprite({
			position: new Point(4, 0),
			size: new Size(3, 3),
			selfAdd: true,
			parent: g,
			image: 'char',
			onClick: ()=>c('CLICL')
		});
		o.onClickDown = ()=>c('Down');
		o.onClickUp = ()=>c('Up');
		
		this.setHud('Test');
	}
	
}

Manager.addToRegister('Loading', Loading);
