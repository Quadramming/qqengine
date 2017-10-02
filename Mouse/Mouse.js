QQ.Mouse = class Mouse {
	
	constructor() {
		
		window.addEventListener('mousemove', (e) => {
			if ( QQ.isNumbers(e.clientX, e.clientY, e.buttons) ) {
				const point = new QQ.Point(e.clientX, e.clientY);
				this._process(point, e.buttons === 1);
			}
		});
	
		window.addEventListener('mousedown', (e) => {
			if ( QQ.isNumbers(e.clientX, e.clientY) ) {
				const point = new QQ.Point(e.clientX, e.clientY);
				this._process(new QQ.Point(e.clientX, e.clientY), true);
			}
		});

		window.addEventListener('mouseup', (e) => {
			if ( QQ.isNumbers(e.clientX, e.clientY) ) {
				const point = new QQ.Point(e.clientX, e.clientY);
				this._process(point, false);
			}
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
		this._process(point, m);
	}
	
	_process(point, m1) {
		this._point = point;
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
