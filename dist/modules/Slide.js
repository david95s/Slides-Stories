import Timeout from "./Timeout.js";
export default class Slide {
    container;
    slides;
    controls;
    time;
    index;
    slide;
    paused;
    myTimeout;
    pausedTimeout;
    constructor(container, slides, controls, time = 5000) {
        this.container = container;
        this.slides = slides;
        this.controls = controls;
        this.time = time;
        this.myTimeout = null;
        this.pausedTimeout = null;
        const indexLocalStorage = localStorage.getItem("activeSlide") ? Number(localStorage.getItem("activeSlide")) : 0;
        this.index = indexLocalStorage;
        this.slide = this.slides[this.index];
        this.init();
        this.paused = false;
    }
    hide(el) {
        el.classList.remove("active");
        if (el instanceof HTMLVideoElement) {
            el.currentTime = 0;
            el.pause();
        }
    }
    show(index) {
        this.index = index;
        this.slide = this.slides[this.index];
        localStorage.setItem("activeSlide", String(this.index));
        this.slides.forEach(el => this.hide(el));
        this.slide.classList.add("active");
        if (this.slide instanceof HTMLVideoElement) {
            this.autoVideo(this.slide);
        }
        else {
            this.auto(this.time);
        }
    }
    autoVideo(ownVideo) {
        ownVideo.muted = true;
        ownVideo.play();
        let jutOneTime = true;
        ownVideo.addEventListener("playing", () => {
            if (jutOneTime) {
                console.log("uma vz");
                this.auto(ownVideo.duration * 1000);
                jutOneTime = false;
            }
        });
    }
    auto(time) {
        if (this.myTimeout) {
            this.myTimeout.clear();
        }
        this.myTimeout = new Timeout(() => this.next(), time);
    }
    prev() {
        if (this.paused)
            return;
        const ultimoIndex = this.slides.length - 1;
        const ifSe = this.index === 0 ? this.index = ultimoIndex : this.index - 1;
        this.show(ifSe);
    }
    next() {
        if (this.paused)
            return;
        const ultimoIndex = this.slides.length - 1;
        const ifSe = this.index < ultimoIndex ? this.index + 1 : this.index = 0;
        this.show(ifSe);
    }
    pause() {
        this.pausedTimeout = new Timeout(() => {
            this.myTimeout?.pauseTimeout();
            this.paused = true;
            if (this.slide instanceof HTMLVideoElement) {
                this.slide.pause();
            }
        }, 300);
    }
    continue() {
        this.pausedTimeout?.clear();
        if (this.paused) {
            this.paused = false;
            this.myTimeout?.continue();
            if (this.slide instanceof HTMLVideoElement) {
                this.slide.play();
            }
        }
    }
    addControls() {
        const prevButton = document.createElement("button");
        const nextButton = document.createElement("button");
        prevButton.innerText = "Anterior Slide";
        nextButton.innerText = "Próximo Slide";
        this.controls.appendChild(prevButton);
        this.controls.appendChild(nextButton);
        this.controls.addEventListener("pointerdown", () => this.pause());
        this.controls.addEventListener("pointerup", () => this.continue());
        prevButton.addEventListener("pointerup", () => this.prev());
        nextButton.addEventListener("pointerup", () => this.next());
    }
    init() {
        this.addControls();
        this.show(this.index);
    }
}
//# sourceMappingURL=Slide.js.map