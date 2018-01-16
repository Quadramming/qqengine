QQ.Style = {
	_map: new Map(),
	
	set(name, obj) {
		let result = {};
		if ( obj.style ) {
			result = QQ.Style.use(result, obj.style);
		}
		this._map.set(name, QQ.merge(result, obj));
	},

	use(obj, ...styles) {
		let result = QQ.clone(obj);
		for ( const style of styles ) {
			if ( Array.isArray(style) ) {
				result = QQ.Style.use(result, ...style);
			} else {
				const styleObj = this._map.get(style);
				if ( styleObj ) {
					result = QQ.merge(result, styleObj);
				}
			}
		}
		return result;
	}

};
