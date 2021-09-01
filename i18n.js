// QQDOC

let dictionary = null;

export function set(value) {
	dictionary = value;
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
