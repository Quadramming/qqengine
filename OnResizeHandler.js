export class OnResizeHandler {
	
	#actions = [];
	#listnerFn = () => this.#onResize();
	
	constructor() {
		window.addEventListener('resize', this.#listnerFn);
	}
	
	destructor() {
		window.removeEventListener('resize', this.#listnerFn);
	}
	
	add(fn) {
		this.#actions.push(fn);
	}
	
	remove(fn) {
		const index = this.#actions.indexOf(fn);
		if ( index >= 0 ) {
			this.#actions.splice(index, 1);
		}
	}
	
	#onResize() {
		for ( const action of this.#actions ) {
			action();
		}
	}
	
}
