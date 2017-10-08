QQ.World = {};

QQ.World.Base = class Base {
	
	constructor(settings) {
		this._app        = settings.app;
		this._subjects   = []; // Top at low index
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
				for ( const subj of this._subjects ) {
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
	
	setBackground(url) {
		this._background = new QQ.Subject.Sprite(this._app, {imgSrc: url});
	}
	
	addSubject(subj) {
		this._subjects.unshift(subj);
		subj.setWorld(this);
		this._sortSubjectsByZ();
	}
	
	getSubjectsInRect(rect) {
		this._sortSubjectsByZ();
		const result = [];
		for ( const subj of this._subjects ) {
			if ( rect.isIntersect(subj.getBounds()) ) {
				result.push(subj);
			}
		}
		if ( this._background ) {
			this._background.fitInRect(rect);
			result.push(this._background);
		}
		return result;
	}
	
	getSubjectAtPoint(x, y) {
		this._sortSubjectsByZ();
		for ( const subj of this._subjects ) {
			if ( subj.isClickable() ) {
				if ( subj.isHit(x, y) ) {
					return subj;
				}
			}
		}
	}
	
	getAllSubjectsAtPoint(x, y) {
		this._sortSubjectsByZ();
		const subjs = [];
		for ( const subj of this._subjects ) {
			if ( subj.isHit(x, y) ) {
				subjs.push(subj);
			}
		}
		return subjs;
	}
	
	getSubjects(pred = () => true) {
		this._sortSubjectsByZ();
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
	
	_sortSubjectsByZ() {
		const copy = this._subjects.slice();
		this._subjects.sort((a, b) => {
			if ( a.getZ() === b.getZ() ) {
				return copy.indexOf(a) - copy.indexOf(b);
			}
			return b.getZ() - a.getZ();
		});
	}
	
};
