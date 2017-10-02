QQ.Storage = class Storage {
	
	constructor() {
		this._storage = window.localStorage;
	}
	
	remove(key) {
		this._storage.removeItem(key);
	}
	
	set(key, value) {
		if ( value === null ) {
			this.remove(key);
		} else {
			this._storage.setItem(key, value);
		}
	}
	
	get(key) {
		return this._storage.getItem(key);
	}
	
};
