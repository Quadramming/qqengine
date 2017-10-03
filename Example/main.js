(function() {
	
	const imgs = [
		['castle', 'castle.png'],
		['grass',  'grass.png']
	];
	
	const sounds = [
		['town', 'town.ogg']
	];
	
	const appConfig = {
		imgs,
		sounds,
		width:  500,
		height: 400
	};
	
	QQ.start(appConfig);
	
})();

let game = {
	seizures: {}
};

game.seizures.Main = class Main
	extends QQ.Seizures.Base
{
	
	constructor(input) {
		super(input);
	}
	
	init() {
		super.init();
		this.setCamera();
		this.setGrass();
	}
	
	setCamera() {
		let viewW = 30;
		let viewH = 40;
		let initX = 0;
		let initY = 0;
		this._camera.init(viewW, viewH, initX, initY);
		let resizeCamera = () => {
			let cameraView = this._camera.getView();
			let cameraY    = (cameraView.height-viewH)/2;
			this._camera.setPos(initX, cameraY);

		};
		resizeCamera();
		window.addEventListener('resize', resizeCamera);
	}
	
	setGrass() {
		debugger;
		let bg = QQ.Subject.make(this._app, {
			tiled:  true,
			imgSrc: 'imgs/grass.png'
		});
		bg.setPosition(0, 0);
		bg.setTileSize(3, 3);
		let resizeBg = () => {
			let cameraView = this._camera.getView();
			let cameraX = 0;
			let cameraY = (cameraView.height-40)/2;
			bg.setSize(cameraView.width, cameraView.height);
			bg.setPosition(cameraX, cameraY);
		};
		resizeBg();
		window.addEventListener('resize', resizeBg);
		this._world.addSubject(bg);
	}
	
};

QQ.Seizures.register.set('Main', game.seizures.Main);
