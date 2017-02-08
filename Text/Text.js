//REFACTOR

QQ.Text = class Text extends QQ.Subject {
	
	constructor(text, x=0, y=0, fitSize=1, fit=QQ.Text.fit.HEIGHT) {
		super(null, 0, 0);
		this._fitSize    = fitSize;
		this._textX      = x;
		this._textY      = y;
		this._textHeight = 0;
		this._textWidth  = 0;
		this._pxInUnit   = 0;
		this._ratio      = 0;
		this._fit        = fit;
		this._align      = 'center';
		this._font       = 'Ken';
		this._lineSpace  = 0;
		this._lineHeight = 20 + this._lineSpace;
		this._text       = String(text).split('\n');
		this._lines      = this._text.length;
		this._calcSizes();
	}
	
	isClickable() {
		return false;
	}
	
	setSize(width, height) {
		this._width  = width;
		this._height = height;
	}
	
	setFont(font) {
		this._font = font;
		this._calcSizes();
	}
	
	setAlign(align) {
		this._align = align;
	}
	
	setLineHeight(h) {
		this._lineHeight = h + this._lineSpace;
		this._calcSizes();
	}
	
	setLineSpace(s) {
		this._lineHeight -= this._lineSpace;
		this._lineSpace   = s;
		this._lineHeight += this._lineSpace;
		this._calcSizes();
	}
	
	getScale() {
		let scaleX = (this._width  / this._textHeight) / this._ratio;
		let scaleY = this._height / this._textHeight;
		return { x : scaleX, y : scaleY };
	}
	
	draw() {
		this._setupContext();
		let offsetX = 0; // center
		let offsetY = -(this._lineHeight/2)*(this._lines-1);
		if ( this._align === 'left' ) {
			offsetX = -(this._textWidth/2);
		} else if ( this._align === 'right' ) {
			offsetX = (this._textWidth/2);
		}
		let x       = 0;
		for ( let str of this._text ) {
			this._ctx.fillText(str, offsetX, offsetY + x*this._lineHeight);
			++x;
		}
		//this.drawBorder();
	}
	
	setText(text) {
		this._text       = String(text).split('\n');
		this._lines      = this._text.length;
		this._calcSizes();
	}
	
	setPosition(x, y) {
		this._textX = x;
		this._textY = y;
	}
	
	_setupContext() {
		this._ctx.textBaseline = 'middle';
		this._ctx.textAlign    = this._align;
		this._ctx.fillStyle    = '#878787';
		const size = this._lineHeight - this._lineSpace;
		this._ctx.font         = size + 'px ' + this._font;
	}
	
	_calcSizes() {
		this._setupContext();
		this._textHeight = this._lineHeight * this._text.length;
		this._textWidth  = 0;
		for ( let str of this._text ) {
			const len = this._ctx.measureText(str).width;
			if ( len > this._textWidth ) {
				this._textWidth = len;
			}
		}
		if ( this._fit === Text.fit.WIDTH ) {
			this._pxInUnit = this._textWidth / this._fitSize;
		} else { // HEIGHT
			this._pxInUnit = this._lineHeight / this._fitSize;
		}
		this._ratio    = this._textWidth / this._textHeight;
		this.setSize(
			this._textWidth  / this._pxInUnit,
			this._textHeight / this._pxInUnit
		);
		super.setPosition(
			this._textX,
			this._textY - ((this._height/this._lines)/2)*(this._lines-1)
		);
	}
	
};

QQ.Text.fit = {
	WIDTH         : 0,
	HEIGHT        : 1
};
