QQ.Camera = class Camera {
	
	constructor(canvas) {
		this._scroll = {
			isActive: false,
			prevM1:   false
		};
		this._epsilon        = 0;
		this._canvas         = canvas;
		this._ctx            = canvas.getContext('2d');
		this._mainMatrix     = 0;
		this._clip           = new QQ.Rect();
		this._viewSize       = new QQ.Point();
		this._initViewSize   = new QQ.Point();
		this._position       = new QQ.Point();
	}
	
	init(viewSize, position, epsilon = 3) {
		this._viewSize.copy(viewSize);
		this._initViewSize.copy(viewSize);
		this._position.copy(position);
		this._epsilon = this.widthPercent(epsilon);
		this._calcMainMatrix();
		window.addEventListener('resize', () => this._calcMainMatrix());
	}
	
	isScrolling() {
		return this._scroll.isActive;
	}
	
	tickScroll(x, y, m1) {
		/*
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
		*/
	}
	
	getViewSize() {
		return this._viewSize;
	}
	
	getViewRect() {
		return new QQ.Rect(
			this._position.x() - this._viewSize.width()/2,
			this._position.y() + this._viewSize.height()/2,
			this._position.x() + this._viewSize.width()/2,
			this._position.y() - this._viewSize.height()/2
		);
	}
	
	getWorldFromScreen(point) {
		const M = QQ.Matrix.mul(
			[[point.x(), point.y(), 1]],
			QQ.Matrix.inverse(this._mainMatrix)
		);
		return new QQ.Point(M[0][0], M[0][1]);
	}
	
	getLocalPoint(point, subj) {
		const pos   = subj.getPosition();
		const scale = subj.getScale();
		const angle = subj.getAngle();
		const M     = QQ.Matrix.mul(
			[[point.x(), point.y(), 1]],
			QQ.Matrix.inverse( this._getSubjMatrix(pos, scale, angle) )
		);
		return new QQ.Point(M[0][0], M[0][1]);

	}
	
	getPosition() {
		return this._position;
	}
	
	getEpsilon() {
		return this._epsilon;
	}
	
	setClip(rect) {
		this._clip.copy(rect);
	}
	
	setPosition(point) {
		this._position = point;
		this._calcMainMatrix();
	}
	
	setView(size) {
		this._initViewSize = size;
		this._calcMainMatrix();
	}
	
	addPosition(offset) {
		this._position.translate(offset);
		this._calcMainMatrix();
	}
	
	addView(addition) {
		this._viewSize.add(addition);
		this._calcMainMatrix();
	}
	
	cleanTransform() {
		this._setTransform( QQ.Matrix.getIdentity() );
	}
	
	draw(subjects) {
		let count = 0;
		subjects.reverse();
		for ( const subj of subjects ) {
			let pos   = subj.getPosition();
			let scale = subj.getScale();
			let angle = subj.getAngle();
			this._setTransform( this._getSubjMatrix(pos, scale, angle) );
			subj.draw(this._ctx);
			//this.drawRect(subj.getBoundsRect());
			count++;
		}
		//c(count);
		this._drawAxis();
	}
	
	drawRect(rect) {
		const M = this._mainMatrix;
		this._setTransform(M);
		this._ctx.beginPath();
		this._ctx.rect(
			rect.left(),
			rect.top(),
			rect.width(),
			rect.height()
		);
		this._ctx.lineWidth   = 1;
		this._ctx.strokeStyle = '#000000';
		this._ctx.stroke();
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
	
	_getMatrix() {
		let M = QQ.Matrix.getIdentity();
			M = QQ.Matrix.mul(M, QQ.Matrix.getScale(new QQ.Point(1, 1)));
			M = QQ.Matrix.mul(M, QQ.Matrix.getRotate(0));
			M = QQ.Matrix.mul(M, QQ.Matrix.getMove(this._position));
		return M;
	}
	
	_getInverseMatrix() {
		return QQ.Matrix.inverse( this._getMatrix() );
	}
	
	_getScreenMatrix() {
		let M = QQ.Matrix.getIdentity();
			M = QQ.Matrix.mul(M, QQ.Matrix.getRotate(0));
			M = QQ.Matrix.mul(M, QQ.Matrix.getScale(new QQ.Point(
				 this._canvas.width  / this._viewSize.width(),
				-this._canvas.height / this._viewSize.height()
			)));
			M = QQ.Matrix.mul(M, QQ.Matrix.getMove(new QQ.Point(
				this._canvas.width  / 2,
				this._canvas.height / 2
			)));
		return M;
	}
	
	_getSubjMatrix(pos, scale, angle) {
		let M = QQ.Matrix.getIdentity();
			M = QQ.Matrix.mul(M, QQ.Matrix.getScale(new QQ.Point(
				scale.x(), -scale.y()
			)));
			M = QQ.Matrix.mul(M, QQ.Matrix.getRotate(-angle));
			M = QQ.Matrix.mul(M, QQ.Matrix.getMove(pos));
			M = QQ.Matrix.mul(M, this._mainMatrix);
		return M;
	}
	
	_setTransform(M) {
		this._ctx.setTransform(
			M[0][0], M[0][1],
			M[1][0], M[1][1],
			M[2][0], M[2][1]
		);
	}
	
	_fixClip() {
		if ( this._clip !== null ) {
			if ( this._position.x() > this._clip.right() ) {
				this._position.x( this._clip.right() );
			}
			if ( this._position.x() < this._clip.left() ) {
				this._position.x( this._clip.left() );
			}
			if ( this._position.y() > this._clip.top() ) {
				this._position.y( this._clip.top() );
			}
			if ( this._position.y() < this._clip.bottom() ) {
				this._position.y( this._clip.bottom() );
			}
		}
	}
	
	_calcMainMatrix() {
		const canvasRatio = (this._canvas.width / this._canvas.height);
		const cameraRatio = this._initViewSize.getRatio();
		if ( canvasRatio !== cameraRatio ) {
			this._viewSize = QQ.Math.increaseToRatio(
				this._initViewSize,
				canvasRatio
			);
		}
		this._fixClip();
		this._mainMatrix = QQ.Matrix.mul(
			this._getInverseMatrix(),
			this._getScreenMatrix()
		);
	}
	
	_drawAxis() {
		const ctx = this._ctx;
		const M   = this._mainMatrix;
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
		this._ctx.fillStyle = 'gray';
		this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
	}
	
};
