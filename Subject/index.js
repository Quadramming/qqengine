import * as QQ from '../QQ.js';
import {SpriteMix} from './SpriteMix.js';
import {PhysicsMix} from './PhysicsMix.js';
import {ActionableMix} from './ActionableMix.js';
import {DragAndDropMix} from './DragAndDropMix.js';
import {Subject} from './Subject.js';

export {Subject};

export class Sprite extends
	QQ.mixins(SpriteMix, Subject)
{
}

export class Actionable extends
	QQ.mixins(ActionableMix, Sprite)
{
}

export class Physics extends
	QQ.mixins(PhysicsMix, Sprite)
{
}

export class DnD extends
	QQ.mixins(DragAndDropMix, Sprite)
{
}

export function make(options = {}) {
	if ( options.image ) {
		let subj = null;
		if ( options.isActionable === false ) {
			subj = new Sprite(options);
		} else {
			subj = new Actionable(options);
		}
		if ( options.tile ) {
			subj.setTileSprite(...options.tile);
		} else if ( options.clip ) {
			subj.setClipSprite(...options.clip);
		}
		return subj;
	}
	return new Subject(options);
}
