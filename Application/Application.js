QQ.Application = class Application {
	  
	//================================================================
	// Constructor
	//================================================================
	
	constructor(config) {
		this._canvas     = new QQ.Canvas('QQApplicationCanvas',
			config.size,
			config.maximize
		);
		this._fpsCounter = new QQ.FpsCounter();
		this._time       = new QQ.Time();
		this._mouse      = new QQ.Mouse();
		this._touch      = new QQ.Touch(this._mouse);
		this._storage    = new QQ.Storage();
		this._imgManager = new QQ.ImgManager();
		this._sound      = new QQ.Sound();
		this._seizures   = new QQ.Seizures.Manager(this);
		this._imgs       = new Map(config.imgs);
		this._sound.set(config.sounds);
		this._loadResources(this._init);
		this._canvases   = new Map();
		game.setApp(this);
	}
	
	_init() {
		this._seizures.init();
		this._seizures.set('Main');
		this.initMouseEvents();
		this._fpsCounter.showDetails();
		this._gameLoop();
	}
	
	//================================================================
	// Load resources
	//================================================================
	
	_loadResources(cb) {
		for ( const [name, url] of this._imgs ) {
			this._imgManager.get(url);
		}
		this._waitResources(cb);
	}
	
	_waitResources(cb) {
		if ( this._imgManager.isAllReady() ) {
			cb.call(this);
		} else {
			setTimeout(this._waitResources.bind(this, cb), 10);
		}
	}
	
	//================================================================
	// Input
	//================================================================
	
	initMouseEvents() {
		this._mouse.setMoveCb( () => {
			const point = this._getPointerOnCanvas();
			this._seizures.forActive((sz) => {
				sz.pointerMove(point);
			});
		});
		this._mouse.setM1DownCb( () => {
			const point = this._getPointerOnCanvas();
			this._seizures.forActive((sz) => {
				sz.pointerDown(point);
			});
		});
		this._mouse.setM1UpCb( () => {
			const point = this._getPointerOnCanvas();
			this._seizures.forActive((sz) => {
				sz.pointerUp(point);
			});
		});
	}
	
	_getPointerOnCanvas() {
		const rect         = this._canvas.getSizeRect();
		const canvasOffset = this._canvas.getCanvasOffset();
		const mouse        = this._mouse.getPoint();
		const point        = new QQ.Point(
			mouse.x() - canvasOffset.x(),
			mouse.y() - canvasOffset.y(),
		);
		if ( rect.isContains(point) ) {
			return point;
		}
		return false;
	}
	
	//================================================================
	// Storage
	//================================================================
	
	storage(key, value) {
		if ( value !== undefined ) {
			this._storage.set(key, value);
		} else {
			return this._storage.get(key);
		}
	}
	
	//================================================================
	// Seizure
	//================================================================
	
	setSz(...args) {
		this._seizures.set(...args);
	}
	
	pause() {
		this._seizures.popUp('Pause');
	}
	
	popUp(sz, input) {
		this._seizures.set(sz, input, true);
	}
	
	closePopUp() {
		this._seizures.closePopUp();
	}
	
	//================================================================
	// Graphics
	//================================================================
	
	getResolution() {
		return new QQ.Point(this._canvas.getWidth(), this._canvas.getHeight());
	}
	
	getImgByUrl(imgSrc) {
		return this._imgManager.get(imgSrc);
	}
	
	getImg(imgName) {
		if ( this._imgs.has(imgName) ) {
			return this.getImgByUrl(this._imgs.get(imgName));
		} else {
			alert('Application.getImg(): no such img');
		}
	}
	
	createSprite(img) {
		return new QQ.Sprite( this.getImg(img) );
	}
	
	getImgCanvas(image) {
		image = this.getImg(image);
		const map = this._canvases;
		if ( ! map.get(image.src) ) {
			const imgSize = new QQ.Size(image.width, image.height);
			const canvas = QQ.makeCanvas(imgSize);
			canvas.ctx.drawImage(image, 0, 0);
			map.set(image.src, canvas);
		}
		return map.get(image.src);
	}
	
	//================================================================
	// Common
	//================================================================
	
	getHtmlCanvas() {
		return this._canvas.getCanvas();
	}
	
	getHtmlContext() {
		return this._canvas.getContext();
	}
	
	showFpsDetails() {
		this._fpsCounter.showDetails();
	}
	
	//================================================================
	// Sound
	//================================================================
	
	playSound(str, options) {
		this._sound.play(str);
	}

	controlSound(str, options) {
		this._sound.control(str, options);
	}
	
	//================================================================
	// Game loop
	//================================================================
	
	_gameLoop(time) {
		this._tick();
		this._draw();
		requestAnimationFrame(this._gameLoop.bind(this));
		//setTimeout(this._process.bind(this), 1);
	}
	
	_tick() {
		const delta = this._time.update();
		this._fpsCounter.tick(delta);
		this._seizures.tick(delta);
	}
	
	_draw() {
		this._seizures.draw();
		//this._canvas.drawBorder();
		this._fpsCounter.show(this._canvas.getContext());
	}
	
};
