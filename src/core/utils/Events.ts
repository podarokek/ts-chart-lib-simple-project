class Events {
  private listeners: { [key: string]: Function[] };

  constructor() {
    this.listeners = {};
  }

  on(k: string, fnc: Function) {
    if (!(k in this.listeners)) this.listeners[k] = [];
    this.listeners[k].push(fnc);
  }

  once(k: string, fnc: Function) {
    if (!(k in this.listeners)) this.listeners[k] = [];
    this.listeners[k].push((...args: any[]) => {
      this.removeListener(k, fnc);
      fnc(...args);
    });
  }

  emit(k: string, ...args: any[]) {
    if (!(k in this.listeners)) return;
    for (let fnc of this.listeners[k]) fnc(...args);
  }

  removeListener(k: string, fnc: Function) {
    this.listeners[k].splice(this.listeners[k].indexOf(fnc), 1);
  }

  removeAllListeners(k: string) {
    if (k !== undefined) this.listeners = {};
    else delete this.listeners[k];
  }
}

export default Events;
