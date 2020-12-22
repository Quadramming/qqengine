// QQDOC

import * as Pack from '../Pack/index.js';
import * as QQ from '../QQ.js';
import * as matrix from '../matrix.js';
import * as maths from '../maths.js';
import {Rect, Point} from '../primitives/index.js';
import {RelationshipMix} from './RelationshipMix.js';
import {SortByZMix} from './SortByZMix.js';
import {MatrixMix} from './MatrixMix.js';

export class Subject extends
	QQ.mixins(MatrixMix, SortByZMix, RelationshipMix, Pack.Pack)
{
	
	_bgColor; // Background color
	_tickFn; // Tick function
	_onClick; // On click
	_isClickable; // Is clickable
	_isDrawDebug; // Draw debug shapes
	
	constructor(options) {
		super(options);
		this.#reset(options);
	}
	
	reset(options) {
		super.reset(options);
		this.#reset(options);
	}
	
	#reset(options = {}) {
		this._bgColor = options.bgColor ?? null;
		this._isDrawDebug = options.isDrawDebug ?? false;
		this._tickFn = options.tickFn ?? null;
		if ( options.onClick ) {
			this._onClick = options.onClick;
			this._isClickable = true;
		} else {
			this._onClick = null;
			this._isClickable = options.isClickable ?? false;
		}
		options.init?.call(this);
		if ( options.selfAdd === true ) {
			this.parent().addSubject(this);
		}
	}

	
	tick(delta) {
		super.tick(delta);
		this._tickFn?.(delta);
		this.forSubjects( subj => subj.tick(delta) );
	}

	bgColor(color) { // {F} Set background color
		if ( color !== undefined ) {
			this._bgColor = color;
		}
		return this._bgColor;
	} // string
	
	draw(context) {
		if ( this._isDrawDebug ) {
			this._drawWorldBorder(context);
			this._drawLocalBorder(context);
			this._drawCenter(context);
		}
		if ( this._bgColor ) {
			this.#drawBgColor(context);
		}
		this.forSubjects( subj => subj.draw(context) );
	}
	
	onClickDown(worldPoint) {
		//* DEBUG
		c("World:" + worldPoint);
		let local = this.worldToLocal(worldPoint);
		c("worldToLocal:" + local);
		const world = this.localToWorld(local);
		c("localToWorld:" + world);
		const parent = this.localToParent(local);
		c("localToParent:" + parent);
		local = this.parentToLocal(parent);
		c("parentToLocal:" + local);
		//*/
	}
	
	onClickUp(worldPoint) {
	}
	
	onClick(worldPoint) {
		if ( this._onClick ) {
			this._onClick(worldPoint);
		}
	}
	
	isClickable() {
		return this._isClickable;
	}
	
	isHit(worldPoint) {
		if ( ! this._isClickable ) {
			// TOFIX why isClickable affects result?
			return false;
		}
		const local = this.worldToLocal(worldPoint);
		const rect = this._getLocalRect();
		return rect.isContains(local);
	}
	
	getWorldPosition() {
		return this.localToWorld(new Point(0, 0));
	}
	
	getWorld() {
		return this.parent().getWorld();
	}
	
	getBounds() {
		const rect = this._getLocalRect();
		return Rect.fromPoints(
			this.localToWorld(new Point(rect.left(), rect.top())),
			this.localToWorld(new Point(rect.right(), rect.top())),
			this.localToWorld(new Point(rect.left(), rect.bottom())),
			this.localToWorld(new Point(rect.right(), rect.bottom()))
		);
	}
	
	addPosition(offset) {
		this.position().add(offset);
	}
	
	movePosition(offset) {
		this.addPosition(offset);
	}
	
	fitInRect(rect) {
		this.anchor().set(0, 0);
		this.size().set(
			rect.right() - rect.left(),
			rect.bottom() - rect.top()
		);
		this.position().set(rect.left(), rect.top());
		this.angle(0);
		this.scale().set(1, 1);
	}
	
	_getLocalRect() {
		return new Rect(
			-this.size().x()*this.anchor().x(),
			-this.size().y()*this.anchor().y(),
			this._size.w(),
			this._size.h()
		);
	}
	
	_drawWorldBorder(context) {
		context.cleanTransform();
		const rect = this.getBounds();
		const ctx = context.get();
		ctx.beginPath();
		ctx.rect(
			rect.x(),
			rect.y(),
			rect.w(),
			rect.h()
		);
		ctx.lineWidth = 0.1;
		ctx.strokeStyle = '#FF00FF';
		ctx.stroke();
	}
	
	_drawLocalBorder(context) {
		context.transform( this.getMatrix() );
		const rect = this._getLocalRect();
		const ctx = context.get();
		ctx.beginPath();
		ctx.rect(
			rect.x(),
			rect.y(),
			rect.w(),
			rect.h()
		);
		ctx.lineWidth = 0.1;
		ctx.strokeStyle = '#0000FF';
		ctx.stroke();
	}
	
	_drawCenter(context) {
		context.cleanTransform();
		let point = this.localToWorld(Point.ZERO());
		const ctx = context.get();
		ctx.beginPath();
		ctx.arc(point.x(), point.y(), 0.1, 0, 2 * Math.PI);
		ctx.lineWidth = 0.05;
		ctx.strokeStyle = '#0000FF';
		ctx.stroke();
	}
	
	#drawBgColor(context) {
		context.transform( this.getMatrix() );
		const ctx = context.get();
		const rect = this._getLocalRect();
		ctx.fillStyle = this._bgColor;
		ctx.fillRect(rect.x(), rect.y(), rect.w(), rect.h());
	}
	
}
