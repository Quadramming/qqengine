// QQDOC

import * as QQ from './QQ.js';
import * as Matrix from './matrix.js';
import * as Maths from './maths.js';
import * as Subject from './Subject/index.js';
import {Point, Size, Rect, Scale} from './primitives/index.js';

export class Camera {
	
	#world;
	#canvas;
	#context;
	#mainMatrix;
	#initViewSize = new Size(20, 20);
	#viewSize = this.#initViewSize.clone();
	#position = new Point(0, 0);
	#clip = null;
	#onResizeFn = () => this.#calcMainMatrix();
	#isDrawAxis = false; // Is draw axis
	
	constructor(world, canvas) {
		this.#world = world;
		this.#canvas = canvas;
		this.#context = canvas.getContext('2d');
		this.#calcMainMatrix();
		QQ.APP.addOnResize( this.#onResizeFn );
	}
	
	destructor() {
		QQ.APP.removeOnResize( this.#onResizeFn );
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
		return this.#viewSize;
	}
	
	getViewRect() {
		return new Rect(
			this.#position.x() - this.#viewSize.w()/2,
			this.#position.y() - this.#viewSize.h()/2,
			this.#viewSize.w(),
			this.#viewSize.h()
		);
	}
	
	getPosition() {
		return this.#position;
	}
	
	addPosition(offset) {
		this.#position.translate(offset);
		this.#calcMainMatrix();
	}
	
	addView(addition) {
		this.#initViewSize.add(addition);
		this.#calcMainMatrix();
	}
	
	setPosition(point) {
		this.#position = point;
		this.#calcMainMatrix();
	}
	
	setClip(rect) {
		if ( rect instanceof Rect ) {
			if ( clip ) {
				this.#clip.copy(rect);
			} else {
				this.#clip = rect.clone();
			}
		} else {
			this.#clip = null;
		}
		this.#calcMainMatrix();
	}
	
	setView(size) {
		this.#initViewSize.copy(size);
		this.#calcMainMatrix();
	}
	
	//================================================================
	// Common
	//================================================================
	
	getWorldFromScreen(point) {
		const M = Matrix.mul(
			Matrix.inverse(this.#mainMatrix),
			[[point.x()],[point.y()],[1]]
		);
		return new Point(M[0][0], M[1][0]);
	}
	
	draw() {
		const contextWrapper = {
			get: () => this.#context,
			transform: (matrix, context) => this.setTransform(matrix, context),
			cleanTransform: () => QQ.setTransform(this.#context, this.#mainMatrix)
		};
		const bg = this.#world.background();
		if ( bg && typeof bg === 'string' ) {
			this.#cleanCanvas(bg);
		} else if ( bg && bg instanceof Subject.Subject ) {
			bg.fitInRect(this.getViewRect());
			bg.draw(contextWrapper);
		}
		if ( this.#isDrawAxis ) {
			this.#drawAxis();
		}
		this.#world.getStage().draw(contextWrapper);
	}
	
	tick() {
	}
	
	drawRect(rect) {
		QQ.setTransform(this.#context, this.#mainMatrix);
		this.#context.beginPath();
		this.#context.rect(
			rect.x(),
			rect.y(),
			rect.width(),
			rect.height()
		);
		this.#context.lineWidth = 1;
		this.#context.strokeStyle = '#00FFFF';
		this.#context.stroke();
	}
	
	setTransform(matrix, context = this.#context) {
		QQ.setTransform(
			context,
			Matrix.mul(this.#mainMatrix, matrix)
		);
	}
	
	//================================================================
	// Private
	//================================================================
	
	
	#fixClip() {
		if ( this.#clip !== null ) {
			if ( this.#position.x() > this.#clip.right() ) {
				this.#position.x( this.#clip.right() );
			}
			if ( this.#position.x() < this.#clip.left() ) {
				this.#position.x( this.#clip.left() );
			}
			if ( this.#position.y() < this.#clip.top() ) {
				this.#position.y( this.#clip.top() );
			}
			if ( this.#position.y() > this.#clip.bottom() ) {
				this.#position.y( this.#clip.bottom() );
			}
		}
	}
	
	#calcMainMatrix() {
		// Prepare
		const canvasRatio = (this.#canvas.width / this.#canvas.height);
		this.#viewSize = Maths.increaseToRatio(
			this.#initViewSize,
			canvasRatio
		);
		this.#fixClip();
		
		// Camera settings
		/* DEBUG EXAMPLE
		let M = Matrix.getReflect();
		M = Matrix.mul(Matrix.getScale(new Scale(1, 1)), M);
		M = Matrix.mul(Matrix.getRotate(0.1), M);
		M = Matrix.mul(Matrix.getMove(this.#position), M);
		M = Matrix.inverse(M);
		//*/
		// Or simple
		let M = Matrix.getMove( this.#position.cloneInverted() );
		
		// Screen settings
		M = Matrix.mul( Matrix.getScale(new Scale(
				this.#canvas.width / this.#viewSize.width(),
				this.#canvas.height / this.#viewSize.height()
		)), M);
		M = Matrix.mul(Matrix.getMove(new Point(
			this.#canvas.width / 2,
			this.#canvas.height / 2
		)), M);
		
		this.#mainMatrix = M;
	}
	
	toggleDrawAxis() {
		this.#isDrawAxis = ! this.#isDrawAxis;
	}
	
	#drawAxis() {
		const context = this.#context;
		QQ.setTransform(context, this.#mainMatrix);
		for ( let i = -10; i <= 10; i++ ) {
			context.beginPath();
			context.moveTo(-10, i);
			context.lineTo( 10, i);
			context.lineWidth = 0.1;
			context.strokeStyle = '#00ff00';
			context.stroke();
		}
		for ( let i = -10; i <= 10; i++ ) {
			context.beginPath();
			context.moveTo(i, -10);
			context.lineTo(i, 10);
			context.lineWidth = 0.1;
			context.strokeStyle = '#00ff00';
			context.stroke();
		}
		context.fillStyle = "#FF0000";
		context.fillRect(-0.1, -0.1, 0.2, 0.2);
		context.fillStyle = "#0000FF";
		context.fillRect(10, 10, 0.2, 0.2);
	}
	
	#cleanCanvas(color = 'gray') {
		QQ.cleanTransform(this.#context);
		this.#context.fillStyle = color;
		this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
	}
	
}
