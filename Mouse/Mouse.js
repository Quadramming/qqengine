QQ.Mouse = class Mouse {
	
	constructor() {
		
		window.addEventListener('mousemove', (e) => {
			if ( QQ.isNumbers(e.clientX, e.clientY, e.buttons) ) {
				this._process(event.clientX, event.clientY, e.buttons === 1);
			}
			e.preventDefault();
			return false;
		});
		
		window.addEventListener('mousedown', (e) => {
			if ( QQ.isNumbers(e.clientX, e.clientY) ) {
				this._process(event.clientX, event.clientY, true);
			}
			e.preventDefault();
			return false;
		});
		
		window.addEventListener('mouseup', (e) => {
			if ( QQ.isNumbers(e.clientX, e.clientY) ) {
				this._process(event.clientX, event.clientY, false);
			}
			e.preventDefault();
			return false;
		});
		
		this._point    = new QQ.Point();
		this._m1       = false;
		this._m1DownCb = () => {};
		this._m1UpCb   = () => {};
		this._moveCb   = () => {};
	}
	
	getPoint() {
		return this._point;
	}
	
	getX() {
		return this._point.x();
	}
	
	getY() {
		return this._point.y();
	}
	
	setM1DownCb(f) {
		this._m1DownCb = f;
	}
	
	setM1UpCb(f) {
		this._m1UpCb = f;
	}
	
	setMoveCb(f) {
		this._moveCb = f;
	}
	
	emulate(point, m) {
		this._process(point.x(), point.y(), m);
	}
	
	_process(x, y, m1) {
		this._point.set(x, y);
		if ( m1 === true && this._m1 === false ) {
			this._m1 = true;
			this._m1DownCb();
		} else if ( m1 === false && this._m1 === true ) {
			this._m1 = false;
			this._m1UpCb();
		} else {
			this._moveCb();
		}
	}
	
};
