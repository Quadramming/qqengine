QQ.Text = class Text extends QQ.Subject.Base {

	constructor(options) {
		super(options);
		this._strings      = String(options.text).split('\n');
		this._lines        = this._strings.length;
		this._isNeedRecalc = true;
		this._align        = QQ.default(options.align, 'center');
		this._valign       = QQ.default(options.valign, 'middle');
		this._baseLine     = QQ.default(options.baseLine, 'middle');
		this._font         = QQ.default(options.font, 'Arial');
		this._fontSize     = QQ.default(options.fontSize, 1);
		this._spaceSize    = QQ.default(options.fontSpace, 1);
		this._textScale    = new QQ.Scale();
	}
	
	draw(ctx) {
		ctx.transform(this.getMatrix());
		//this._drawLocalBorder(ctx);
		super.draw(ctx);
		
		const context = ctx.get();
		this._setupContext(context);
		if ( this._isNeedRecalc ) {
			this._calculate(context);
		}
		ctx.transform(
			QQ.Matrix.mul(this.getMatrix(), QQ.Matrix.getScale(this._textScale))
		);
		const localRect = this._getLocalRect();
		const rectScaled = new QQ.Rect(
			localRect.x() / this._textScale.x(),
			localRect.y() / this._textScale.y(),
			localRect.w() / this._textScale.w(),
			localRect.h() / this._textScale.h()
		);
		let i = 0;
		for ( const str of this._strings ) {
			let x, y;
			if ( this._align === 'left' ) {
				x = rectScaled.x();
			} else if ( this._align === 'center' ) {
				x = rectScaled.x() + rectScaled.w()/2;
			} else if ( this._align === 'right' ) {
				x = rectScaled.x() + rectScaled.w();
			}
			const yOffset = (i*this._fontSize + i*this._spaceSize);
			if ( this._valign === 'top' ) {
				y = rectScaled.y() + yOffset;
			} else if ( this._valign === 'middle' ) {
				y = rectScaled.y()
					+ rectScaled.h()/2
					+ this._fontSize/2
					- (
						this._lines * this._fontSize +
						(this._lines-1) * this._spaceSize
					)/2
					+ yOffset;
			} else if ( this._valign === 'bottom' ) {
				y = rectScaled.y()
					+ rectScaled.h()
					+ this._fontSize
					- (
						this._lines * this._fontSize +
						(this._lines-1) * this._spaceSize
					)
					+ yOffset;
			}
			context.fillText(str, x, y);
			++i;
		}
	}
	
	setText(text) {
		this._strings = String(text).split('\n');
		this._lines = this._strings.length;
		this.recalc();
	}
	
	recalc() {
		this._isNeedRecalc = true;
	}
	
	_drawLocalBorder(ctx) {
		super._drawLocalBorder(ctx);
	}
	
	_setupContext(ctx) {
		ctx.font         = this._fontSize + 'px ' + this._font;
		ctx.textBaseline = this._baseLine;
		ctx.textAlign    = this._align;
		ctx.fillStyle    = '#878787';
	}
	
	_measureText(ctx) {
		const result = new QQ.Size();
		for ( const str of this._strings ) {
			const length = ctx.measureText(str).width;
			if ( length > result.w() ) {
				result.w(length);
			}
		}
		result.y(this._fontSize*this._lines + (this._lines-1)*this._spaceSize);
		return result;
	}
	
	_calculate(ctx) {
		const size = this._measureText(ctx);
		const w    = this._size.w() / size.w();
		const h    = this._size.h() / size.h();
		this._textScale.set(Math.min(w, h, 1));
	}
	
};
