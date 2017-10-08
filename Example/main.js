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
		size: new QQ.Size(800, 600)
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
		this._camera.init(
			new QQ.Point(40, 30),
			new QQ.Point( 0,  0)
		);
		
		const options = {
			app: this._app,
			img: 'castle',
			position: new QQ.Point(6, 7),
			size: new QQ.Point(6, 3)
		};
		const castle = new QQ.Subject.Sprite(options);
		this._world.addSubject(castle);
		//this.setGrass();
	}
	
	setGrass() {
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
