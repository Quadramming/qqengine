QQ.ImgManager = class ImgManager {
	
	constructor() {
		this._imgs = [];
	}
	
	get(url) {
		for ( const img of this._imgs ) {
			if ( img.url === url ) {
				return img.obj;
			}
		}
		const img   = {};
		img.url     = url;
		img.obj     = new Image();
		img.obj.src = url;
		this._imgs.push(img);
		return img.obj;
	}
	
	isAllReady() {
		for ( const img of this._imgs ) {
			if ( img.obj.complete === false ) {
				return false;
			}
		}
		return true;
	}
	
	isReady(imgObj) {
		for ( const img of this._imgs ) {
			if ( img.obj === imgObj ) {
				return img.obj.complete;
			}
		}
		return false;
	}
	
};
