import {dictionary as dictionary_RU} from '../../language/RU.js';

const language = 'RU';

let dictionary = null;
if ( language === 'EN' ) {
	// Nothing
} else if ( language === 'RU' ) {
	dictionary = dictionary_RU;
} else {
	throw new Error('Wrong language');
}

export function T(strs, ...substs) {
	let text = strs[0];
	for ( const [i] of substs.entries() ) {
		text += '%v' + strs[i+1];
	}
	if ( dictionary !== null ) {
		text = dictionary[text] || text;
	}
	for ( const v of substs ) {
		text = text.replace('%v', v);
	}
	return text;
}
