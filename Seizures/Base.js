QQ.Seizures.Base = class Base {
	
	constructor(app, physicsWorld = false) {
		this._app          = app;
		this._camera       = new QQ.Camera(app.getCanvas());
		if ( physicsWorld ) {
			this._world    = new QQ.World.Physics(app);
		} else {
			this._world    = new QQ.World.Main(app);
		}
		this._isClicked    = false;
		this._hud          = null;
		this._startClick   = {};
		this._blockInput   = false;
	}
	
	blockInput(value = true) {
		this._blockInput = value;
	}
	
	//================================================================
	
	tickBase(delta) {
		if ( this._isClicked && ! this._app.isMouseInCanvas() ) {
			this.clickUpBase(-1, -1);
		}
		this.tick(delta);
	}
	
	tick() {
	}
	
	tickWorld(delta) {
		this._world.tickBase(delta);
	}
	
	tickScroll() {
		let mouse = this._app.getMouseXY();
		this._camera.tickScroll(mouse.x, mouse.y, this._isClicked);
	}
	
	//================================================================
	
	draw() {
		const rect   = this._camera.getViewRect();
		const toDraw = this._world.getSubjectsInRect(rect);
		this._camera.draw(toDraw);
		if ( this._hud ) {
			this._hud.draw();
		}
	}
	
	//================================================================
	
	isClicked() {
		return this._isClicked;
	}
	
	clickDownBase(x, y) {
		if ( this._blockInput ) {
			return;
		}
		let isHudClick = false;
		if ( this._hud ) {
			isHudClick = this._hud._clickDownHud(x, y);
		}
		if ( ! isHudClick ) {
			this.clickDown(x, y);
			this._startClick = {x, y};
			this._isClicked  = true;
		}
	}
	
	clickUpBase(x, y) {
		if ( this._blockInput ) {
			return;
		}
		if ( this._isClicked ) {
			const isClose   = this._isPositionsClose(this._startClick, {x, y});
			const isScroll  = this._camera.isScrolling();
			if ( isClose && ! isScroll ) {
				this.click(x, y);
			}
			this.clickUp(x, y);
			this._isClicked = false;
		}
	}
	
	clickDown(x, y) {
	}
	
	clickUp(x, y) {
	}
	
	click(x, y) {
		return this.clickSubj(x, y);
	}
	
	clickSubj(x, y) {
		const point   = this._camera.getWorldPoint(x, y);
		const clicked = this._world.getSubjectAtPoint(point.x, point.y);
		if ( clicked ) {
			clicked.click();
			return true;
		}
		return false;
	}
	
	//================================================================
	
	_clickDownHud(x, y) {
		return this.click(x, y);
	}
	
	_isPositionsClose(f, s) {
		let epsilon = this._camera.getEpsilon();
		if ( Math.min(f.x, f.y, s.x, s.y) < 0 ) {
			return false;
		}
		return  Math.abs(f.x - s.x) < epsilon &&
				Math.abs(f.y - s.y) < epsilon;
	}
	
	_setHud(sz, input) {
		this._hud = this._app.sz().create(sz, input);
	}
	
};
