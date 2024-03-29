// QQDOC

import * as QQ from '../QQ.js';
import * as Subject from '../Subject/index.js';
import {TickerVary} from './TickerVary.js';
import {TickerConst} from './TickerConst.js';
import {TICK_TYPE} from '../CONST/index.js';

export class World {
	
	#background = null;
	#ticker;
	#stage;
	
	constructor(options = {}) {
		const tickType = options.tickType ?? TICK_TYPE.VARY;
		if ( tickType === TICK_TYPE.VARY ) {
			this.#ticker = new TickerVary(options.ticker);
		} else { // TICK_TYPE.CONST
			this.#ticker = new TickerConst(options.ticker);
		}
		const stageClass = options.stageConstructor ?? Subject.Stage;
		this.#stage = new stageClass({
			world: this,
			isSortByZOnTick: options.isSortByZOnTick,
			isSortByZOnAdd: options.isSortByZOnAdd,
		});
	}
	
	destructor() {
		this.#stage.destructor();
	}
	
	draw(wcontext) {
		this.#stage.draw(wcontext);
	} // void
	
	tick(delta) {
		this.#ticker.tick(delta, delta => {
			this.#stage.tick(delta);
		});
	} // void

	clearStage() {
		this.#stage.deleteSubjects();
	} // void
	
	addSubject(...subjs) { // Add subject or subjects to stage
		this.#stage.addSubject(...subjs);
	} // void
	
	makeSubject(options) { // Make and add object to this world by options
		options.addTo = this;
		return Subject.make(options);
	} // new Subject
	
	getStage() {
		return this.#stage;
	} // Subject
	
	getSubjects(predicate) {
		return this.#stage.getAllSubjects(predicate);
	} // new array of Subjects
	
	getSubject(predicate) {
		return this.#stage.getSubject(predicate);
	} // Subject | null
	
	getSubjectsAtPoint(point) {
		return this.getSubjects( subj =>
			subj instanceof Subject.Subject && subj.isContains?.(point)
		);
	} // new array of Subjects
	
	clickableAtPoint(point) { // Shortcut for getClickableAtPoint()
		return this.getClickableAtPoint(point);
	} // Subject | null
	
	getClickableAtPoint(point) {
		const subjs = this.getSubjects( subj =>
			subj instanceof Subject.Subject && subj.couldClick?.(point)
		);
		return subjs.length ? QQ.getLast(subjs) : null;
	} // Subject | null
	
	background(background) { // {F} Can take '#ffffff', 'imageid' or null
		if ( typeof background === 'string' && background[0] === '#') {
			this.#background = background;
		} else if ( typeof background === 'string' ) {
			this.#background = new Subject.Sprite({
				imageId: background
			});
		} else if ( background === null ) {
			this.#background = null;
		}
		return this.#background;
	} // string | null | Subject
	
}
