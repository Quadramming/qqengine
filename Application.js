import * as QQ from './QQ.js';
import {Point} from './Point.js';
import {Size} from './Size.js';
import {FpsCounter} from './FpsCounter.js';
import {Time} from './Time.js';
import {Mouse} from './Mouse.js';
import {Touch} from './Touch.js';
import {Storage} from './Storage.js';
import {ImgManager} from './ImgManager.js';
import {Sound} from './Sound.js';
import {Canvas} from './Canvas.js';
import * as Seizure from './Seizure/index.js';
import {S} from './Style/tag.js';
import {T} from './i18n.js';

import './Seizure/Main.js';

export class Application {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(config) {
		this._canvas = new Canvas('QQ.Application.Canvas',
			config.size,
			config.maximize
		);
		this._fpsCounter = new FpsCounter();
		this._time = new Time();
		this._mouse = new Mouse();
		this._touch = new Touch(this._mouse);
		this._inputQueue = [];
		this._storage = new Storage();
		this._imgManager = new ImgManager();
		this._seizures = new Seizure.Manager(this);
		this._imgs = new Map(config.imgs);
		this._canvases = new Map();
		this._sound = new Sound();
		this._sound.set(config.sounds);
		if ( config.showFps ) {
			this._fpsCounter.showDetails();
		}
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
		this._seizures.set('Main');
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
	}
	
	_handleInput() {
		for ( const input of this._inputQueue ) {
			switch ( input.type ) {
				case 'mouse move':
					this._seizures.forActive((sz) => {
						sz.pointerMove(input.point);
					});
				break;
				case 'mouse down':
					this._seizures.forActive((sz) => {
						sz.pointerDown(input.point);
					});
				break;
				case 'mouse up':
					this._seizures.forActive((sz) => {
						sz.pointerUp(input.point);
					});
				break;
				default:
					alert('bad input type');
			}
		}
		this._inputQueue.length = 0;
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
	
	//================================================================
	// Graphics
	//================================================================
	
	getResolution() {
		return new Point(this._canvas.getWidth(), this._canvas.getHeight());
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
			const imgSize = new Size(image.width, image.height);
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
	
	onBackButton() {
		if ( this._seizures.countActives() > 0 ) {
			const sz = this._seizures.getActive();
			sz.onBackButton();
		}
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
		const delta = this._time.update();
		this._handleInput();
		this._fpsCounter.tick(delta);
		this._seizures.tick(delta);
	}
	
	_draw() {
		this._seizures.draw();
		//this._canvas.drawBorder();
		this._fpsCounter.show(this._canvas.getContext());
	}
	
}
