import * as QQ from '../QQ.js';

const map = new Map();

function merge(...objs) {
	const result = QQ.merge(...objs);
	delete result.styles;
	return result;
}

function apply(...styles) {
	let result = {
		_usedStyles: []
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
				if ( ! result._usedStyles.includes(style) ) {
					result._usedStyles.push(style);
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
}

export function set(name, obj) {
	map.set(name, obj);
}

export function use(...styles) {
	const result = apply('default', styles);
	delete result._usedStyles;
	return result;
}

