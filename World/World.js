import * as QQ from '../QQ.js';
import * as Subject from '../Subject/index.js';
import {Size, Point} from '../primitives/index.js';

export class World {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(options) {
		this._app = options.app;
		this._seizure = options.seizure;
		this._background = null;
		this._deltaAccum = 0;
		this._maxTicks = QQ.useDefault(options.maxTicks, 10);
		this._timeStep = QQ.useDefault(options.timeStep, 0.0166);
		this._pauseTime = QQ.useDefault(options.pauseTime, 0.5);
		this._isPauseable = QQ.useDefault(options.isPauseable, false);
		this._tickType = QQ.useDefault(options.tickType, 'var');
		if ( options.stageConstructor ) {
			this._stage = new options.stageConstructor({
				isSortByZOnTick: options.isSortByZOnTick,
				isSortByZOnAdd: options.isSortByZOnAdd,
				world: this
			});
		} else {
			this._stage = new Subject.Stage({
				isSortByZOnTick: options.isSortByZOnTick,
				isSortByZOnAdd: options.isSortByZOnAdd,
				world: this
			});
		}
	}
	
	destructor() {
		this._seizure = null;
		this._stage.destructor();
	}
	
	//================================================================
	// Tick
	//================================================================

	tick(delta) {
		if ( this._tickType === 'var' ) {
			this.tickVariableStep(delta);
		} else { // 'const'
			this.tickConstantStep(delta);
		}
	}

	tickVariableStep(delta) {
		if ( delta < this._pauseTime ) {
				this._stage.tick(delta);
				this.tickStep(delta);
		} else {
			if ( this._isPauseable ) {
				this._app.pause();
			}
		}
	}
	
	tickConstantStep(delta) {
		let ticksDone = 0;
		this._deltaAccum += delta;
		if ( this._deltaAccum < this._pauseTime ) {
			while ( this._deltaAccum > this._timeStep) {
					if ( ticksDone >= this._maxTicks ) {
						this._deltaAccum = 0;
						break;
					}
					this._stage.tick(this._timeStep);
					this.tickStep(this._timeStep);
					this._deltaAccum -= this._timeStep;
					ticksDone++;
			}
		} else {
			this._deltaAccum = 0;
			if ( this._isPauseable ) {
				this._app.pause();
			}
		}
	}
	
	tickStep(delta) {
	}
	
	//================================================================
	// Background
	//================================================================
	
	background(background) {
		if ( typeof background === 'string' && background[0] === '#') {
			this._background = background;
		} else if ( typeof background === 'string' ) {
			this._background = new Subject.Sprite({
				imageId: background
			});
		} else if ( background === null ) {
			this._background = null;
		}
		return this._background;
	}
	
	//================================================================
	// Subjects
	//================================================================
	
	clearStage() {
		this._stage.deleteSubjects();
	}
	
	addSubject(...subjs) {
		for ( const subj of subjs ) {
			this._stage.addSubject(subj);
		}
	}
	
	makeSubject(options) {
		const subj = Subject.make(options);
		this._stage.addSubject(subj);
		return subj;
	}
	
	getStage() {
		return this._stage;
	}
	
	getSubjectAtPoint(point) {
		const subjs = this.getSubjects((subj) => {
			return subj instanceof Subject.Subject && subj.isHit(point);
		});
		if ( subjs.length === 0 ) {
			return null;
		} else {
			return subjs.pop();
		}
	}
	
	getAllSubjectsAtPoint(point) {
		return this.getSubjects((subj) => {
			return subj instanceof Subject.Subject && subj.isHere(point);
		});
	}
	
	getSubjects(pred = () => true) {
		const subjs = [];
		this._stage.forAllSubjects((subj) => {
			if ( pred(subj) ) {
				subjs.push(subj);
			}
		});
		return subjs;
	}
	
	getSubject(pred = () => true) {
		const subjs = [];
		this._stage.forAllSubjects((subj) => {
			if ( pred(subj) ) {
				subjs.push(subj);
			}
		});
		if ( subjs.length === 0 ) {
			return null;
		}
		return subjs.shift();
	}
	
	//================================================================
	// Common
	//================================================================
	
	getInput() {
		return this._seizure.getInput();
	}
	
	setPauseable(v) {
		this._isPauseable = v;
	}
	
	setTickType(type) {
		this._tickType = type;
	}
	
	setTickTimeStep(time) {
		this._timeStep = time;
	}
	
}
