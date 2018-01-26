QQ.World = {};

QQ.World.Base = class Base {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(settings) {
		this._app = settings.app;
		this._seizure = settings.seizure;
		this._background = null;
		this._deltaAccum = 0;
		this._maxTicks = QQ.default(settings.maxTicks, 7);
		this._timeStep = QQ.default(settings.timeStep, 0.0166);
		this._pauseTime = QQ.default(settings.pauseTime, 0.5);
		this._isPauseable = QQ.default(settings.isPauseable, false);
		this._tickType = QQ.default(settings.isPauseable, 'variable');
		this._stage = new QQ.Container({
			app: this._app,
			size: new QQ.Point(10, 10),
			anchor: new QQ.Point(0.5, 0.5),
			angle: 0
		});
		this._stage.setWorld(this);
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
	
	setBackground(img) {
		this._background = new QQ.Subject.Sprite({
			app: this._app,
			img: img
		});
	}
	
	getBackground() {
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
	
	getStage() {
		return this._stage;
	}
	
	getSubjectAtPoint(point) {
		const subjs = this.getSubjects((subj) => {
			return subj instanceof QQ.Subject.Base && subj.isHit(point);
		});
		if ( subjs.length === 0 ) {
			return null;
		} else {
			return subjs.pop();
		}
	}
	
	getAllSubjectsAtPoint(point) {
		return this.getSubjects((subj) => {
			return subj instanceof QQ.Subject.Base && subj.isHit(point);
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
	
};
