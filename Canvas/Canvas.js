QQ.Canvas = class Canvas {
	
	constructor(id, w, h, maximize = false) {
		this._initSize   = {w, h};
		this._maximize   = maximize;
		this._fullscreen = (w === undefined || h === undefined);
		this._width      = null;
		this._height     = null;
		this._scale      = 1;
		this._unit       = null;
		this._onCalcSize = () => {};
		this._canvas     = document.createElement('canvas');
		this._context    = this._canvas.getContext('2d');
		this._canvas.id  = id;
		this._canvas.style.position         = 'absolute';
		this._context.imageSmoothingEnabled = true;
		
		this._calcSize();
		document.body.appendChild(this._canvas);
		window.addEventListener('resize', () => this.resize());
	}
	
	getWidth() {
		return this._width;
	}
	
	getHeight() {
		return this._height;
	}
	
	getUnit() {
		return this._unit;
	}
	
	getCanvas() {
		return this._canvas;
	}
	
	getContext() {
		return this._context;
	}
	
	getScale() {
		return this._scale;
	}
	
	getRatio() {
		return this._width / this._height;
	}
	
	setOnCalcSize(fn) {
		this._onCalcSize = fn;
		this._calcSize();
	}
	
	resize() {
		this._calcSize();
	}
	
	drawBorder() {
		const context = this._context;
		context.setTransform(1, 0, 0, 1, 0, 0, 0);
		context.beginPath();
		context.rect(0, 0, this._width, this._height);
		context.lineWidth   = this._unit;
		context.strokeStyle = 'black';
		context.stroke();
	}
	
	remove() {
		document.body.removeChild(this._canvas);
	}
	
	_calcSize() {
		if ( this._fullscreen ) {
			this._calcFullscreenSize();
		} else {
			if ( this._maximize ) {
				this._calcMaximizedSize();
			} else {
				this._calcNormalSize();
			}
		}
		this._calcCanvasSize();
		this._onCalcSize();
	}
	
	_calcNormalSize() {
		this._width  = this._initSize.w;
		this._height = this._initSize.h;
		if ( window.innerWidth < this._width ) {
			this._height = Math.floor(
				this._height * (window.innerWidth / this._width)
			);
			this._width  = Math.floor(window.innerWidth );
		}
		if ( window.innerHeight < this._height ) {
			this._width  = Math.floor(
				this._width * (window.innerHeight / this._height)
			);
			this._height = Math.floor( window.innerHeight );
		}
		this._scale = this._width / this._initSize.w;
		this._unit  = this._width / 100;
	}
	
	_calcFullscreenSize() {
		this._width  = window.innerWidth;
		this._height = window.innerHeight;
		this._scale  = 1;
		this._unit   = this._width / 100;
	}
	
	_calcMaximizedSize() {
		const ratio  = this._initSize.w / this._initSize.h;
		this._width  = window.innerWidth;
		this._height = Math.floor(this._width/ratio);
		if ( window.innerHeight < this._height ) {
			this._height = window.innerHeight;
			this._width  = Math.floor(this._height*ratio);
		}
		this._scale = this._width / this._initSize.w;
		this._unit  = this._width / 100;
	}
	
	_calcCanvasSize() {
		const canvas       = this._canvas;
		canvas.width       = this._width;
		canvas.height      = this._height;
		canvas.style.left  = (window.innerWidth/2  - this._width/2)  + 'px';
		canvas.style.top   = (window.innerHeight/2 - this._height/2) + 'px';
		this._context.font = 'bold ' +
							 Math.floor(20 * this.getScale()) + 'px' +
							 'defaultFont';
	}
	
};
