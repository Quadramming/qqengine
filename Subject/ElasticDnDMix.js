import * as QQ from '../QQ.js';
import {Point, Rect} from '../primitives/index.js';
import * as Actions from '../Actions/index.js';

// Use on DragAndDropMix
export function ElasticDnDMix(base) {
	return class ElasticDnDMix extends base {
		
		onDragMove(worldPoint, offset) { // {O}
			const point = Point.subtraction(worldPoint, this.getDragStart());
			if ( this.getAction() instanceof Actions.WalkTo ) {
				this.getAction().setTarget(point);
			} else {
				this.setAction(new Actions.WalkTo({
					subj: this,
					to: point
				}));
			}
		}
		
	}
}
