QQ.Camera = class Camera {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(canvas, world) {
		this._scroll = {
			isActive: false,
			prevM1:   false
		};
		this._epsilon        = 0;
		this._canvas         = canvas;
		this._ctx            = canvas.getContext('2d');
		this._mainMatrix     = 0;
		this._clip           = null;
		this._viewSize       = new QQ.Size();
		this._initViewSize   = new QQ.Size();
		this._position       = new QQ.Point();
		this._world          = world;
	}
	
	init(viewSize, position, epsilon = 3) {
		this._viewSize.copy(viewSize);
		this._initViewSize.copy(viewSize);
		this._position.copy(position);
		this._epsilon = this.widthPercent(epsilon);
		this._calcMainMatrix();
		window.addEventListener('resize', () => this._calcMainMatrix());
	}
	
	//================================================================
	// Scroll
	//================================================================
	
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
	
	//================================================================
	// Percents
	//================================================================
	
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
	
	//================================================================
	// Getters/Setters
	//================================================================
	
	getViewSize() {
		return this._viewSize;
	}
	
	getViewRect() {
		return new QQ.Rect(
			this._position.x() - this._viewSize.w()/2,
			this._position.y() - this._viewSize.h()/2,
			this._viewSize.w(),
			this._viewSize.h()
		);
	}
	
	getPosition() {
		return this._position;
	}
	
	getEpsilon() {
		return this._epsilon;
	}
	
	addPosition(offset) {
		this._position.translate(offset);
		this._calcMainMatrix();
	}
	
	addView(addition) {
		this._viewSize.add(addition);
		this._calcMainMatrix();
	}
	
	setPosition(point) {
		this._position = point;
		this._calcMainMatrix();
	}
	
	setClip(rect) {
		this._clip.copy(rect);
		this._calcMainMatrix();
	}
	
	setView(size) {
		this._initViewSize = size;
		this._calcMainMatrix();
	}
	
	//================================================================
	// Common
	//================================================================
	
	getWorldFromScreen(point) {
		const M = QQ.Matrix.mul(
			QQ.Matrix.inverse(this._mainMatrix),
			[[point.x()],[point.y()],[1]]
		);
		return new QQ.Point(M[0][0], M[1][0]);
	}
	
	draw() {
		const ctxObj = {
			get: () => this._ctx,
			transform: this._setTransform.bind(this)
		};
		const bg = this._world.getBackground();
		if ( bg ) {
			bg.fitInRect(this.getViewRect());
			bg.draw(ctxObj);
		}	
		this._world.getStage().draw(ctxObj);
		//this.drawRect(subj.getBounds());
		this._drawAxis();
	}
	
	tick() {
	}
	
	drawRect(rect) {
		QQ.setTransform(this._ctx, this._mainMatrix);
		this._ctx.beginPath();
		this._ctx.rect(
			rect.x(),
			rect.y(),
			rect.width(),
			rect.height()
		);
		this._ctx.lineWidth   = 1;
		this._ctx.strokeStyle = '#000000';
		this._ctx.stroke();
	}
	
	cleanTransform() {
		QQ.setTransform(this._ctx, QQ.Matrix.getIdentity());
	}
	
	//================================================================
	// Private
	//================================================================
	
	_getInverseCameraMatrix() {
		return QQ.Matrix.getMove(this._position.cloneOposite());
	}
	
	_getScreenMatrix() {
		let M = QQ.Matrix.getScale(new QQ.Scale(
				this._canvas.width  / this._viewSize.width(),
				this._canvas.height / this._viewSize.height()
			));
			M = QQ.Matrix.mul(QQ.Matrix.getMove(new QQ.Point(
				this._canvas.width  / 2,
				this._canvas.height / 2
			)), M);
		return M;
	}
	
	_setTransform(matrix) {
		const M = QQ.Matrix.mul(this._mainMatrix, matrix);
		QQ.setTransform(this._ctx, M);
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
			this._getScreenMatrix(),
			this._getInverseCameraMatrix()
		);
	}
	
	_drawAxis() {
		const ctx = this._ctx;
		QQ.setTransform(ctx, this._mainMatrix);
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
