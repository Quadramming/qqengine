// QQDOC

import * as QQ from '../QQ.js';
import * as style from './style.js';

function add(out, text) {
	text = text.trim();
	text = text.split(' ');
	for ( const name of text ) {
		if ( name ) out.push(name);
	}
} // void

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
} // Object
