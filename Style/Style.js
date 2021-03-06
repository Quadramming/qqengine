//QQDOC

import * as QQ from '../QQ.js';

const map = new Map();

function merge(...objs) {
	const result = QQ.merge(...objs);
	delete result.styles;
	return result;
} // Object

function apply(...styles) {
	let result = {
		usedStyles: []
	};
	for ( const style of styles ) {
		if ( style === undefined ) {
			// Nothing
		} else if ( Array.isArray(style) ) {
			result = apply(result, ...style);
		} else if ( typeof style === 'string' ) {
			if ( style.includes(' ') ) {
				result = apply(result, style.split(' '));
			} else {
				if ( ! result.usedStyles.includes(style) ) {
					result.usedStyles.push(style);
					result = apply(result, map.get(style));
				}
			}
		} else if ( typeof style === 'object' ) {
			if ( style.styles ) {
				result = apply(result, style.styles);
			}
			result = merge(result, style);
		}
	}
	return result;
} // Object

export function set(name, obj) {
	map.set(name, obj);
} // void

export function use(...styles) {
	const result = apply('default', styles);
	delete result.usedStyles;
	return result;
} // Object
