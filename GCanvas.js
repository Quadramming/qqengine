// QQDOC

import * as QQ from './QQ.js';
import {Size, Point, Rect} from './primitives/index.js';

export class GCanvas {
	
	#initSize = new Size();
	#onResizeFn = () => this.#calcSize();
	#fullscreen = true;
	#maximize = false; // Only for windowed mode
	#size = new Size(); // Only for windowed mode
	#scale = 1;
	#unit = null;
	#canvas = document.createElement('canvas');
	#context = this.#canvas.getContext('2d');
	
	constructor(id, size, maximize) {
		if ( size ) {
			this.#fullscreen = false;
			this.#initSize.copy(size);
			this.#maximize = maximize ?? false;
		}
		this.#canvas.id = id;
		this.#canvas.style.position = 'absolute';
		this.#calcSize();
		document.body.appendChild(this.#canvas);
		QQ.APP.addOnResize( this.#onResizeFn );
	}
	
	destructor() {
		QQ.APP.removeOnResize( this.#onResizeFn );
		document.body.removeChild(this.#canvas);
	}
	
	getSizeRect() {
		return new Rect(
			0, 0,
			this.#canvas.width,
			this.#canvas.height
		);
	}
	
	getWidth() {
		return this.#size.width();
	}
	
	getHeight() {
		return this.#size.height();
	}
	
	getUnit() {
		return this.#unit;
	}
	
	getCanvas() {
		return this.#canvas;
	}
	
	getCanvasOffset() {
		return new Point(
			this.#canvas.offsetLeft,
			this.#canvas.offsetTop,
		);
	}
	
	getContext() {
		return this.#context;
	}
	
	getScale() {
		return this.#scale;
	}
	
	getRatio() {
		return this.#size.getRatio();
	}
	
	resize() {
		this.#calcSize();
	}
	
	drawBorder() {
		const context = this.#context;
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.beginPath();
		context.rect(0, 0, this.#size.width(), this.#size.height());
		context.lineWidth = this.#unit;
		context.strokeStyle = '#000000';
		context.stroke();
	}
	
	#calcSize() {
		if ( this.#fullscreen ) {
			this.#calcFullscreenSize();
		} else {
			if ( this.#maximize ) {
				this.#calcMaximizedSize();
			} else {
				this.#calcNormalSize();
			}
		}
		this.#calcCanvasSize();
	}
	
	#calcNormalSize() {
		this.#size.copy(this.#initSize);
		if ( window.innerWidth < this.#size.width() ) {
			this.#size.height(Math.floor(
				this.#size.height() * (window.innerWidth / this.#size.width())
			));
			this.#size.width( Math.floor(window.innerWidth) );
		}
		if ( window.innerHeight < this.#size.height() ) {
			this.#size.width(Math.floor(
				this.#size.width() * (window.innerHeight / this.#size.height())
			));
			this.#size.height( Math.floor(window.innerHeight) );
		}
		this.#scale = this.#size.width() / this.#initSize.width();
		this.#unit = this.#size.width() / 100;
	}
	
	#calcFullscreenSize() {
		this.#size.width(window.innerWidth);
		this.#size.height(window.innerHeight);
		this.#scale = 1;
		this.#unit = this.#size.width() / 100;
	}
	
	#calcMaximizedSize() {
		const ratio = this.#initSize.getRatio();
		this.#size.width(window.innerWidth);
		this.#size.height( Math.floor(this.#size.width()/ratio) );
		if ( window.innerHeight < this.#size.height() ) {
			this.#size.height(window.innerHeight);
			this.#size.width(Math.floor(this.#size.height()*ratio));
		}
		this.#scale = this.#size.width() / this.#initSize.width();
		this.#unit = this.#size.width() / 100;
	}
	
	#calcCanvasSize() {
		const canvas = this.#canvas;
		canvas.width = this.#size.width();
		canvas.height = this.#size.height();
		canvas.style.left = (window.innerWidth/2 - this.#size.w()/2) + 'px';
		canvas.style.top = (window.innerHeight/2 - this.#size.h()/2) + 'px';
		this.#context.font = `bold ${Math.floor(20*this.getScale())} px defaultFont`;
		this.#context.imageSmoothingEnabled = false;
	}
	
}
