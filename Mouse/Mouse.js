QQ.Mouse = class Mouse {
	
	constructor() {
		
		window.addEventListener('mousemove', (e) => {
			if ( QQ.Math.isNumbers(e.clientX, e.clientY, e.buttons) ) {
				this._process(e.clientX, e.clientY, e.buttons === 1);
			}
		});
	
		window.addEventListener('mousedown', (e) => {
			if ( QQ.Math.isNumbers(e.clientX, e.clientY) ) {
				this._process(e.clientX, e.clientY, true);
			}
		});

		window.addEventListener('mouseup', (e) => {
			if ( QQ.Math.isNumbers(e.clientX, e.clientY) ) {
				this._process(e.clientX, e.clientY, false);
			}
		});
		
		this._x        = 0;
		this._y        = 0;
		this._m1       = false;
		this._m1DownCB = null;
		this._m1UpCB   = null;
	}
	
	getX() {
		return this._x;
	}
	
	getY() {
		return this._y;
	}
	
	getM1() {
		return this._m1;
	}
	
	setM1DownCB(f) {
		this._m1DownCB = f;
	}
	
	setM1UpCB(f) {
		this._m1UpCB = f;
	}
	
	emulate(x, y, m) {
		this._process(x, y, m); 
	}
	
	_process(newX, newY, newM1) {
		this._x = newX;
		this._y = newY;	
		if ( newM1 === true && this._m1 === false ) {
			this._m1 = true;
			if ( this._m1DownCB ) {
				this._m1DownCB();
			}
		}
		if ( newM1 === false && this._m1 === true ) {
			this._m1 = false;
			if ( this._m1UpCB ) {
				this._m1UpCB();
			}
		}
	}
	
};
