import * as QQ from '../QQ.js';
import {ActionableMix} from '../Subject/ActionableMix.js';
import {Style} from '../Style/Style.js';
import {Text} from './Text.js';

export class StyledActionableText extends
	QQ.mixins(ActionableMix, Text)
{
	
	constructor(text, ...styles) {
		super( Style.use(styles, {text}) );
	}
	
}
