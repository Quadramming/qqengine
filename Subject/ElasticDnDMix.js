import * as QQ from '../QQ.js';
import * as Actions from '../Actions/index.js';
import {Point} from '../primitives/index.js';
import {DragAndDropMix} from './DragAndDropMix.js';
import {ActionableMix} from './ActionableMix.js';

export function ElasticDnDMix(base) {
	return class ElasticDnDMix extends QQ.mixins(DragAndDropMix, ActionableMix, base) {
		
		_onDnDMove(worldPoint, offset) { // {O}
			const point = Point.subtraction(worldPoint, this.getDragStart());
			if ( this.getAction() instanceof Actions.WalkTo ) {
				this.getAction().set(point);
			} else {
				this.setAction(new Actions.WalkTo({
					subj: this,
					to: point
				}));
			}
		} // void
		
	}
}
