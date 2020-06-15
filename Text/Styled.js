import * as style from '../style/index.js';
import {Text} from './Text.js';

export class Styled extends Text {
	
	constructor(text, ...styles) {
		super( style.use(styles, {text}) );
	}
	
}
