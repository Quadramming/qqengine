// QQDOC

export class Storage {
	
	#storage = window.localStorage;
	
	store(key, value) { // {F}
		check(typeof value === 'string', 'Value should be string');
		if ( value !== undefined ) {
			this.set(key, value);
		}
		return this.get(key);
	} // string | null
	
	get(key) {
		return this.#storage.getItem(key);
	} // string | null
	
	set(key, value) { // Set value to key. Use 'null' to remove
		if ( value === null ) {
			this.remove(key);
		} else {
			this.#storage.setItem(key, value);
		}
	} // void
	
	remove(key) {
		this.#storage.removeItem(key);
	} // void
	
}
