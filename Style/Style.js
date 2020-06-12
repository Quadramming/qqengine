import * as QQ from '../QQ.js';

const map = new Map();

function merge(...objs) {
	const result = QQ.merge(...objs);
	delete result.styles;
	return result;
}

export class Style {
	
	static set(name, obj) {
		map.set(name, obj);
	}
	
	static use(...styles) {
		const result = this._use('default', styles);
		delete result._usedStyles;
		return result;
	}
	
	static _use(...styles) {
		let result = {
			_usedStyles: []
		};
		for ( const style of styles ) {
			if ( style === undefined ) {
				// Nothing
			} else if ( Array.isArray(style) ) {
				result = this._use(result, ...style);
			} else if ( typeof style === 'string' ) {
				if ( style.includes(' ') ) {
					result = this._use(result, style.split(' '));
				} else {
					if ( ! result._usedStyles.includes(style) ) {
						result._usedStyles.push(style);
						result = this._use(result, map.get(style));
					}
				}
			} else if ( typeof style === 'object' ) {
				if ( style.styles ) {
					result = this._use(result, style.styles);
				}
				result = merge(result, style);
			}
		}
		return result;
	}
	
}
