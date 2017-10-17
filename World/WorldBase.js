QQ.World = {};

QQ.World.Base = class Base {
	
	constructor(settings) {
		this._app        = settings.app;
		this._background = null;
		this._deltaAccum = 0;
		// Default
		this._maxTicks   = QQ.default(settings.maxTicks,  1);
		this._timeStep   = QQ.default(settings.timeStep,  0.0166);
		this._pauseTime  = QQ.default(settings.pauseTime, 0.5);
		this._pauseable  = QQ.default(settings.pauseable, false);
		this._stage      = new QQ.Container({
			app:    this._app,
			size:   new QQ.Point(10, 10),
			anchor: new QQ.Point(0.5, 0.5),
			angle:  0
		});
		this._stage.setWorld(this);
	}
	
	tick(delta) {
		let ticksDone = 0;
		this._deltaAccum += delta;
		if ( this._deltaAccum < this._pauseTime ) {
			if ( this._deltaAccum > (this._maxTicks+1)*this._timeStep ) {
				this._deltaAccum = this._maxTicks * this._timeStep +
					this._deltaAccum % this._timeStep;
			}
			while ( this._deltaAccum > this._timeStep ) {
				this._deltaAccum -= this._timeStep;
				this._stage.tick(delta);
				this.tickStep(this._timeStep);
				ticksDone++;
			}
		} else {
			this._deltaAccum = 0;
			if ( this._pauseable ) {
				this._app.pause();
			}
		}
		//c(ticksDone);
	}
	
	tickStep(delta) {
	}
	
	setBackground(img) {
		this._background = new QQ.Subject.Sprite({
			app: this._app,
			img: img
		});
	}
	
	getBackground() {
		return this._background;
	}
	
	addSubject(subj) {
		this._stage.addSubject(subj);
	}
	
	getStage() {
		return this._stage;
	}
	
	getSubjectAtPoint(point) {
		const subjs = this.getSubjects((subj) => {
			return subj.isHit(point);
		});
		if ( subjs.length === 0 ) {
			return null;
		} else {
			return subjs.pop();
		}
	}
	
	getAllSubjectsAtPoint(point) {
		return this.getSubjects((subj) => {
			return subj.isHit(point);
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
	
	setPauseable(v) {
		this._pauseable = v;
	}
	
	/*
	_sortSubjectsByZ() {
		const copy = this._subjects.slice();
		this._subjects.sort((a, b) => {
			if ( a.getZ() === b.getZ() ) {
				return copy.indexOf(a) - copy.indexOf(b);
			}
			return b.getZ() - a.getZ();
		});
	}
	*/
	
};
