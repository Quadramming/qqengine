QQ.Touch = class Touch {
	
	constructor(mouse) {
		this._point = new QQ.Point();
		this._mouse = mouse;
		const options = {
			capture: true,
			passive: false
		};
		window.addEventListener('touchstart', this.touchstart.bind(this), options);
		window.addEventListener('touchmove', this.touchmove.bind(this), options);
		window.addEventListener('touchend', this.touchend.bind(this), options);
	}
	
	touchstart(e) {
		const touchobj = e.touches[0];
		if ( QQ.isNumbers(touchobj.clientX, touchobj.clientY) ) {
			this._point.set(touchobj.clientX, touchobj.clientY);
			this._mouse.emulate(this._point, true);
		}
		e.preventDefault();
		return false;
	}
	
	touchmove(e) {
		const touchobj = e.touches[0];
		if ( QQ.isNumbers(touchobj.clientX, touchobj.clientY) ) {
			this._point.set(touchobj.clientX, touchobj.clientY);
			this._mouse.emulate(this._point, true);
		}
		e.preventDefault();
		return false;
	}
	
	touchend(e) {
		this._point.set(NaN);
		this._mouse.emulate(this._point, false);
		e.preventDefault();
		return false;
	}
	
};
