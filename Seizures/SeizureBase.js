QQ.Seizures.SeizureBase = class SeizureBase {
	
	constructor() {
		this._app          = QQ.application;
		this._camera       = new QQ.Camera(this._app.getCanvas());
		this._world        = new QQ.World();
		this._isClicked    = false;
		this._clickEpsilon = 5;
		this._hud          = null;
		this._startClick   = {};
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
		this._world.tick(delta);
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
		let isHudClick = false;
		if ( this._hud ) {
			isHudClick = this._hud.clickDownHud(x, y);
		}
		if ( ! isHudClick ) {
			this.clickDown(x, y);
			this._startClick = {x, y};
			this._isClicked  = true;
		}
	}
	
	clickDownHud(x, y) {
		return this.click(x, y);
	}
	
	clickUpBase(x, y) {
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
	
	_setHud(sz, input) {
		this._hud = QQ.seizures.create(sz, input);
	}
	
	_isPositionsClose(f, s) {
		if ( Math.min(f.x, f.y, s.x, s.y) < 0 ) {
			return false;
		}
		return  Math.abs(f.x - s.x) < this._clickEpsilon &&
				Math.abs(f.y - s.y) < this._clickEpsilon;
	}
	
};
