QQ.Storage = class Storage {
	
	constructor() {
		this._storage    = window.localStorage;
	}
	
	storage(key, value) {
		if ( value ) {
			this._storage.setItem(key, value);
		} else {
			return this._storage.getItem(key);
		}
	}
	
};
