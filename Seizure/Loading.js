import {Manager} from './Manager.js';
import {Seizure} from './Seizure.js';

class Loading extends Seizure {
	
	constructor(options) {
		super(options);
		this.setBackground('black');
	}
	
}

Manager.addToRegister('Loading', Loading);
