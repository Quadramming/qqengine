QQ.Application = class Application {

	constructor() {
		this._canvas     = new QQ.Canvas('QQApplicationCanvas', 600, 800);
		this._fpsCounter = new QQ.FpsCounter();
		this._time       = new QQ.Time();
		this._mouse      = new QQ.Mouse();
		this._touch      = new QQ.Touch(this._mouse);
		this._storage    = new QQ.Storage();
		QQ.Sprite.globalContext(this._canvas.getContext());
	}
	
	init() {
		QQ.seizures.set('Main');
		
		this._mouse.setM1DownCB( () => {
			if ( this.isMouseInCanvas() ) {
				let {x, y} = this._getMousePosition();
				QQ.seizures.clickDown(x, y);
			}
		});
		this._mouse.setM1UpCB( () => {
			if ( this.isMouseInCanvas() ) {
				let {x, y} = this._getMousePosition();
				QQ.seizures.clickUp(x, y);
			}
		});
		this._process();
	}
	
	storage(key, value) {
		return this._storage.storage(key, value);
	}
	
	pause() {
		QQ.seizures.popUp('Pause');
	}
	
	getCanvas() {
		return this._canvas.getCanvas();
	}
	
	getContext() {
		return this._canvas.getContext();
	}
	
	isM1Pressed() {
		return this._mouse.getM1();
	}
	
	getMouseXY() {
		if ( this.isMouseInCanvas() ) {
			return this._getMousePosition();
		}
		return { x: -1, y: -1 };
	}
	
	getTime() {
		return this._time;
	}
	
	isMouseInCanvas() {
		let canvas = this._canvas.getCanvas();
		let {x, y} = this._getMousePosition();
		let isHitX = 0 < x && x < canvas.width;
		let isHitY = 0 < y && y < canvas.height;
		return isHitX && isHitY;
	}
	
	_getMousePosition() {
		let canvas = this._canvas.getCanvas();
		let x      = this._mouse.getX() - canvas.offsetLeft;
		let y      = this._mouse.getY() - canvas.offsetTop;
		return {x, y};
	}
	
	_process(time) {
		requestAnimationFrame(this._process.bind(this));
		this._tick();
		this._draw();
		//setTimeout(this._process.bind(this), 1);
	}
	
	_tick() {
		let delta = this._time.update();
		this._fpsCounter.tick(delta);
		QQ.seizures.tick(delta);
	}

	_draw() {
		QQ.seizures.draw();
		//this._canvas.drawBorder();
		this._fpsCounter.show(this._canvas.getContext());
	}

};
