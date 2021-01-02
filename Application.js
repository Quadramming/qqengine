// QQDOC

import * as QQ from './QQ.js';
import * as Seizure from './Seizure/index.js';
import * as CONST from './CONST/index.js';
import {Point, Size} from './primitives/index.js';
import {FpsCounter} from './FpsCounter.js';
import {Time} from './Time.js';
import {Storage} from './Storage.js';
import {ImageManager} from './ImageManager.js';
import {Sound} from './Sound.js';
import {GCanvas} from './GCanvas.js';
import {OnResizeHandler} from './OnResizeHandler.js';
import {S} from './style/index.js';
import {T} from './i18n.js';
import {InputAvg} from './Input/InputAvg.js';

export class Application {
	
	#fpsCounter = new FpsCounter(); // Fps counter
	#time = new Time(); // Time handler
	#startSeizure = 'Main'; // First seizure to start
	#storage = new Storage();
	#onResizeHandler = new OnResizeHandler();
	#seizures = new Seizure.Manager();
	#sound = new Sound();
	#game = null;
	#imageManager;
	#canvas; // Global canvas
	
	constructor(config = {}) {
		QQ.setApp(this);
		this.#canvas = new GCanvas('QQ.Application.Canvas',
			config.size,
			config.maximize
		);
		
		this._inputQueue = [];
		this._input = new InputAvg(this.#canvas.getCanvas(), this._inputQueue);
		
		this.#imageManager = new ImageManager(config.images);
		this.#sound.set(config.sounds);
		this.#loadResources(() => this.#init());
		
		if ( config.game ) this.#game = config.game;
		if ( config.showFps ) this.#fpsCounter.toggleShow();
		if ( config.startSeizure ) this.#startSeizure = config.startSeizure;
	}
	
	#init() {
		window.document.addEventListener(
			'backbutton',
			() => this.onBackButton(),
			false // useCapture
		);
		this.#game?.init?.(this);
		this.#seizures.init();
		this.#seizures.set(this.#startSeizure);
		this.initMouseEvents();
		this.#gameLoop(0);
	}
	
	//================================================================
	// Load resources
	//================================================================
	
	#loadResources(cb) {
		if ( this.#imageManager.isReady() ) {
			cb();
		} else {
			setTimeout(() => this.#loadResources(cb), 100);
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
		const rect = this.#canvas.getSizeRect();
		const canvasOffset = this.#canvas.getCanvasOffset();
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
	
	storage(key, value) { // {F} Proxy to storage
		return this.#storage.store(key, value);
	} // string | null
	
	//================================================================
	// Seizure
	//================================================================
	
	setSz(...args) {
		this.#seizures.set(...args);
	}
	
	pause() {
		this.#seizures.popUp('Pause');
	}
	
	popUp(sz, input) {
		this.#seizures.set(sz, input, true);
	}
	
	closePopUp() {
		this.#seizures.closePopUp();
	}
	
	getActiveSz() {
		return this.#seizures.getActive();
	}
	
	//================================================================
	// Graphics
	//================================================================
	
	getResolution() {
		return new Size(this.#canvas.getWidth(), this.#canvas.getHeight());
	} // new Size
	
	getImageByUrl(imageUrl) {
		return this.#imageManager.getImageByUrl(imageUrl);
	} // HTMLImageElement
	
	getImageById(imageId) {
		return this.#imageManager.getImageById(imageId);
	} // HTMLImageElement
	
	getImageCanvasByUrl(imageUrl) {
		return this.#imageManager.getImageCanvasByUrl(imageUrl);
	} // WCanvas
	
	getImageCanvasById(imageId) {
		return this.#imageManager.getImageCanvasById(imageId);
	} // WCanvas
	
	getImageManager() {
		return this.#imageManager;
	}
	
	//================================================================
	// Common
	//================================================================
	
	getMainCanvas() {
		return this.#canvas.getCanvas();
	}
	
	getMainContext() {
		return this.#canvas.getContext();
	}
	
	showFpsDetails() {
		this.#fpsCounter.showDetails();
	}
	
	onBackButton() {
		if ( this.#seizures.countActives() > 0 ) {
			const sz = this.#seizures.getActive();
			sz.onBackButton();
		}
	}
	
	addOnResize(fn) {
		this.#onResizeHandler.add(fn);
	}
	
	removeOnResize(fn) {
		this.#onResizeHandler.remove(fn);
	}
	
	//================================================================
	// Sound
	//================================================================
	
	playSound(str, options) {
		this.#sound.play(str);
	}
	
	controlSound(str, options) {
		this.#sound.control(str, options);
	}
	
	//================================================================
	// Game loop
	//================================================================
	
	#gameLoop(time) {
		this.#tick();
		this.#draw();
		requestAnimationFrame( time => this.#gameLoop(time));
		//setTimeout(() => this.#gameLoop(1), 1); // Debug
	}
	
	#tick() {
		const delta = this.#time.update();
		this.#canvas.tick(delta);
		this.#fpsCounter.tick(delta);
		this.#game?.tick?.(delta);
		this.#seizures.forActive( sz => sz.handleInput(this._inputQueue) );
		this.#seizures.tick(delta);
	}
	
	#draw() {
		this.#seizures.draw();
		//this.#canvas.drawBorder();
		this.#fpsCounter.show(this.#canvas.getContext());
	}
	
}
