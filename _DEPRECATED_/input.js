/*
  scene.input.on('pointerdown111', (pointer) => {
    const direction = pointer.x/pointer.camera.width > 0.5 ? 1 : -1;
    const force = 1 - pointer.y/pointer.camera.height;
    let action = () => {
      let vel = 0.05 + 0.10*force;
      vel *= direction;
      player.setAngularVelocity(vel);
    };
  });
*/

class Input {
  
  constructor(scene) {
    this.pointers = [];
    window.addEventListener('touchstart', this.handleStart.bind(this), {passive: false});
    window.addEventListener('touchend', this.handleEnd.bind(this), {passive: false});
    window.addEventListener('touchcancel', this.handleEnd.bind(this), {passive: false});
    window.addEventListener('touchmove', this.handleMove.bind(this), {passive: false});
    this.onTouchDownFunctions = [];
    this.onTouchUpFunctions = [];
    this.onTouchMoveFunctions = [];
    this.onTouchTapFunctions = [];
  }
  
  static copyTouch(touch) {
    return {
      identifier: touch.identifier,
      pageX: touch.pageX,
      pageY: touch.pageY
    };
  }
  
  notify(functions, ...args) {
    for ( const fn of functions ) {
      fn(...args);
    }
  }
  
  on(eventName, fn) {
    switch ( eventName ) {
      case 'touchDown':
        this.onTouchDownFunctions.push(fn);
      break;
      case 'touchUp':
        this.onTouchUpFunctions.push(fn);
      break;
      case 'touchMove':
        this.onTouchMoveFunctions.push(fn);
      break;
      case 'touchTap':
        this.onTouchTapFunctions.push(fn);
      break;
    }
  }
  
  getPointerIndex(pointer) {
    for ( const [index, current] of this.pointers.entries() ) {
      if ( current.identifier === pointer.identifier ) {
        return index;
      }
    }
    return false;
  }
  
  synchronize(event) {
    event.preventDefault();
    this.pointers.length = 0;
    for ( const touch of event.touches ) {
      this.pointers.push( Input.copyTouch(touch) );
    }
  }
  
  handleStart(event) {
    event.preventDefault();
    for ( const touch of event.changedTouches ) {
      this.pointers.push( Input.copyTouch(touch) );
    }
    this.notify(this.onTouchDownFunctions, event.changedTouches);
    this.synchronize(event);
  }
  
  handleEnd(event) {
    event.preventDefault();
    for ( const touch of event.changedTouches ) {
      const idx = this.getPointerIndex(touch);
      if ( idx !== false ) {
        this.pointers.splice(idx, 1);
      }
    }
    this.notify(this.onTouchUpFunctions, event.changedTouches);
  }
  
  handleMove(event) {
    event.preventDefault();
    for ( const touch of event.changedTouches ) {
      const idx = this.getPointerIndex(touch);
      if ( idx !== false ) {
        this.pointers.splice(idx, 1, Input.copyTouch(touch));
      }
    }
    this.notify(this.onTouchMoveFunctions, event.changedTouches);
  }
  
  update() {
    let string = '';
    for ( const pointer of this.pointers ) {
      string += '('+pointer.pageX+','+ pointer.pageY+') \n';
    }
    text.setText(string);
  }
  
}