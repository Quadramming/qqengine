// QQDOC

import * as QQ from './QQ.js';
import * as Matrix from './matrix.js';
import * as Subject from './Subject/index.js';
import * as maths from './maths.js';
import {Point, Size, Rect, Scale} from './primitives/index.js';

export class Camera {
	
	#initViewSize = new Size(20, 20);
	#viewSize = this.#initViewSize.clone();
	#position = new Point(0, 0);
	#clip = null;
	#onResizeFn = () => this.#calcMainMatrix();
	#isDrawAxis = false; // Is draw axis
	#follow = null;
	#world;
	#canvas;
	#context;
	#mainMatrix;
	#wcontext;
	
	// TODO Put in documentation
	// Can be overridden:
	// tick()
	
	constructor(world, canvas) {
		this.#world = world;
		this.#canvas = canvas;
		this.#context = canvas.getContext('2d');
		this.#calcMainMatrix();
		this.#wcontext = { // WrappedContext
			get: () => this.#context, // Get context
			// Apply matrix to context thru #mainMatrix:
			transform: (matrix, context = this.#context) => this.setTransform(matrix, context),
			// Apply only #mainMatrix to context:
			cleanTransform: (context = this.#context) => QQ.setTransform(this.#mainMatrix, context)
		};
		QQ.APP.addOnResize( this.#onResizeFn );
	}
	
	destructor() {
		QQ.APP.removeOnResize( this.#onResizeFn );
	}
	
	widthToPercent(x) {
		return x / (this.#canvas.width/100);
	} // number
	
	heightToPercent(y) {
		return y / (this.#canvas.height/100);
	} // number
	
	widthPercentsToPx(x) {
		return this.#canvas.width*x / 100;
	} // number
	
	heightPercentsToPx(y) {
		return this.#canvas.height*y / 100;
	} // number
	
	addPosition(offset) {
		this.#position.translate(offset);
		this.#calcMainMatrix();
	} // void
	
	addView(addition) {
		this.#initViewSize.add(addition);
		this.#calcMainMatrix();
	} // void
	
	setClip(rect) {
		if ( rect instanceof Rect ) {
			if ( this.#clip ) {
				this.#clip.copy(rect);
			} else {
				this.#clip = rect.clone();
			}
		} else {
			this.#clip = null;
		}
		this.#calcMainMatrix();
	} // void
	
	getViewRect() {
		return new Rect(
			this.#position.x() - this.#viewSize.w()/2,
			this.#position.y() - this.#viewSize.h()/2,
			this.#viewSize.w(),
			this.#viewSize.h()
		);
	} // new Rect
	
	getWorldFromScreen(point) {
		const M = Matrix.mul(
			Matrix.inverse(this.#mainMatrix),
			[[point.x()],[point.y()],[1]]
		);
		return new Point(M[0][0], M[1][0]);
	} // new Point
	
	setFollow(subj) {
		this.#follow = subj;
	} // void
	
	tick(delta) {
		if ( this.#follow ) this.position( this.#follow.getWorldPosition() );
	} // void
	
	draw() {
		const background = this.#world.background();
		if ( typeof background === 'string' ) {
			this.#cleanCanvas(background);
		} else if ( background instanceof Subject.Subject ) {
			background.fitInRect(this.getViewRect());
			background.draw(this.#wcontext);
		}
		if ( this.#isDrawAxis ) this.#drawAxis();
		this.#world.draw(this.#wcontext);
	} // void
	
	drawRect(rect) {
		QQ.setTransform(this.#mainMatrix, this.#context);
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
	} // void
	
	setTransform(matrix, context = this.#context) {
		QQ.setTransform(
			Matrix.mul(this.#mainMatrix, matrix),
			context
		);
	} // void
	
	#fixClip() {
		this.#clip?.enclose(this.#position);
	} // void
	
	#calcMainMatrix() {
		// Prepare
		const canvasRatio = (this.#canvas.width / this.#canvas.height);
		this.#viewSize.copy( maths.increaseToRatio(
			this.#initViewSize,
			canvasRatio
		));
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
	} // void
	
	toggleDrawAxis() {
		this.#isDrawAxis = ! this.#isDrawAxis;
	} // void
	
	#drawAxis() {
		const context = this.#context;
		QQ.setTransform(this.#mainMatrix, context);
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
	} // void
	
	#cleanCanvas(color = 'gray') {
		QQ.cleanTransform(this.#context);
		this.#context.fillStyle = color;
		this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
	} // void
	
	viewSize(viewSize) { // {F}
		if ( viewSize !== undefined ) {
			this.#initViewSize.copy(viewSize);
			this.#calcMainMatrix();
		}
		return this.#viewSize;
	} // Size
	
	position(position) { // {F}
		if ( position !== undefined ) {
			this.#position.copy(position);
			this.#calcMainMatrix();
		}
		return this.#position;
	} // Point
	
}
