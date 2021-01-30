// QQDOC

import * as QQ from '../QQ.js';
import {SPRITE as S} from '../CONST/SPRITE.js';
import {SpriteMix} from './SpriteMix.js';
import {SolidMix} from './SolidMix.js';
import {ActionableMix} from './ActionableMix.js';
import {DragAndDropMix} from './DragAndDropMix.js';
import {ElasticDnDMix} from './ElasticDnDMix.js';
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
	ElasticDnDMix
};

export class Sprite extends
	QQ.mixins(SpriteMix, Subject)
{
}

export class Actionable extends
	QQ.mixins(ActionableMix, Sprite)
{
}

export class ActionableGroup extends
	QQ.mixins(ActionableMix, Group)
{
}

export class Solid extends
	QQ.mixins(SolidMix, Sprite)
{
}

export class GhostSolid extends
	QQ.mixins(SolidMix, Subject)
{
}

export class SolidActor extends
	QQ.mixins(SolidMix, Actionable)
{
}

export class DnD extends
	QQ.mixins(DragAndDropMix, Sprite)
{
}

export class ElasticDnD extends
	QQ.mixins(ElasticDnDMix, Sprite)
{
}

export function make(options = {}) { // Create new subject
	if ( options.image || options.imageId ) {
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
			subj.setSprite(S.TILE, ...options.tile);
		} else if ( options.clip ) {
			if ( options.clip instanceof Array ) {
				subj.setSprite(S.CLIP, ...options.clip);
			} else {
				subj.setSprite(S.CLIP, options.clip);
			}
		} else if ( options.animate ) {
			subj.setSprite(S.ANIMATE, ...options.animate);
		} else if ( options.layer ) {
			subj.setSprite(S.LAYERS, options.layer);
		}
		return subj;
	}
	return new Subject(options);
} // new Subject or similar
