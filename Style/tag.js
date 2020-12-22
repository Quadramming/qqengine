import * as style from './style.js';
import {styles} from '../../styles/styles.js';

for ( const [name, styleObj] of Object.entries(styles) ) {
	style.set(name, styleObj);
}

function add(out, text) {
	text = text.trim();
	text = text.split(' ');
	for ( const name of text ) {
		if ( name ) {
			out.push(name);
		}
	}
}

export function S(strs, ...substs) {
	const out = [];
	add(out, strs[0]);
	for ( const [i, subst] of substs.entries() ) {
		if ( typeof(subst) === 'string' ) {
			add(out, subst);
		} else {
			out.push(subst);
		}
		add(out, strs[i+1]);
	}
	return style.use(...out);
}
