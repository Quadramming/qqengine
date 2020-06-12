import {Text} from './Text.js';
import {Style} from '../Style/Style.js';

export class Styled extends Text {
	
	constructor(text, ...styles) {
		super( Style.use(styles, {text}) );
	}
	
}
