export default class Timeout{
    id;
    handler;
    start;
    timeLeft;
    constructor(handler: TimerHandler, time: number){
        // handler é meu callback q quero
        this.id = setTimeout(handler, time);

        this.handler = handler;
        this.timeLeft = time;
        this.start = Date.now();

    }

    clear(){
        clearTimeout(this.id);
    }

    pauseTimeout(){
        //passed = Tempo q se passou do inicio da contrução dessa ClassTimeout
        //passedLeft = Tempo q falta para o slidecontinuar - Tempo restante em Time;
        const passed = Date.now() - this.start;
        this.timeLeft = this.timeLeft - passed;

        this.clear();
    }

    continue(){
        this.clear()
        this.id = setTimeout(this.handler, this.timeLeft);
        this.start = Date.now(); 
    }

}