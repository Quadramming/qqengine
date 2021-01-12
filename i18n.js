// QQDOC

import {dictionary as dictionary_RU} from '../language/RU.js';

const language = 'RU';

let dictionary = null;
if ( language === 'EN' ) {
	// Nothing
} else if ( language === 'RU' ) {
	dictionary = dictionary_RU;
} else {
	throw Error('Wrong language');
}

export function T(strs, ...substs) {
	let text = strs[0];
	for ( const index of substs.keys() ) {
		text += '$v' + strs[index+1];
	}
	text = dictionary?.get(text) ?? text;
	for ( const v of substs ) {
		text = text.replace('$v', v); // Replace first
	}
	return text;
} // string
