//REFACTOR

QQ.Subject = class Subject {
	
	constructor(imgSrc = null, width = 1, height = 1) {
		this._x           = 0;
		this._y           = 0;
		this._width       = width;
		this._height      = height;
		this._angle       = 0;
		this._ctx         = QQ.application.getContext();
		this._physicsBody = null;
		this._sprite      = imgSrc ?
			new QQ.Sprite( QQ.imgManager.get(imgSrc) ) :
			null;
	}
	
	setSpriteAnimation(...args) {
		this._sprite.setAnimation(...args);
	}
	
	setSize(width, height) {
		this._width  = width;
		this._height = height;
	}
	
	draw() {
		if ( this._sprite ) {
			this._sprite.draw();
		}
		//this.drawBorder();
	}
	
	drawBorder() {
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
	
	fitInRect(rect) {
		this._width  = rect.right  - rect.left;
		this._height = rect.top    - rect.bottom;
		this._x      = rect.left   + this._width/2;
		this._y      = rect.bottom + this._height/2;
	}
	
	getPosition() {
		return { x: this._x, y: this._y };
	}
	
	getAngle() {
		return this._angle;
	}
	
	type() {
		return 'subject';
	}
	
	setPhysics(x, y, w, h, options) {
		this._physicsBody = Matter.Bodies.rectangle(x, y, w, h, options);
	}
	
	setDefaultPhysics(options) {
		this._physicsBody = Matter.Bodies.rectangle(
			this._x,     this._y,
			this._width, this._height,
			options
		);
	}
	
	getPhysicsBody() {
		return this._physicsBody;
	}
	
	isPhysicsBody() {
		return this._physicsBody !== null;
	}
	
	click() {
	}
	
	tick(delta) {
		this._physicsTick(delta);
	}
	
	setAlpha(a) {
		if ( this._sprite ) {
			this._sprite.setAlpha(a);
		} else {
			// TODO
		}
	}
	
	getScale() {
		let scaleX = 1;
		let scaleY = 1;
		if ( this._sprite ) {
			let size = this._sprite.getSize();
			scaleX   = this._width  / size.width;
			scaleY   = this._height / size.height;
		}
		return { x : scaleX, y : scaleY };
	}
	
	isClickable() {
		return true;
	}
	
	setPosition(x, y, p) {
		if ( x !== undefined ) {
			this._x = p ? QQ.Math.calcPivotX(p, x, this._width) : x;
		}
		if ( y !== undefined ) {
			this._y = p ? QQ.Math.calcPivotY(p, y, this._height) : y;
		}
	}
	
	_physicsTick(delta) {
		if ( this.isPhysicsBody() ) {
			this.setPosition(this._physicsBody.position.x, this._physicsBody.position.y);
			this._angle = this._physicsBody.angle;
		}
	}
	
};
