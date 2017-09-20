QQ.Subject.Base = class Base {
	
	constructor(app, options = {}) {
		this._app         = app;
		this._x           = QQ.default(options.x,           0);
		this._y           = QQ.default(options.y,           0);
		this._width       = QQ.default(options.width,       1);
		this._height      = QQ.default(options.height,      1);
		this._angle       = QQ.default(options.angle,       0);
		this._isClickable = QQ.default(options.isClickable, true);
		this._z           = QQ.default(options.z,           0);
		this._world       = QQ.default(options.world,       null);
	}
	
	onClickDown(x, y) {
	}
	
	onClickUp(x, y) {
	}
	
	onClick(x, y) {
		let local = this.worldToLocalPoint(x, y);
		//c(x + ' - ' + y);
		//c(local.x + ' - ' + local.y);
	}
	
	tick(delta) {
	}
	
	draw(ctx) {
		//this._drawLocalBorder(ctx);
	}
	
	isClickable() {
		return this._isClickable;
	}
	
	worldToLocalPoint(x, y) {
		let M = QQ.Matrix.getIdentity();
			M = QQ.Matrix.mul(M, QQ.Matrix.getRotate(-this._angle));
			M = QQ.Matrix.mul(M, QQ.Matrix.getMove(this._x, this._y));
			M = QQ.Matrix.mul(
				[[x, y, 1]],
				QQ.Matrix.inverse( M )
			);
		return {x: M[0][0], y: M[0][1]};
	}
	
	isHit(x, y) {
		let local  = this.worldToLocalPoint(x, y);
		const rect = {
			left:   -this._width  /2,
			top:     this._height /2,
			right:   this._width  /2,
			bottom: -this._height /2
		};
		return QQ.Math.isInside(rect, local.x, local.y);
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
		// TODO : me
		return { x : 1, y : 1 };
	}
	
	getSize() {
		return { width : this._width, height : this._height };
	}
	
	getZ() {
		return this._z;
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
	
	setAngle(a) {
		this._angle = a;
	}
	
	setZ(value) {
		this._z = value;
	}
	
	setWorld(world) {
		this._world = world;
	}
	
	movePosition(x, y) {
		this._x += x;
		this._y += y;
	}
	
	fitInRect(rect) {
		this._width  = rect.right  - rect.left;
		this._height = rect.top    - rect.bottom;
		this._x      = rect.left   + this._width/2;
		this._y      = rect.bottom + this._height/2;
		this._angle  = 0;
	}
	
	_drawWorldBorder(ctx) {
		let M = QQ.Matrix.getIdentity();
			M = QQ.Matrix.mul(M, QQ.Matrix.getRotate(-this._angle));
			M = QQ.Matrix.mul(M, QQ.Matrix.getMove(this._x, this._y));
		ctx.setTransform(
				M[0][0], M[0][1],
				M[1][0], M[1][1],
				M[2][0], M[2][1]
			);
		this._drawLocalBorder(ctx);
	}
	
	_drawLocalBorder(ctx) {
		const scale = this.getScale();
		ctx.beginPath();
		ctx.rect(
			-this._width  / scale.x/2,
			-this._height / scale.y/2,
			 this._width  / scale.x,
			 this._height / scale.y
		);
		ctx.lineWidth   = 1;
		ctx.strokeStyle = '#000000';
		ctx.stroke();
	}
	
};
