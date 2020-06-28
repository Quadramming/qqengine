import * as QQ from '../QQ.js';
import {SpriteMix} from './SpriteMix.js';
import {SolidMix} from './SolidMix.js';
import {PhysicsMix} from './PhysicsMix.js';
import {ActionableMix} from './ActionableMix.js';
import {DragAndDropMix} from './DragAndDropMix.js';
import {Subject} from './Subject.js';
import {Group} from './Group.js';
import {Stage} from './Stage.js';

export {
	Subject,
	Group,
	Stage,
	SpriteMix,
	SolidMix,
	ActionableMix,
	DragAndDropMix,
	PhysicsMix
};

export class Sprite extends
	QQ.mixins(SpriteMix, Subject)
{
}

export class Actionable extends
	QQ.mixins(ActionableMix, Sprite)
{
}

export class Solid extends
	QQ.mixins(SolidMix, Sprite)
{
}

export class SolidActor extends
	QQ.mixins(SolidMix, Actionable)
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
		if ( options.isActor === true ) {
			if ( options.solid ) {
				subj = new SolidActor(options);
			} else {
				subj = new Actionable(options);
			}
		} else {
			if ( options.solid ) {
				subj = new Solid(options);
			} else {
				subj = new Sprite(options);
			}
		}
		if ( options.tile ) {
			subj.setTileSprite(...options.tile);
		} else if ( options.clip ) {
			if ( options.clip instanceof Array ) {
				subj.setClipSprite(...options.clip);
			} else {
				subj.setClipSprite(options.clip);
			}
		} else if ( options.animate ) {
			subj.setAnimateSprite(...options.animate);
		} else if ( options.layer ) {
			subj.setLayersSprite(options.layer);
		}
		return subj;
	}
	return new Subject(options);
}
