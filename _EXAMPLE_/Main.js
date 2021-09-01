import * as Text from '../Text/index.js';
import {T} from '../i18n.js';
import {Size} from '../primitives/index.js';
import {Manager} from '../Seizure/Manager.js';
import {Seizure} from '../Seizure/Seizure.js';

class Main extends Seizure {
	
	constructor(options) {
		super(options);
		
		this.setBackground('#FFEBCD');
		this.setCamera(new Size(5, 5));
		this.addSubject(new Text.Styled(l(T`Hello`,T`How are you?`)));
	}
	
}

Manager.registerSeizure('Main', Main);
