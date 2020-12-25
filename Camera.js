// QQDOC

import * as QQ from './QQ.js';
import * as Matrix from './matrix.js';
import * as Maths from './maths.js';
import * as Subject from './Subject/index.js';
import {Point, Size, Rect, Scale} from './primitives/index.js';

export class Camera {
	
	#isDrawAxis = false; // Is draw axis
	#canvas;
	#world;
	#onResizeFn;
	
	constructor(canvas, world) {
		this.#canvas = canvas;
		this.#world = world;
		this._mainMatrix = null;
		this._clip = null;
		this._initViewSize = new Size(20, 20);
		this._viewSize = this._initViewSize.clone();
		this._position = new Point(0, 0);
		this._ctx = canvas.getContext('2d');
		this.#calcMainMatrix();
		this.#onResizeFn = () => this.#calcMainMatrix();
		QQ.APP.addOnResize( this.#onResizeFn );
	}
	
	destructor() {
		QQ.APP.removeOnResize( this.#onResizeFn );
		this.#canvas = null;
		this.#world = null;
	}
	
	//================================================================
	// Percents
	//================================================================
	
	widthToPercent(x) {
		return x / (this.#canvas.width/100);
	}
	
	heightToPercent(y) {
		return y / (this.#canvas.height/100);
	}
	
	widthPercentsToPx(x) {
		return this.#canvas.width*x / 100;
	}
	
	heightPercentsToPx(y) {
		return this.#canvas.height*y / 100;
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
		this._initViewSize.add(addition);
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
		this._initViewSize.copy(size);
		this._calcMainMatrix();
	}
	
	//================================================================
	// Common
	//================================================================
	
	getWorldFromScreen(point) {
		const M = Matrix.mul(
			Matrix.inverse(this._mainMatrix),
			[[point.x()],[point.y()],[1]]
		);
		return new Point(M[0][0], M[1][0]);
	}
	
	draw() {
		const ctxObj = {
			get: () => this._ctx,
			transform: this.setTransform.bind(this),
			cleanTransform: () => QQ.setTransform(this._ctx, this._mainMatrix)
		};
		const bg = this.#world.background();
		if ( bg && typeof bg === 'string' ) {
			this.#cleanCanvas(bg);
		} else if ( bg && bg instanceof Subject.Subject ) {
			bg.fitInRect(this.getViewRect());
			bg.draw(ctxObj);
		}
		if ( this.#isDrawAxis ) {
			this.#drawAxis();
		}
		this.#world.getStage().draw(ctxObj);
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
		this._ctx.strokeStyle = '#00FFFF';
		this._ctx.stroke();
	}
	
	setTransform(matrix, ctx = this._ctx) {
		QQ.setTransform(
			ctx,
			Matrix.mul(this._mainMatrix, matrix)
		);
	}
	
	//================================================================
	// Private
	//================================================================
	
	
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
	
	#calcMainMatrix() {
		// Prepare
		const canvasRatio = (this.#canvas.width / this.#canvas.height);
		this._viewSize = Maths.increaseToRatio(
			this._initViewSize,
			canvasRatio
		);
		this._fixClip();
		
		// Camera settings
		/*
		let M = Matrix.getReflect();
		M = Matrix.mul(Matrix.getScale(new Scale(2, 2)), M);
		M = Matrix.mul(Matrix.getRotate(0.1), M);
		M = Matrix.mul(Matrix.getMove(this._position), M);
		M = Matrix.inverse(M);
		*/
		// Or simple
		let M = Matrix.getMove( this._position.cloneInverted() );
		
		// Screen settings
		M = Matrix.mul( Matrix.getScale(new Scale(
				this.#canvas.width / this._viewSize.width(),
				this.#canvas.height / this._viewSize.height()
		)), M);
		M = Matrix.mul(Matrix.getMove(new Point(
			this.#canvas.width / 2,
			this.#canvas.height / 2
		)), M);
		
		this._mainMatrix = M;
	}
	
	toggleDrawAxis() {
		this.#isDrawAxis = ! this.#isDrawAxis;
	}
	
	#drawAxis() {
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
	
	#cleanCanvas(color = 'gray') {
		QQ.cleanTransform(this._ctx);
		this._ctx.fillStyle = color;
		this._ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
	}
	
}
