QQ.Seizures.Base = class Base {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(input) {
		this._app          = input.app;
		this._szManager    = input.szManager;
		this._camera       = new QQ.Camera(this._app.getHtmlCanvas());
		this._input        = new QQ.WorldPointer();
		this._hud          = new QQ.Seizures.FakeHud();
		this._hudRedirect  = false;
		if ( QQ.default(input.physicsWorld, false) ) {
			this._world    = new QQ.World.Physics(this._app);
		} else {
			this._world    = new QQ.World.Base(this._app);
		}
	}
	
	init() {
		// Executes after seizure became active
		this._input.setActions(
			point => this.clickDown(point),
			point => this.clickUp(point),
			point => this.click(point)
		);
		this._input.setScreenToWorld(
			point => this._camera.screenToWorld(point)
		);
	}
	
	//================================================================
	// Gets
	//================================================================
	
	getInput() {
		return this._input;
	}
	
	getCamera() {
		return this._camera;
	}
	
	getWorld() {
		return this._world;
	}
	
	//================================================================
	// Ticks & draw
	//================================================================

	tick(delta) {
	}
	
	draw() {
		const rect   = this._camera.getViewRect();
		const toDraw = this._world.getSubjectsInRect(rect);
		this._camera.draw(toDraw);
		this._hud.draw();
	}
	
	tickWorld(delta) {
		this._world.tickBase(delta);
	}
	
	tickScroll() {
		//const point = this._app.getPointer();
		//this._camera.tickScroll(mouse.x(), mouse.y(), this._isClicked);
	}
	
	//================================================================
	// Input
	//================================================================
	
	blockInput(value = true) {
		this._input.block(value);
		this._hud.blockInput(value);
	}
	
	pointerDown(point) {
		this._hudRedirect = this._hud.isHitSomething(point);
		if ( this._hudRedirect ) {
			this._hud.pointerDown(point);
		} else {
			this._input.down(point);
		}
	}
	
	pointerUp(point) {
		if ( this._hudRedirect ) {
			this._hud.pointerUp(point);
			this._hudRedirect = false;
		} else {
			this._input.up(point);
		}
	}
	
	pointerMove(point) {
		if ( this._hudRedirect ) {
			this._hud.pointerMove(point);
		} else {
			this._input.move(point);
		}
	}
	
	//================================================================
	// Actions
	//================================================================
	
	clickDown(point) {
		return this._doWithSubjIfHits(point, (subj, p) => {
			subj.onClickDown(p);
		});
	}
	
	clickUp(point) {
		return this._doWithSubjIfHits(point, (subj, p) => {
			subj.onClickUp(p);
		});
	}
	
	click(point) {
		if ( this._camera.isScrolling() ) {
			return false;
		}
		return this._doWithSubjIfHits(point, (subj, p) => {
			subj.onClick(p);
		});
	}
	
	//================================================================
	// Common
	//================================================================
	
	isHitSomething(point) {
		if ( point === false ) {
			return false;
		}
		const worldPoint = this._camera.screenToWorld(point);
		return this._world.getSubjectAtPoint(worldPoint);
	}
	
	_doWithSubjIfHits(point, fn) {
		const hited = this._world.getSubjectAtPoint(point);
		if ( hited ) {
			fn(hited, point);
			return true;
		}
		return false;
	}
	
	//================================================================
	// Hud
	//================================================================
	
	_setHud(sz, input) {
		this._hud = this._szManager.create(sz, input, false);
	}
	
};
