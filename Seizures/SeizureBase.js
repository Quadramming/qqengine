QQ.Seizures.Base = class Base {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(input) {
		this._app = input.app;
		this._szManager = input.szManager;
		this._input = new QQ.WorldPointer();
		this._hud = new QQ.Seizures.FakeHud();
		this._parent = QQ.default(input.parent, null);
		this._hudRedirect = false;
		input.isPauseable = QQ.default(input.isPauseable, false);
		const worldInput = {
			app: this._app,
			maxTicks: input.maxTicks,
			timeStep: input.timeStep,
			seizure: this,
			isPauseable: input.isPauseable
		};
		if ( QQ.default(input.physicsWorld, false) ) {
			this._world = new QQ.World.Physics(worldInput);
		} else {
			this._world = new QQ.World.Base(worldInput);
		}
		this._camera = new QQ.Camera(
			this._app.getHtmlCanvas(),
			this._world
		);
		this._isScrollable = QQ.default(input.scrolling, false);
		this._epsilon = QQ.default(input.epsilon, 1);
		this._epsilon = this._camera.widthPercentsToPx(this._epsilon);
		this._scroll = {
			isActive: false,
			isClicked: false,
			start: new QQ.Point(NaN),
			world: new QQ.Point(NaN),
			screen: new QQ.Point(NaN)
		};
	}
	
	init() {
		// Executes after seizure became active
		this._input.setActions(
			point => this.clickDown(point),
			point => this.clickUp(point),
			point => this.click(point)
		);
		this._input.setWorldFromScreen(
			point => this._camera.getWorldFromScreen(point)
		);
	}
	
	//================================================================
	// Gets / Sets
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
		this._hud.tick(delta);
		this._input.update();
		this._camera.tick();
		if ( this._isScrollable ) {
			this.tickScroll(delta);
		}
		this._world.tick(delta);
	}
	
	draw() {
		this._camera.draw();
		this._hud.draw();
	}
	
	//================================================================
	// Scroll
	//================================================================
	
	isScrolling() {
		return this._scroll.isActive;
	}
	
	tickScroll() {
		const scroll    = this._scroll;
		const isClicked = this._input.isClicked();
		const screen    = this._input.getScreenPoint();
		const world     = this._input.getWorldPoint();
		if ( screen ) {
			if ( ! scroll.isClicked && isClicked ) {
				scroll.isClicked = true;
				scroll.isActive  = false;
				scroll.start.copy(screen);
				return;
			}
			if ( scroll.isClicked && ! isClicked ) {
				scroll.isClicked = false;
				scroll.isActive  = false;
				return;
			}
			const isClose = screen.isNear(scroll.start, this._epsilon);
			if ( isClicked && ! scroll.isActive && ! isClose ) {
				scroll.isActive = true;
				scroll.world.copy(world);
				return;
			}
			if ( scroll.isActive ) {
				const offset = new QQ.Point(
					scroll.world.x() - world.x(),
					scroll.world.y() - world.y()
				);
				this._camera.addPosition(offset);
			}
		} else {
			scroll.isClicked = false;
			scroll.isActive  = false;
			scroll.screen.set(NaN);
			scroll.world.set(NaN);
		}
	}
	
	//================================================================
	// Input
	//================================================================
	
	blockInput(value = true) {
		this._input.block(value);
		this._hud.blockInput(value);
	}
	
	resetInput() {
		this._input.reset();
		this._hud.resetInput();
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
		if ( this.isScrolling() ) {
			return false;
		}
		return this._doWithSubjIfHits(point, (subj, p) => {
			subj.onClickUp(p);
		});
	}
	
	click(point) {
		if ( this.isScrolling() ) {
			return false;
		}
		return this._doWithSubjIfHits(point, (subj, p) => {
			subj.onClick(p);
		});
	}
	
	//================================================================
	// Common
	//================================================================
	
	onBackButton() {
	}
	
	isHitSomething(point) {
		if ( point === false ) {
			return false;
		}
		const worldPoint = this._camera.getWorldFromScreen(point);
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
		input.parent = this;
		this._hud = this._szManager.create(sz, input, false);
	}
	
};
