// QQDOC

import * as QQ from './QQ.js';
import * as Seizure from './Seizure/index.js';
import * as CONST from './CONST/index.js';
import {Point, Size} from './primitives/index.js';
import {FpsCounter} from './FpsCounter.js';
import {Time} from './Time.js';
import {Storage} from './Storage.js';
import {ImgManager} from './ImgManager.js';
import {Sound} from './Sound.js';
import {Canvas} from './Canvas.js';
import {OnResizeHandler} from './OnResizeHandler.js';
import {Sprite} from './Sprite/index.js';
import {S} from './style/index.js';
import {T} from './i18n.js';
import {Input} from './Input.js';

export class Application {
	
	//================================================================
	// Constructor
	//================================================================
	
	#fpsCounter = new FpsCounter(); // Fps counter
	#time = new Time(); // Time handler
	#startSeizure; // First seizure to start
	
	constructor(config = {}) {
		QQ.setApp(this);
		this._onResizeHandler = new OnResizeHandler();
		this._canvas = new Canvas('QQ.Application.Canvas',
			config.size,
			config.maximize
		);
		this._inputQueue = [];
		this._input = new Input(this._canvas.getCanvas(), this._inputQueue);
		this._storage = new Storage();
		this._imgManager = new ImgManager();
		this._seizures = new Seizure.Manager(this);
		this._imgs = new Map(config.images);
		this._canvases = new Map();
		this._sound = new Sound();
		this._sound.set(config.sounds);
		if ( config.showFps ) {
			this.#fpsCounter.toggleShow();
		}
		this.#startSeizure = config.startSeizure ?? 'Main';
		this._game = QQ.useDefault(config.game, null);
		this._loadResources(this._init);
	}
	
	_init() {
		window.document.addEventListener(
			'backbutton',
			this.onBackButton.bind(this),
			false
		);
		if ( this._game ) {
			this._game.init(this);
		}
		this._seizures.init();
		this._seizures.set(this.#startSeizure);
		this.initMouseEvents();
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
		/*
		this._mouse.setMoveCb( () => {
			const point = this._getPointerOnCanvas();
			this._inputQueue.push({
				type: 'mouse move',
				point: point
			});
		});
		this._mouse.setM1DownCb( () => {
			const point = this._getPointerOnCanvas();
			this._inputQueue.push({
				type: 'mouse down',
				point: point
			});
		});
		this._mouse.setM1UpCb( () => {
			const point = this._getPointerOnCanvas();
			this._inputQueue.push({
				type: 'mouse up',
				point: point
			});
		});
		*/
	}
	
	_getPointerOnCanvas() {
		const rect = this._canvas.getSizeRect();
		const canvasOffset = this._canvas.getCanvasOffset();
		const mouse = this._mouse.getPoint();
		const point = new Point(
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
		return this._storage.store(key, value);
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
	
	getActiveSz() {
		return this._seizures.getActive();
	}
	
	//================================================================
	// Graphics
	//================================================================
	
	getResolution() {
		return new Size(this._canvas.getWidth(), this._canvas.getHeight());
	}
	
	getImgByUrl(imgSrc) {
		return this._imgManager.get(imgSrc);
	}
	
	getImg(imageSource) {
		if ( imageSource instanceof HTMLCanvasElement ) {
			return imageSource;
		} else if ( this._imgs.has(imageSource) ) {
			return this.getImgByUrl(this._imgs.get(imageSource));
		} else {
			throw new Error(`Application.getImg(): no such img ${imageSource}`);
		}
	}
	
	createSprite(img) {
		return new Sprite( this.getImg(img) );
	}
	
	getImgCanvas(image) {
		image = this.getImg(image);
		const map = this._canvases;
		if ( ! map.get(image.src) ) {
			const canvas = QQ.makeCanvas( new Size(
				image.width,
				image.height
			));
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
		this.#fpsCounter.showDetails();
	}
	
	onBackButton() {
		if ( this._seizures.countActives() > 0 ) {
			const sz = this._seizures.getActive();
			sz.onBackButton();
		}
	}
	
	addOnResize(fn) {
		this._onResizeHandler.add(fn);
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
		requestAnimationFrame((time) => this._gameLoop(time));
		// setTimeout(() => this._gameLoop(1), 1); // Debug
	}
	
	_tick() {
		const delta = this.#time.update();
		this.#fpsCounter.tick(delta);
		this._seizures.forActive( sz => sz.handleInput(this._inputQueue) );
		this._seizures.tick(delta);
	}
	
	_draw() {
		this._seizures.draw();
		//this._canvas.drawBorder();
		this.#fpsCounter.show(this._canvas.getContext());
	}
	
}
