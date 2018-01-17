QQ.Style = {
	_map: new Map(),
	
	set(name, obj) {
		let result = {};
		if ( obj.style ) {
			result = QQ.Style.use(result, obj.style);
		}
		this._map.set(name, QQ.merge(result, obj));
	},

	use(...styles) {
		let result = {};
		for ( const style of styles ) {
			if ( Array.isArray(style) ) {
				result = QQ.Style.use(result, ...style);
			} else if ( typeof style === 'string' ) {
				const styleObj = this._map.get(style);
				if ( styleObj ) {
					result = QQ.merge(result, styleObj);
				}
			} else {
				result = QQ.merge(result, style);
			}
		}
		return result;
	}

};
