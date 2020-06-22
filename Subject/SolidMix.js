import * as QQ from '../QQ.js';
import * as Pack from '../Pack/index.js';
import * as CONST from '../CONST/index.js';
import {Point, Size, Rect} from '../primitives/index.js';

export function SolidMix(base) {
	return class SolidMix extends base {
		
		constructor(options) {
			super(options);
			this._solidPack = new Pack.Solid(options.solid);
		}
		
		getDistance(solid) {
			return solid.getSolidPosition().getDistance(this.getSolidPosition());
		}
		
		getCollision(solid) {
			const myRect = this.getSolidRect();
			const otherRect = solid.getSolidRect();
			return myRect.intersectResolve(otherRect);
		}
		
		getSolidRect() {
			return this._solidPack.rect();
		}
		
		getSolidWeight() {
			return this._solidPack.weight();
		}
		
		getSolidType() {
			return this._solidPack.type();
		}
		
		getSolidPosition() {
			return this._solidPack.position();
		}
		
		isSolid() {
			return true;
		}
		
		/*
		draw(ctx) {
			super.draw(ctx);
			this._drawSolidBorder(ctx);
			this._drawSolidCenter(ctx);
		}
		//*/
		
		_drawSolidBorder(ctx) {
			ctx.cleanTransform();
			const rect = this._solidPack.rect();
			const context = ctx.get();
			context.beginPath();
			context.rect(
				rect.x(),
				rect.y(),
				rect.w(),
				rect.h()
			);
			context.lineWidth = 0.01;
			context.strokeStyle = '#FF0000';
			context.stroke();
		}
		
		_drawSolidCenter(ctx) {
			ctx.cleanTransform();
			const point = this._solidPack.position();;
			const context = ctx.get();
			context.beginPath();
			context.arc(point.x(), point.y(), 0.1, 0, 2 * Math.PI);
			context.lineWidth = 0.05;
			context.strokeStyle = '#0000FF';
			context.stroke();
		}
	}
}
