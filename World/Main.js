QQ.World = {};

QQ.World.Main = class Main {
	
	constructor(app, settings = {}) {
		this._app        = app;
		this._subjects   = [];
		this._background = null;
		this._deltaAccum = 0;
		// Default
		this._maxTicks   = 1;
		this._timeStep   = 0.0166;
		this._pauseTime  = 0.5;
		this._pauseable  = false;
		this.setSettings(settings);
	}
	
	tickBase(delta) {
		let ticksDone = 0;
		this._deltaAccum += delta;
		if ( this._deltaAccum < this._pauseTime ) {
			if ( this._deltaAccum > (this._maxTicks+1)*this._timeStep ) {
				this._deltaAccum = this._maxTicks * this._timeStep +
					this._deltaAccum % this._timeStep;
			}
			while ( this._deltaAccum > this._timeStep ) {
				this._deltaAccum -= this._timeStep;
				for ( let subj of this._subjects ) {
					subj.tick(this._timeStep);
				}
				this.tick(this._timeStep);
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
	
	tick(delta) {
	}
	
	addBackground(url) {
		this._background = new QQ.Subject.Sprite(this._app, url);
	}
	
	addSubject(subj) {
		this._subjects.push(subj);
	}
	
	unshiftSubject(subj) {
		this._subjects.unshift(subj);
	}
	
	getSubjectsInRect(rect) {
		const result = [];
		if ( this._background ) {
			this._background.fitInRect(rect);
			result.push(this._background);
		}
		for ( let subj of this._subjects ) {
			if ( QQ.Math.isIntersect(rect, subj.getBoundsRect()) ) {
				result.push(subj); 
			}
		}
		return result;
	}
	
	getSubjectAtPoint(x, y) {
		for ( let i = this._subjects.length-1 ; i >= 0 ; --i ) {
			const subj = this._subjects[i];
			if ( subj.isClickable() ) {
				if ( subj.isHit(x, y) ) {
					return subj;
				}
			}
		}
	}
	
	getSubjects(pred = () => true) {
		const subjs = [];
		this._subjects.forEach(function (subj) {
			if ( pred(subj) ) {
				subjs.push(subj);
			}
		});
		return subjs;
	}
	
	setPauseable(v) {
		this.setSettings({pauseable: v});
	}
	
	setSettings(settings = {}) {
		if ( typeof(settings.maxTicks) === 'number' ) {
			this._maxTicks   = settings.maxTicks;
		}
		if ( typeof(settings.timeStep) === 'number' ) {
			this._timeStep   = settings.timeStep;
		}
		if ( typeof(settings.pauseTime) === 'number' ) {
			this._pauseTime  = settings.pauseTime;
		}
		if ( typeof(settings.pauseable) === 'boolean' ) {
			this._pauseable  = settings.pauseable;
		}
	}
	
	deleteSubject(subj) {
		const i = this._subjects.indexOf(subj);
		if ( i > 0 ) {
			this._subjects.splice(i, 1);
		}
	}
	
};
