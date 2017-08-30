QQ.Camera = class Camera {
	
	constructor(canvas) {
		this._scroll = {
			isActive: false,
			prevM1:   false
		};
		this._epsilon        = 0;
		this._canvas         = canvas;
		this._width          = 0;
		this._height         = 0;
		this._initWidth      = 0;
		this._initHeight     = 0;
		this._x              = 0;
		this._y              = 0;
		this._mainMatrix     = 0;
		this._clip           = null;
	}
	
	init(width = 1, height = 1, x = 0, y = 0, epsilon = 3) {
		this._initWidth      = width;
		this._initHeight     = height;
		this._width          = width;
		this._height         = height;
		this._x              = x;
		this._y              = y;
		this._epsilon        = this.widthPercent(epsilon);
		this._calcMainMatrix();
		window.addEventListener('resize', () => this._calcMainMatrix());
	}
	
	isScrolling() {
		return this._scroll.isActive;
	}
	
	tickScroll(x, y, m1) {
		let scroll = this._scroll;
		if ( x >= 0 && y >= 0 ) {
			if ( ! scroll.prevM1 && m1 ) {
				scroll.prevM1   = m1;
				scroll.isActive = false;
				scroll.initX   = x;
				scroll.initY   = y;
				return;
			}
			if ( scroll.prevM1 && ! m1 ) {
				scroll.prevM1   = m1;
				scroll.isActive = false;
				return;
			}
			let isClose = this._isPositionsClose(
				{ x: x,            y: y            },
				{ x: scroll.initX, y: scroll.initY }
			);
			if ( m1 && ! scroll.isActive && ! isClose ) {
				let position    = this.getWorldPoint(x, y);
				scroll.isActive = true;
				({x: scroll.scrollX, y: scroll.scrollY} = position);
			}
			if ( scroll.isActive ) {
				let position = this.getWorldPoint(x, y);
				this.addPos(
						scroll.scrollX - position.x,
						scroll.scrollY - position.y
					);
				let newPosition = this.getWorldPoint(x, y);
				({x: scroll.scrollX, y: scroll.scrollY} = newPosition);
			}
		} else {
			scroll.prevM1   = false;
			scroll.isActive = false;
		}
	}
	
	getView() {
		return {
			width:  this._width,
			height: this._height
		};
	}
	
	getViewRect() {
		return {
			left:   this._x - this._width/2,
			top:    this._y + this._height/2,
			right:  this._x + this._width/2,
			bottom: this._y - this._height/2
		};
	}
	
	getWorldPoint(x, y) {
		let M = QQ.Matrix.mul(
			[[x, y, 1]],
			QQ.Matrix.inverse(this._mainMatrix)
		);
		return { x: M[0][0], y: M[0][1] };
	}
	
	getLocalPoint(x, y, subj) {
		let pos   = subj.getPosition();
		let scale = subj.getScale();
		let angle = subj.getAngle();
		let M = QQ.Matrix.mul(
			[[x, y, 1]],
			QQ.Matrix.inverse( this._getSubjMatrix(pos, scale, angle) )
		);
		return { x: M[0][0], y: M[0][1] };
	}
	
	getPosition() {
		return {
			x: this._x,
			y: this._y
		};
	}
	
	getEpsilon() {
		return this._epsilon;
	}
	
	setClip(left, right, top, bottom) {
		this._clip = { left, right, top, bottom };
	}
	
	setPos(x, y) {
		this._x = x;
		this._y = y;
		this._calcMainMatrix();
	}
	
	setView(w, h) {
		this._initWidth  = w;
		this._initHeight = h;
		this._calcMainMatrix();
	}
	
	addPos(x, y) {
		this._x += x;
		this._y += y;
		this._calcMainMatrix();
	}
	
	addView(w, h) {
		this._initWidth  += w;
		this._initHeight += h;
		this._calcMainMatrix();
	}
	
	cleanTransform() {
		this._setTransform( QQ.Matrix.getIdentity() );
	}
	
	draw(subjects, type) {
		let count = 0;
		let copy = subjects.slice();
		subjects = copy.sort((a, b) => {
			if ( a.getZ() === b.getZ() ) {
				return subjects.indexOf(a) - subjects.indexOf(b);
			}
			return a.getZ() - b.getZ();
		});
		for ( let subj of subjects ) {
			let pos   = subj.getPosition();
			let scale = subj.getScale();
			let angle = subj.getAngle();
			this._setTransform( this._getSubjMatrix(pos, scale, angle) );
			subj.draw();
			//this.drawRect(subj.getBoundsRect());
			count++;
		}
		//c(count);
		//this._drawAxis();
	}
	
	drawRect(rect) {
		let M   = this._mainMatrix;
		let ctx = this._canvas.getContext('2d');
		this._setTransform(M);
		ctx.beginPath();
		ctx.rect(
			rect.left,
			rect.top,
			rect.right - rect.left,
			rect.bottom - rect.top
		);
		ctx.lineWidth   = 1;
		ctx.strokeStyle = '#000000';
		ctx.stroke();
	}
	
	widthToPercent(x) {
		return x / (this._canvas.width/100);
	}
	
	heightToPercent(y) {
		return y / (this._canvas.height/100);
	}
	
	widthPercent(x) {
		return this._canvas.width*x / 100;
	}
	
	heightPercent(y) {
		return this._canvas.height*y / 100;
	}
	
	_isPositionsClose(first, second) {
		return  Math.abs(first.x - second.x) < this._epsilon &&
				Math.abs(first.y - second.y) < this._epsilon;
	}
	
	_getMatrix() {
		let M = QQ.Matrix.getIdentity();
			M = QQ.Matrix.mul(M, QQ.Matrix.getScale(1, 1));
			M = QQ.Matrix.mul(M, QQ.Matrix.getRotate(0));
			M = QQ.Matrix.mul(M, QQ.Matrix.getMove(this._x, this._y));
		return M;
	}
	
	_getInverseMatrix() {
		return QQ.Matrix.inverse( this._getMatrix() );
	}
	
	_getScreenMatrix() {
		let M = QQ.Matrix.getIdentity();
			M = QQ.Matrix.mul(M, QQ.Matrix.getRotate(0));
			M = QQ.Matrix.mul(M, QQ.Matrix.getScale(
					 this._canvas.width  / this._width,
					-this._canvas.height / this._height
				));
			M = QQ.Matrix.mul(M, QQ.Matrix.getMove(
					this._canvas.width  / 2,
					this._canvas.height / 2
				));
		return M;
	}
	
	_getSubjMatrix(pos, scale, angle) {
		let M      = QQ.Matrix.getIdentity();
			M      = QQ.Matrix.mul(M, QQ.Matrix.getScale(scale.x, -scale.y));
			M      = QQ.Matrix.mul(M, QQ.Matrix.getRotate(-angle));
			M      = QQ.Matrix.mul(M, QQ.Matrix.getMove(pos.x, pos.y));
			M      = QQ.Matrix.mul(M, this._mainMatrix);
		return M;
	}
	
	_setTransform(M) {
		this._canvas.getContext('2d').setTransform(
				M[0][0], M[0][1],
				M[1][0], M[1][1],
				M[2][0], M[2][1]
			);
	}
	
	_fixClip() {
		if ( this._clip !== null ) {
			if ( this._x > this._clip.right  ) { this._x = this._clip.right;  };
			if ( this._x < this._clip.left   ) { this._x = this._clip.left;   };
			if ( this._y > this._clip.top    ) { this._y = this._clip.top;    };
			if ( this._y < this._clip.bottom ) { this._y = this._clip.bottom; };
		}
	}
	
	_calcMainMatrix() {
		const canvasRatio = (this._canvas.width / this._canvas.height);
		const cameraRatio = (this._initWidth    / this._initHeight);
		if ( canvasRatio !== cameraRatio ) {
			({x: this._width, y: this._height} = 
					QQ.Math.increaseToRatio(
						this._initWidth,
						this._initHeight,
						canvasRatio
					));
		}
		this._fixClip();
		this._mainMatrix = QQ.Matrix.mul(
			this._getInverseMatrix(),
			this._getScreenMatrix()
		);
	}
	
	_drawAxis() {
		let M   = this._mainMatrix;
		let ctx = this._canvas.getContext('2d');
		this._setTransform(M);
		for ( let i = -10; i <= 10; i++ ) {
			ctx.beginPath();
			ctx.moveTo(-10, i);
			ctx.lineTo( 10, i);
			ctx.lineWidth   = 0.1;
			ctx.strokeStyle = '#00ff00';
			ctx.stroke();
		}
		for ( let i = -10; i <= 10; i++ ) {
			ctx.beginPath();
			ctx.moveTo(i, -10);
			ctx.lineTo(i,  10);
			ctx.lineWidth   = 0.1;
			ctx.strokeStyle = '#00ff00';
			ctx.stroke();
		}
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(-0.1, -0.1, 0.2, 0.2);
		ctx.fillStyle = "#0000FF";
		ctx.fillRect(10, 10, 0.2, 0.2);
	}
	
	_cleanCanvas() {
		this.cleanTransform();
		let ctx       = this._canvas.getContext('2d');
		ctx.fillStyle = 'gray';
		ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
	}
	
};
