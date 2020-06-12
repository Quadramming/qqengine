export class Storage {
	
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
	
	store(key, value) {
		if ( value !== undefined ) {
			this.set(key, value);
		}
		return this.get(key);
	}
	
}
