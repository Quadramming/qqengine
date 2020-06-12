import * as QQ from '../QQ.js';
import {Point} from '../Point.js';

export function DragAndDropMix(base) {
	return class DragAndDropMix extends base {
		
		constructor(options) {
			super(options);
			this._input = null;
			this._dragAndDrop = {
				isDraging: false,
				point: new Point(NaN)
			};
			this._clip = QQ.useDefault(options.clip, null);
		}
		
		setWorld(world) {
			super.setWorld(world);
			this._input = this._world.getInput();
		}
		
		onClickDown(point) {
			super.onClickDown(point);
			this._dragAndDrop.isDraging = true;
			this._dragAndDrop.point.copy(
				this.worldToLocalPoint(point)
			);
		}
		
		onClickUp(point) {
			super.onClickUp(point);
			this.onDrop();
			this._dragAndDrop.isDraging = false;
		}
		
		onDrop() {
		}
		
		tick(delta) {
			super.tick(delta);
			if ( this._dragAndDrop.isDraging ) {
				if ( this._input.isClicked() ) {
					const DnD = this._dragAndDrop;
					const point = this._input.getWorldPoint();
					this.setPosition( new Point(
						point.x() - DnD.point.x(),
						point.y() - DnD.point.y(),
					));
				} else {
					this.onClickUp();
					this._dragAndDrop.isDraging = false;
				}
			}
		}
		
		setClip(rect) {
			this._clip.copy(rect);
		}
		
		setPosition(point) {
			super.setPosition(point);
			this._fixClip();
		}
		
		_fixClip() {
			if ( this._clip !== null ) {
				if ( this._position.x() > this._clip.right() ) {
					this._position.x( this._clip.right() );
				}
				if ( this._position.x() < this._clip.left() ) {
					this._position.x( this._clip.left() );
				}
				if ( this._position.y() < this._clip.top() ) {
					this._position.y( this._clip.top() );
				}
				if ( this._position.y() > this._clip.bottom() ) {
					this._position.y( this._clip.bottom() );
				}
			}
		}
		
	}
}
