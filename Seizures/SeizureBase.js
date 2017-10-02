QQ.WorldPointer = class WorldPointer {
	
	constructor(camera) {
		this._camera      = camera;
		this._isBlocked   = false;
		this._position    = this._calcPosition(NaN);
		this._startPoint  = this._calcPosition(NaN);
		this._isClicked   = false;
		this._isNearStart = false;
	}
	
	reset() {
		this._position    = this._calcPosition(NaN);
		this._startPoint  = this._calcPosition(NaN);
		this._isClicked   = false;
		this._isNearStart = false;
	}
	
	block(value) {
		this._isBlocked = value;
		this.reset();
	}
	
	isClicked() {
		return this._isClicked;
	}
	
	down(point) {
		if ( this._isBlocked ) {
			return;
		}
		if ( point.isCorrect() ) {
			this._isClicked   = true;
			this._isNearStart = true;
			this._startPoint  = this._calcPosition(point);
			this._position    = this._calcPosition(point);
			c('Down ' + this._position.world.x());
		} else {
			this.reset();
		}
	}
	
	up(point) {
		if ( this._isBlocked ) {
			return;
		}
		if ( point.isCorrect() ) {
			this._position = this._calcPosition(point);
		}
		if ( this._isClicked ) {
			c('Up ' + this._position.world.x());
		}
		if ( this._isClicked && this._isNearStart ) {
			c('Click ' + this._position.world.x());
		}
		if ( point.isNaN() ) {
			this._position = this._calcPosition(NaN);
		}
		this._startPoint  = this._calcPosition(NaN);
		this._isClicked   = false;
		this._isNearStart = false;
	}
	
	move(point) {
		if ( this._isBlocked ) {
			return;
		}
		if ( point.isCorrect() ) {
			this._position = this._calcPosition(point);
			if ( this._isClicked && this._isNearStart ) {
				const isFar = ! this._position.screen.isNear(
					this._startPoint.screen, 10
				);
				if ( isFar ) {
					this._isNearStart = false;
				}
			}
		} else {
			this.reset();
		}
	}
	
	_calcPosition(point) {
		if ( Number.isNaN(point) || point.isNaN() ) {
			return {
				screen: new QQ.Point(NaN),
				world:  new QQ.Point(NaN)
			};
		} else {
			return {
				screen: point,
				world:  this._camera.screenToWorld(point)
			};
		}
	}
	
};

QQ.Seizures.FakeHud = class FakeHud {
	
	draw() {
	}
	
	blockInput() {
	}
	
	isHitSomething() {
		return false;
	}
	
};

QQ.Seizures.Base = class Base {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(input) {
		const physicsWorld = QQ.default(input.physicsWorld, false);
		this._app          = input.app;
		this._szManager    = input.szManager;
		this._camera       = new QQ.Camera(this._app.getHtmlCanvas());
		this._input        = new QQ.WorldPointer(this._camera);
		if ( physicsWorld ) {
			this._world    = new QQ.World.Physics(this._app);
		} else {
			this._world    = new QQ.World.Base(this._app);
		}
		this._isClicked    = false;
		this._hud          = new QQ.Seizures.FakeHud();
		this._hudRedirect  = false;
		this._startClick   = {};
		this._blockInput   = false;
	}
	
	init() {
		// Executes after seizure became active
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
		if ( this._isClicked && ! this._app.isMouseInCanvas() ) {
			this.clickUpBase(-1, -1);
		}
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
		const point = this._app.getPointer();
		this._camera.tickScroll(mouse.x(), mouse.y(), this._isClicked);
	}
	
	//================================================================
	// Input
	//================================================================
	
	blockInput(value = true) {
		this._input.block(value);
		this._hud.blockInput(value);
	}
	
	pointerMove(point) {
		if ( this._hudRedirect ) {
			this._hud.pointerMove(point);
		} else {
			this._input.move(point);
		}
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
	
	clickDownBase() {
		let isHudClick = false;
		//isHudClick = this._hud._clickDownHud(x, y);
		if ( ! isHudClick ) {
			this.clickDown(x, y);
			this._startClick = {x, y};
			this._isClicked  = true;
		}
	}
	
	clickUpBase(point) {
		const x = point.x();
		const y = point.y();
		if ( x < 0 || y < 0 ) {
			return;
		}
		if ( this._blockInput ) {
			return;
		}
		if ( this._isClicked ) {
			const isClose  = this._isPositionsClose(this._startClick, {x, y});
			const isScroll = this._camera.isScrolling();
			if ( isClose && ! isScroll ) {
				this.click(x, y);
			}
			this.clickUp(x, y);
			this._isClicked = false;
		}
	}
	
	clickDown(x, y) {
		return this._doWithSubjIfHits(x, y, (subj, worldX, worldY) => {
			subj.onClickDown(worldX, worldY);
		});
	}
	
	clickUp(x, y) {
		return this._doWithSubjIfHits(x, y, (subj, worldX, worldY) => {
			subj.onClickUp(worldX, worldY);
		});
	}
	
	click(x, y) {
		return this._doWithSubjIfHits(x, y, (subj, worldX, worldY) => {
			subj.onClick(worldX, worldY);
		});
	}
	
	isHitSomething(point) {
		if ( point.isNaN() ) {
			return false;
		}
		const point = this._camera.getWorldPoint(point.x(), point.y());
		return this._world.getSubjectAtPoint(point.x()	, point.y());
	}
	
	_doWithSubjIfHits(x, y, fn) {
		const point = this._camera.getWorldPoint(x, y);
		const hited = this._world.getSubjectAtPoint(point.x, point.y);
		if ( hited ) {
			fn(hited, point.x, point.y);
			return true;
		}
		return false;
	}
	
	//================================================================
	
	_isPositionsClose(f, s) {
		const epsilon = this._camera.getEpsilon();
		if ( Math.min(f.x, f.y, s.x, s.y) < 0 ) {
			return false;
		}
		return Math.abs(f.x - s.x) < epsilon &&
			   Math.abs(f.y - s.y) < epsilon;
	}
	
	//================================================================
	// Hud
	//================================================================
	
	_setHud(sz, input) {
		this._hud = this._szManager.create(sz, input, false);
	}
	
};
