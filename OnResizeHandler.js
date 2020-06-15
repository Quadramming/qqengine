export class OnResizeHandler {
	
	constructor() {
		this._actions = [];
		this._listnerFn = () => this._onResize();
		window.addEventListener('resize', this._listnerFn);
	}
	
	add(fn) {
		this._actions.push(fn);
	}
	
	destructor() {
		window.removeEventListener('resize', this._listnerFn);
	}
	
	_onResize() {
		for ( const action of this._actions ) {
			action();
		}
	}
	
}
