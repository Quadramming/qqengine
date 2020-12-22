// QQDOC

export class Storage {
	
	#storage; // window.localStorage
	
	constructor() {
		this.#storage = window.localStorage;
	}
	
	remove(key) {
		this.#storage.removeItem(key);
	} // void
	
	set(key, value) {
		if ( value === null ) {
			this.remove(key);
		} else {
			this.#storage.setItem(key, value);
		}
	} // void
	
	get(key) {
		return this.#storage.getItem(key);
	} // string | null
	
	store(key, value) { // {F}
		if ( value !== undefined ) {
			this.set(key, value);
		}
		return this.get(key);
	} // string | null
	
}
