// QQDOC

import * as QQ from '../QQ.js';
import * as style from '../style/index.js';
import {ActionableMix} from '../Subject/ActionableMix.js';
import {Text} from './Text.js';

export class StyledActionableText extends
	QQ.mixins(ActionableMix, Text)
{
	
	constructor(text, ...styles) {
		super( style.use(styles, {text}) );
	}
	
	reset(text, ...styles) { // {O}
		super.reset( style.use(styles, {text}) );
	} // void
	
}
