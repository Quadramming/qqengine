QQ.Subject.Base = class Base {
	
	constructor(options) {
		if ( ! options || ! options.app ) {
			alert('Subject needs app');
		}
		this._app         = options.app;
		this._position    = new QQ.Point(0, 0);
		if ( options.position ) {
			this._position.copy(options.position);
		}
		this._size        = new QQ.Point(1, 1);
		if ( options.size ) {
			this._size.copy(options.size);
		}
		this._angle       = QQ.default(options.angle,       0);
		this._isClickable = QQ.default(options.isClickable, true);
		this._z           = QQ.default(options.z,           0);
		this._world       = QQ.default(options.world,       null);
	}
	
	onClickDown(point) {
	}
	
	onClickUp(point) {
	}
	
	onClick(point) {
		const local = this.worldToLocalPoint(point);
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
	
	worldToLocalPoint(point) {
		let M = QQ.Matrix.getIdentity();
			M = QQ.Matrix.mul(M, QQ.Matrix.getRotate(-this._angle));
			M = QQ.Matrix.mul(M, QQ.Matrix.getMove(this._position));
			M = QQ.Matrix.mul(
				[[point.x(), point.y(), 1]],
				QQ.Matrix.inverse(M)
			);
		return new QQ.Point(M[0][0], M[0][1]);
	}
	
	isHit(point) {
		const local  = this.worldToLocalPoint(point);
		const rect = new QQ.Rect(
			-this._size.w() /2,
			 this._size.h() /2,
			 this._size.w() /2,
			-this._size.h() /2
		);
		return rect.isInside(local);
	}
	
	getBounds() {
		let size  = this._size.w() * this._size.w();
			size += this._size.h() * this._size.h();
			size  = Math.pow(size, 0.5);
		return new QQ.Rect(
			this._position.x() - size,
			this._position.y() + size,
			size*2,
			size*2
		);
	}
	
	getPosition() {
		return this._position;
	}
	
	getAngle() {
		return this._angle;
	}
	
	getScale() {
		// TODO : me
		return { x : 1, y : 1 };
	}
	
	getSize() {
		return this._size;
	}
	
	getZ() {
		return this._z;
	}
	
	setSize(size) {
		this._size.copy(size);
	}
	
	addPosition(offset) {
		this._position.add(offset);
	}
	
	movePosition(offset) {
		this.addPosition(offset);
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
