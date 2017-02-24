QQ.Text = class Text extends QQ.SubjectBase {
	
	constructor(text, x=0, y=0, fitSize=1, fit=QQ.Text.fit.HEIGHT) {
		super(0, 0);
		this._fitSize    = fitSize;
		this._ratio      = 0;
		this._fit        = fit;
		this._align      = 'center';
		this._font       = 'Ken';
		this._strings    = String(text).split('\n');
		this._lines      = this._strings.length;
		this._text       = {
				x:      x,
				y:      y,
				height: 0,
				width:  0
			};
		this._line       = {
				space:  0,
				height: 20 + 0
			};
		this._calcSizes();
	}
	
	type() {
		return 'text';
	}
	
	draw() {
		super.draw();
		this._setupContext();
		let offsetX = 0; // center
		let offsetY = -(this._line.height/2)*(this._lines-1);
		if ( this._align === 'left' ) {
			offsetX = -(this._text.width/2);
		} else if ( this._align === 'right' ) {
			offsetX = (this._text.width/2);
		}
		let x       = 0;
		for ( let str of this._strings ) {
			this._ctx.fillText(str, offsetX, offsetY + x*this._line.height);
			++x;
		}
	}
	
	isClickable() {
		return false;
	}
	
	getScale() {
		let scaleX = (this._width  / this._text.height) / this._ratio;
		let scaleY = (this._height / this._text.height);
		return { x : scaleX, y : scaleY };
	}
	
	getWidth() {
		return this._text.width;
	}
	
	setFont(font) {
		this._font = font;
		this._calcSizes();
	}
	
	setAlign(align) {
		this._align = align;
		this._calcSizes();
	}
	
	setLineHeight(h) {
		this._line.height = h + this._line.space;
		this._calcSizes();
	}
	
	setLineSpace(s) {
		this._line.height -= this._line.space;
		this._line.space   = s;
		this._line.height += this._line.space;
		this._calcSizes();
	}
	
	setText(text) {
		this._strings = String(text).split('\n');
		this._lines   = this._strings.length;
		this._calcSizes();
	}
	
	setPosition(x, y) {
		this._text.x = x;
		this._text.y = y;
		this._calcSizes();
	}
	
	_setupContext() {
		this._ctx.textBaseline = 'middle';
		this._ctx.textAlign    = this._align;
		this._ctx.fillStyle    = '#878787';
		const size = this._line.height - this._line.space;
		this._ctx.font         = size + 'px ' + this._font;
	}
	
	_calcSizes() {
		this._setupContext();
		this._text.height = this._line.height * this._strings.length;
		this._text.width  = 0;
		for ( let str of this._strings ) {
			const len = this._ctx.measureText(str).width;
			if ( len > this._text.width ) {
				this._text.width = len;
			}
		}
		let pxInUnit = 0;
		if ( this._fit === Text.fit.WIDTH ) {
			pxInUnit = this._text.width / this._fitSize;
		} else { // HEIGHT
			pxInUnit = this._line.height / this._fitSize;
		}
		this._ratio = this._text.width / this._text.height;
		this.setSize(
			this._text.width  / pxInUnit,
			this._text.height / pxInUnit
		);
		super.setPosition(
			this._text.x,
			this._text.y - ((this._height/this._lines)/2)*(this._lines-1)
		);
	}
	
};

QQ.Text.fit = {
	WIDTH         : 0,
	HEIGHT        : 1
};
