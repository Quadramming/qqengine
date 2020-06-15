import * as QQ from '../QQ.js';
import * as Subject from '../Subject/index.js';
import {Point} from '../primitives/index.js';
import {Container} from '../Container.js';

export class World {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(settings) {
		this._app = settings.app;
		this._seizure = settings.seizure;
		this._background = null;
		this._deltaAccum = 0;
		this._maxTicks = QQ.useDefault(settings.maxTicks, 1);
		this._timeStep = QQ.useDefault(settings.timeStep, 0.0166);
		this._pauseTime = QQ.useDefault(settings.pauseTime, 0.5);
		this._isPauseable = QQ.useDefault(settings.isPauseable, false);
		this._tickType = QQ.useDefault(settings.tickType, 'var');
		this._stage = new Container({
			app: this._app,
			size: new Point(10, 10),
			anchor: new Point(0.5, 0.5),
			angle: 0
		});
		this._stage.setWorld(this);
	}
	
	release() {
		this._seizure = null;
		this._stage.deleteMe();
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
				this._stage.tickSortByZ();
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
		if ( typeof background === 'string' ) {
			this._background = background;
		} else if ( background instanceof Image ) {
			this._background = new Subject.Sprite({
				image: background
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
			return subj instanceof Subject.Subject && subj.isHit(point);
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
