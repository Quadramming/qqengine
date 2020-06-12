import * as QQ from '../QQ.js';
import * as Subject from '../Subject/index.js';

export class Button extends Subject.Sprite {
	
	constructor(options) {
		super(options);
		this._onBtnClickDown = QQ.useDefault(options.onBtnClickDown, () => {});
		this._onBtnClick = QQ.useDefault(options.onBtnClick, () => {});
	}
	
	onClickDown(worldPoint) {
		super.onClickDown(worldPoint);
		this._onBtnClickDown(worldPoint);
	}
	
	onClick(worldPoint) {
		super.onClick(worldPoint);
		this._onBtnClick(worldPoint);
	}
	
}
