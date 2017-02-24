QQ.SubjectBase = class SubjectBase {
	
	constructor(width = 1, height = 1) {
		this._ctx         = QQ.application.getContext();
		this._x           = 0;
		this._y           = 0;
		this._width       = width;
		this._height      = height;
		this._angle       = 0;
	}
	
	type() {
		return 'subject';
	}
	
	click() {
	}
	
	tick(delta) {
	}
	
	draw() {
		//this._drawBorder();
	}
	
	isClickable() {
		return true;
	}
	
	isHit(x, y) {
		let M = QQ.Matrix.getIdentity();
			M = QQ.Matrix.mul(M, QQ.Matrix.getRotate(-this._angle));
			M = QQ.Matrix.mul(M, QQ.Matrix.getMove(this._x, this._y));
			M = QQ.Matrix.mul(
				[[x, y, 1]],
				QQ.Matrix.inverse( M )
			);
		const rect  = { 
			left:   -this._width  /2,
			top:     this._height /2,
			right:   this._width  /2,
			bottom: -this._height /2
		};
		return QQ.Math.isInside(rect, M[0][0], M[0][1]);
	}
	
	getBoundsRect() {
		let size  = this._width  * this._width;
			size += this._height * this._height;
			size  = Math.pow(size, 0.5) / 2;
		return {
			left:   this._x - size,
			top:    this._y + size,
			right:  this._x + size,
			bottom: this._y - size
		};
	}
	
	getPosition() {
		return { x: this._x, y: this._y };
	}
	
	getAngle() {
		return this._angle;
	}
	
	getScale() {
		return { x : 1, y : 1 };
	}
	
	setSize(width, height) {
		this._width  = width;
		this._height = height;
	}
	
	setPosition(x, y, p) {
		if ( x !== undefined ) {
			this._x = p ? QQ.Math.calcPivotX(p, x, this._width) : x;
		}
		if ( y !== undefined ) {
			this._y = p ? QQ.Math.calcPivotY(p, y, this._height) : y;
		}
	}
	
	fitInRect(rect) {
		this._width  = rect.right  - rect.left;
		this._height = rect.top    - rect.bottom;
		this._x      = rect.left   + this._width/2;
		this._y      = rect.bottom + this._height/2;
		this._angle  = 0;
	}
	
	_drawBorder() {
		const scale = this.getScale();
		this._ctx.beginPath();
		this._ctx.rect(
			-this._width  / scale.x/2,
			-this._height / scale.y/2,
			 this._width  / scale.x,
			 this._height / scale.y
		);
		this._ctx.lineWidth   = 1;
		this._ctx.strokeStyle = '#000000';
		this._ctx.stroke();
	}
	
};
