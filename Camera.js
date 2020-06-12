import * as QQ from './QQ.js';
import * as Matrix from './matrix.js';
import * as Maths from './maths.js';
import * as Subject from './Subject/index.js';
import {Point} from './Point.js';
import {Size} from './Size.js';
import {Rect} from './Rect.js';
import {Scale} from './Scale.js';

export class Camera {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(canvas, world) {
		this._canvas = canvas;
		this._world = world;
		this._mainMatrix = 0;
		this._clip = null;
		this._viewSize = new Size();
		this._initViewSize = new Size();
		this._position = new Point();
		this._ctx = canvas.getContext('2d');
	}
	
	init(viewSize, position) {
		this._viewSize.copy(viewSize);
		this._initViewSize.copy(viewSize);
		this._position.copy(position);
		this._calcMainMatrix();
		this._onResize = this._calcMainMatrix.bind(this);
		window.addEventListener('resize', this._onResize);
	}
	
	release() {
		this._world = null;
		window.removeEventListener('resize', this._onResize);
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
	
	widthPercentsToPx(x) {
		return this._canvas.width*x / 100;
	}
	
	heightPercentsToPx(y) {
		return this._canvas.height*y / 100;
	}
	
	//================================================================
	// Getters/Setters
	//================================================================
	
	getViewSize() {
		return this._viewSize;
	}
	
	getViewRect() {
		return new Rect(
			this._position.x() - this._viewSize.w()/2,
			this._position.y() - this._viewSize.h()/2,
			this._viewSize.w(),
			this._viewSize.h()
		);
	}
	
	getPosition() {
		return this._position;
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
		const world = point.clone();
		this.convertToWorldFromScreen(world);
		return world;
	}
	
	convertToWorldFromScreen(point) {
		const M = Matrix.mul(
			Matrix.inverse(this._mainMatrix),
			[[point.x()],[point.y()],[1]]
		);
		point.set(M[0][0], M[1][0]);
	}
	
	draw() {
		const ctxObj = {
			get: () => this._ctx,
			transform: this.setTransform.bind(this)
		};
		const bg = this._world.getBackground();
		if ( bg && typeof bg === 'string' ) {
			this._cleanCanvas(bg);
		} else if ( bg && bg instanceof Subject.Subject ) {
			bg.fitInRect(this.getViewRect());
			bg.draw(ctxObj);
		}
		this._world.getStage().draw(ctxObj);
		//this.drawRect(subj.getBounds());
		//this._drawAxis();
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
		this._ctx.lineWidth = 1;
		this._ctx.strokeStyle = '#000000';
		this._ctx.stroke();
	}
	
	cleanTransform(ctx = this._ctx) {
		QQ.setTransform(ctx, Matrix.getIdentity());
	}
	
	setTransform(matrix, ctx = this._ctx) {
		const M = Matrix.mul(this._mainMatrix, matrix);
		QQ.setTransform(ctx, M);
	}
	
	//================================================================
	// Private
	//================================================================
	
	_getInverseCameraMatrix() {
		return Matrix.getMove(this._position.cloneOposite());
	}
	
	_getScreenMatrix() {
		let M = Matrix.getScale(new Scale(
				this._canvas.width / this._viewSize.width(),
				this._canvas.height / this._viewSize.height()
			));
			M = Matrix.mul(Matrix.getMove(new Point(
				this._canvas.width / 2,
				this._canvas.height / 2
			)), M);
		return M;
	}
	
	_fixClip() {
		if ( this._clip !== null ) {
			if ( this._position.x() > this._clip.right() ) {
				this._position.x( this._clip.right() );
			}
			if ( this._position.x() < this._clip.left() ) {
				this._position.x( this._clip.left() );
			}
			if ( this._position.y() < this._clip.top() ) {
				this._position.y( this._clip.top() );
			}
			if ( this._position.y() > this._clip.bottom() ) {
				this._position.y( this._clip.bottom() );
			}
		}
	}
	
	_calcMainMatrix() {
		const canvasRatio = (this._canvas.width / this._canvas.height);
		const cameraRatio = this._initViewSize.getRatio();
		if ( canvasRatio !== cameraRatio ) {
			this._viewSize = Maths.increaseToRatio(
				this._initViewSize,
				canvasRatio
			);
		}
		this._fixClip();
		this._mainMatrix = Matrix.mul(
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
			ctx.lineWidth = 0.1;
			ctx.strokeStyle = '#00ff00';
			ctx.stroke();
		}
		for ( let i = -10; i <= 10; i++ ) {
			ctx.beginPath();
			ctx.moveTo(i, -10);
			ctx.lineTo(i, 10);
			ctx.lineWidth = 0.1;
			ctx.strokeStyle = '#00ff00';
			ctx.stroke();
		}
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(-0.1, -0.1, 0.2, 0.2);
		ctx.fillStyle = "#0000FF";
		ctx.fillRect(10, 10, 0.2, 0.2);
	}
	
	_cleanCanvas(color = 'gray') {
		this.cleanTransform();
		this._ctx.fillStyle = color;
		this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
	}
	
}