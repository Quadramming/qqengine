// QQDOC

import {Manager} from './Manager.js';
import {Seizure} from './Seizure.js';

class Loading extends Seizure {
	
	constructor(options) {
		super(options);
		this.setBackground('#000000');
	}
	
}

Manager.registerSeizure('Loading', Loading);
