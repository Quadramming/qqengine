QQ.Touch = class Touch {

	constructor(mouse) {
		let   x       = 0;
		let   y       = 0;
		const options = {
			capture: true,
			passive: false
		};
		
		window.addEventListener('touchstart', (e) => {
			const touchobj = e.touches[0];
			if ( QQ.Math.isNumbers(touchobj.clientX, touchobj.clientY) ) {
				x = touchobj.clientX;
				y = touchobj.clientY;
				mouse.emulate(x, y, true);
			}
			e.preventDefault();
			return false;
		}, options);
		
		window.addEventListener('touchmove', (e) => {
			const touchobj = e.touches[0];
			if ( QQ.Math.isNumbers(touchobj.clientX, touchobj.clientY) ) {
				x = touchobj.clientX;
				y = touchobj.clientY;
				mouse.emulate(x, y, true);
			}
			e.preventDefault();
			return false;
		}, options);

		window.addEventListener('touchend', (e) => {
			mouse.emulate(x, y, false);
			e.preventDefault();
			return false;
		}, options);
	}
	
};
