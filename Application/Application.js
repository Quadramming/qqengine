QQ.Application = class Application {
	
	constructor(config) {
		this._canvas     = new QQ.Canvas('QQApplicationCanvas',
				config.width,
				config.height,
				config.maximize
			);
		this._fpsCounter = new QQ.FpsCounter();
		this._time       = new QQ.Time();
		this._mouse      = new QQ.Mouse();
		this._touch      = new QQ.Touch(this._mouse);
		this._storage    = new QQ.Storage();
		this._imgManager = new QQ.ImgManager();
		this._seizures   = new QQ.Seizures.Manager(this);
		this._imgs       = config.imgs;
		this.loadImgs(
			this.init.bind(this)
		);
	}
	
	loadImgs(cb) {
		let imgManager = this._imgManager;
		for ( let img of this._imgs ) {
			imgManager.get(img);
		}
		(function imgLoading() {
			imgManager.isAllReady() ?
				cb():
				setTimeout(imgLoading, 10);
		})();
	}
	
	init() {
		this._seizures.init();
		this._seizures.set('Main');
		
		this._mouse.setM1DownCB( () => {
			if ( this.isMouseInCanvas() ) {
				let {x, y} = this._getMousePosition();
				this._seizures.clickDown(x, y);
			}
		});
		this._mouse.setM1UpCB( () => {
			if ( this.isMouseInCanvas() ) {
				let {x, y} = this._getMousePosition();
				this._seizures.clickUp(x, y);
			}
		});
		this._process();
	}
	
	storage(key, value) {
		return this._storage.storage(key, value);
	}
	
	sz() {
		return this._seizures;
	}
	getSz() {
		return this._seizures.getActive();
	}
	
	pause() {
		this._seizures.popUp('Pause');
	}
	
	getImgManager() {
		return this._imgManager;
	}
	
	getCanvas() {
		return this._canvas.getCanvas();
	}
	
	getContext() {
		return this._canvas.getContext();
	}
	
	getMouseXY() {
		if ( this.isMouseInCanvas() ) {
			return this._getMousePosition();
		}
		return { x : -1, y : -1 };
	}
	
	getTime() {
		return this._time;
	}
	
	isM1Pressed() {
		return this._mouse.getM1();
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
		this._seizures.tick(delta);
	}
	
	_draw() {
		this._seizures.draw();
		//this._canvas.drawBorder();
		this._fpsCounter.show(this._canvas.getContext());
	}
	
};
