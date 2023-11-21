export default class Timeout {
    id;
    handler;
    start;
    timeLeft;
    constructor(handler, time) {
        this.id = setTimeout(handler, time);
        this.handler = handler;
        this.timeLeft = time;
        this.start = Date.now();
    }
    clear() {
        clearTimeout(this.id);
    }
    pauseTimeout() {
        const passed = Date.now() - this.start;
        this.timeLeft = this.timeLeft - passed;
        this.clear();
    }
    continue() {
        this.clear();
        this.id = setTimeout(this.handler, this.timeLeft);
        this.start = Date.now();
    }
}
//# sourceMappingURL=Timeout.js.map