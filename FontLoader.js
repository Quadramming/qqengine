// QQDOC

const helpers = [];

export class FontLoader {
	
	constructor(...fonts) {
		this.add(...fonts);
	}
	
	add(fonts = []) {
		for ( const font of fonts ) {
			this.#addFont(...font);
		}
	} // void
	
	cleanUp() {
		for ( const helper of helpers ) {
			document.body.removeChild(helper);
		}
	} // void
	
	#addFont(name, url) {
		const style = document.createElement('style');
		style.appendChild(document.createTextNode(`
			@font-face {
				font-family: ${name};
				src: url(${url});
			}
		`));
		document.head.appendChild(style);
		const loadHelper = document.createElement('font');
		loadHelper.style.fontFamily = name;
		loadHelper.innerText = 'helper';
		document.body.appendChild(loadHelper);
		helpers.push(loadHelper);
	} // void
	
}
