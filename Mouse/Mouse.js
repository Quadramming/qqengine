QQ.Mouse = class Mouse {
	
	constructor() {
		this._eventPoint = new QQ.Point();
		this._point = new QQ.Point();
		this._m1 = false;
		this._m1DownCb = () => {};
		this._m1UpCb = () => {};
		this._moveCb = () => {};
		
		window.addEventListener('mousemove', this.mousemove.bind(this));
		window.addEventListener('mousedown', this.mousedown.bind(this));
		window.addEventListener('mouseup', this.mouseup.bind(this));
	}
	
	mousemove(e) {
		if ( QQ.isNumbers(e.clientX, e.clientY, e.buttons) ) {
			this._eventPoint.set(e.clientX, e.clientY);
			this._process(this._eventPoint, e.buttons === 1);
		}
		e.preventDefault();
		return false;
	}
	
	mousedown(e) {
		if ( QQ.isNumbers(e.clientX, e.clientY) ) {
			this._eventPoint.set(e.clientX, e.clientY);
			this._process(this._eventPoint, true);
		}
		e.preventDefault();
		return false;
	}
	
	mouseup(e) {
		if ( QQ.isNumbers(e.clientX, e.clientY) ) {
			this._eventPoint.set(e.clientX, e.clientY);
			this._process(this._eventPoint, false);
		}
		e.preventDefault();
		return false;
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
		this._process(point, m);
	}
	
	_process(point, m1) {
		this._point.copy(point);
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
