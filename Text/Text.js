import * as QQ from '../QQ.js';
import * as Matrix from '../matrix.js';
import * as Subject from '../Subject/index.js';
import {Rect, Scale, Size} from '../primitives/index.js';

export class Text extends Subject.Subject {
	
	constructor(options = {}) {
		super(options);
		this._originalString = '';
		this._strings = '';
		this._lines = 0;
		this._hidden = false;
		this._needCalculation = true;
		this._textScale = new Scale();
		this._color = QQ.useDefault(options.color, '#000000');
		this._align = QQ.useDefault(options.align, 'center');
		this._valign = QQ.useDefault(options.valign, 'middle');
		this._baseLine = QQ.useDefault(options.baseLine, 'middle');
		this._font = QQ.useDefault(options.font, 'Arial');
		this._fontSize = QQ.useDefault(options.fontSize, 50);
		this._spaceSize = QQ.useDefault(options.fontSpace, 1);
		this._alpha = QQ.useDefault(options.alpha, 1);
		this._border = QQ.useDefault(options.border, false);
		this.setText(options.text);
	}
	
	setText(text) {
		if ( this._originalString === text ) {
			return;
		}
		this._originalString = text;
		this._strings = String(text).split('\n');
		this._lines = this._strings.length;
		this._needCalculation = true;
	}
	
	show() {
		this._hidden = false;
	}
	
	hide() {
		this._hidden = true;
	}
	
	font(f) { // {F}
		if ( f !== undefined ) {
			this._font = f;
		}
		return this._font;
	}
	
	color(c) { // {F}
		if ( c !== undefined ) {
			this._color = c;
		}
		return this._color;
	}
	
	alpha(a) { // {F}
		if ( a !== undefined ) {
			this._alpha = a;
		}
		return this._alpha;
	}
	
	draw(ctxWrap) {
		if ( this._hidden ) {
			return;
		}
		ctxWrap.transform(this.getMatrix());
		if ( this._border ) {
			super._drawLocalBorder(ctxWrap);
		}
		super.draw(ctxWrap);
		const ctx = ctxWrap.get();
		this._setupCtx(ctx);
		if ( this._needCalculation ) {
			this._calculate(ctx);
		}
		ctxWrap.transform(
			Matrix.mul(this.getMatrix(), Matrix.getScale(this._textScale))
		);
		const localRect = this.getLocalRect();
		const rectScaled = new Rect(
			localRect.x() / this._textScale.x(),
			localRect.y() / this._textScale.y(),
			localRect.w() / this._textScale.w(),
			localRect.h() / this._textScale.h()
		);
		let i = 0;
		const changeAlpha = (this._alpha !== 1);
		if ( changeAlpha ) {
			ctx.globalAlpha = this._alpha;
		}
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
			ctx.fillText(str, x, y);
			++i;
		}
		if ( changeAlpha ) {
			ctx.globalAlpha = 1;
		}
	}
	
	_setupCtx(ctx) {
		ctx.font = 'normal ' + this._fontSize + 'px ' + this._font;
		ctx.textBaseline = this._baseLine;
		ctx.textAlign = this._align;
		ctx.fillStyle = this._color;
	}
	
	_calculate(ctx) {
		const size = this._measureText(ctx);
		const w = this._size.w() / size.w();
		const h = this._size.h() / size.h();
		this._textScale.set(Math.min(w, h, 1));
	}
	
	_measureText(ctx) {
		const result = new Size(0, 0);
		for ( const string of this._strings ) {
			const length = ctx.measureText(string).width;
			if ( length > result.w() ) {
				result.w(length);
			}
		}
		result.y(this._fontSize*this._lines + (this._lines-1)*this._spaceSize);
		return result;
	}
	
}
