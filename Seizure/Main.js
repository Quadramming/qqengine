import * as QQ from '../QQ.js';
import * as Text from '../Text/index.js';
import * as Subject from '../Subject/index.js';
import * as Actions from '../Actions/index.js';
import * as GUI from '../GUI/index.js';
import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Rect} from '../Rect.js';
import {Manager} from './Manager.js';
import {Seizure} from './Seizure.js';

class Main extends Seizure {
	
	constructor(options) {
		super(options);
		this.setBackground('white');
		
		let bar = new GUI.CheckBox({
			image: 'checkBoxChecked'
		});
		this.addSubject(bar);
	}
	
}

Manager.addToRegister('Main', Main);
