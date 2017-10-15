QQ.Canvas = class Canvas {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(id, size, maximize = false) {
		this._fullscreen = (size === undefined);
		if ( ! this._fullscreen ) {
			this._initSize   = size.clone();
		}
		this._maximize   = maximize;
		this._size       = new QQ.Size();
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
	
	//================================================================
	// Common
	//================================================================
	
	getSizeRect() {
		return new QQ.Rect(0, 0,
			this._canvas.width,
			this._canvas.height
		);
	}
	
	getWidth() {
		return this._size.width();
	}
	
	getHeight() {
		return this._size.height();
	}
	
	getUnit() {
		return this._unit;
	}
	
	getCanvas() {
		return this._canvas;
	}
	
	getCanvasOffset() {
		return new QQ.Point(
			this._canvas.offsetLeft,
			this._canvas.offsetTop,
		);
	}
	
	getContext() {
		return this._context;
	}
	
	getScale() {
		return this._scale;
	}
	
	getRatio() {
		return this._size.getRatio();
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
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.beginPath();
		context.rect(0, 0, this._size.width(), this._size.height());
		context.lineWidth   = this._unit;
		context.strokeStyle = 'black';
		context.stroke();
	}
	
	remove() {
		document.body.removeChild(this._canvas);
	}
	
	//================================================================
	// Private
	//================================================================
	
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
		this._size.copy(this._initSize);
		if ( window.innerWidth < this._size.width() ) {
			this._size.height(Math.floor(
				this._size.height() * (window.innerWidth / this._size.width())
			));
			this._size.width( Math.floor(window.innerWidth) );
		}
		if ( window.innerHeight < this._size.height() ) {
			this._size.width(Math.floor(
				this._size.width() * (window.innerHeight / this._size.height())
			));
			this._size.height( Math.floor(window.innerHeight) );
		}
		this._scale = this._size.width() / this._initSize.width();
		this._unit  = this._size.width() / 100;
	}
	
	_calcFullscreenSize() {
		this._size.width(window.innerWidth);
		this._size.height(window.innerHeight);
		this._scale  = 1;
		this._unit   = this._size.width() / 100;
	}
	
	_calcMaximizedSize() {
		const ratio  = this._initSize.getRatio();
		this._size.width(window.innerWidth);
		this._size.height( Math.floor(this._size.width()/ratio) );
		if ( window.innerHeight < this._size.height() ) {
			this._size.height(window.innerHeight);
			this._size.width(Math.floor(this._size.height()*ratio));
		}
		this._scale = this._size.width() / this._initSize.width();
		this._unit  = this._size.width() / 100;
	}
	
	_calcCanvasSize() {
		const canvas      = this._canvas;
		canvas.width      = this._size.width();
		canvas.height     = this._size.height();
		canvas.style.left = (window.innerWidth/2  - this._size.w()/2) + 'px';
		canvas.style.top  = (window.innerHeight/2 - this._size.h()/2) + 'px';
		this._context.font = 'bold ' +
							 Math.floor(20 * this.getScale()) + 'px' +
							 'defaultFont';
	}
	
};
