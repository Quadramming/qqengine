// QQDOC

import * as Matrix from '../matrix.js';
import * as Subject from '../Subject/index.js';
import {Rect, Scale, Size} from '../primitives/index.js';

export class Text extends Subject.Subject {
	
	#originalString;
	#strings;
	#lines;
	#hidden;
	#needCalculation;
	#textScale = new Scale();
	#color;
	#align;
	#valign;
	#baseLine;
	#font;
	#fontSize;
	#spaceSize;
	#alpha;
	#border;
	
	constructor(options = {}) {
		super(options);
		this.#reset(options);
	}
	
	reset(options = {}) { // {O}
		super.reset(options);
		this.#reset(options);
	} // void
	
	#reset(options) {
		this.#originalString = '';
		this.#strings = '';
		this.#lines = 0;
		this.#hidden = false;
		this.#needCalculation = true;
		this.#textScale.set(NaN);
		this.#color = options.color ?? '#000000';
		this.#align = options.align ?? 'center';
		this.#valign = options.valign ?? 'middle';
		this.#baseLine = options.baseLine ?? 'middle';
		this.#font = options.font ?? 'Arial';
		this.#fontSize = options.fontSize ?? 50;
		this.#spaceSize = options.fontSpace ?? 1;
		this.#alpha = options.alpha ?? 1;
		this.#border = options.border ?? false;
		this.setText(options.text);
	} // void
	
	setText(text) {
		if ( this.#originalString === text ) {
			return;
		}
		this.#originalString = text;
		this.#strings = text.split('\n');
		this.#lines = this.#strings.length;
		this.#needCalculation = true;
	} // void
	
	show() {
		this.#hidden = false;
	} // void
	
	hide() {
		this.#hidden = true;
	} // void
	
	draw(wcontext) { // {O}
		if ( this.#hidden ) {
			return;
		}
		wcontext.transform(this.getMatrix());
		if ( this.#border ) super.drawLocalBorder(wcontext);
		super.draw(wcontext);
		const context = wcontext.get();
		this.#setupContext(context);
		if ( this.#needCalculation ) this.#calculate(context);
		wcontext.transform(
			Matrix.mul(this.getMatrix(), Matrix.getScale(this.#textScale))
		);
		const localRect = this.getLocalRect();
		const rectScaled = new Rect(
			localRect.x() / this.#textScale.x(),
			localRect.y() / this.#textScale.y(),
			localRect.w() / this.#textScale.w(),
			localRect.h() / this.#textScale.h()
		);
		let i = 0;
		const changeAlpha = (this.#alpha !== 1);
		if ( changeAlpha ) context.globalAlpha = this.#alpha;
		for ( const string of this.#strings ) {
			let x, y;
			if ( this.#align === 'left' ) {
				x = rectScaled.x();
			} else if ( this.#align === 'center' ) {
				x = rectScaled.x() + rectScaled.w()/2;
			} else if ( this.#align === 'right' ) {
				x = rectScaled.x() + rectScaled.w();
			}
			const yOffset = (i*this.#fontSize + i*this.#spaceSize);
			if ( this.#valign === 'top' ) {
				y = rectScaled.y() + yOffset;
			} else if ( this.#valign === 'middle' ) {
				y = rectScaled.y()
					+ rectScaled.h()/2
					+ this.#fontSize/2
					- (
						this.#lines * this.#fontSize +
						(this.#lines-1) * this.#spaceSize
					)/2
					+ yOffset;
			} else if ( this.#valign === 'bottom' ) {
				y = rectScaled.y()
					+ rectScaled.h()
					+ this.#fontSize
					- (
						this.#lines * this.#fontSize +
						(this.#lines-1) * this.#spaceSize
					)
					+ yOffset;
			}
			context.fillText(string, x, y);
			++i;
		}
		if ( changeAlpha ) context.globalAlpha = 1;
	} // void
	
	#setupContext(context) {
		context.font = 'normal ' + this.#fontSize + 'px ' + this.#font;
		context.textBaseline = this.#baseLine;
		context.textAlign = this.#align;
		context.fillStyle = this.#color;
	} // void
	
	#calculate(context) {
		const size = this.#measureText(context);
		const w = this.size().w() / size.w();
		const h = this.size().h() / size.h();
		this.#textScale.set(Math.min(w, h, 1));
	} // void
	
	#measureText(context) {
		const result = Size.ZERO();
		for ( const string of this.#strings ) {
			const length = context.measureText(string).width;
			if ( length > result.w() ) {
				result.w(length);
			}
		}
		result.y(this.#fontSize*this.#lines + (this.#lines-1)*this.#spaceSize);
		return result;
	} // new Size
	
	alpha(alpha) { // {F}
		if ( alpha !== undefined ) {
			this.#alpha = alpha;
		}
		return this.#alpha;
	} // number
	
	color(color) { // {F}
		if ( color !== undefined ) {
			this.#color = color;
		}
		return this.#color;
	} // string
	
	font(font) { // {F}
		if ( font !== undefined ) {
			this.#font = font;
		}
		return this.#font;
	} // string
	
}
