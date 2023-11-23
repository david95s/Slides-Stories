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
    thumbItems;
    thumb;
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
        this.paused = false;
        this.thumbItems = null;
        this.thumb = null;
        this.init();
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
        if (this.thumbItems) {
            this.thumb = this.thumbItems[this.index];
            this.thumbItems.forEach(i => i.classList.remove("active"));
            this.thumb.classList.add("active");
        }
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
        if (this.thumb) {
            this.thumb.style.animationDuration = `${time}ms`;
        }
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
        document.body.classList.add("paused");
        this.pausedTimeout = new Timeout(() => {
            this.myTimeout?.pauseTimeout();
            this.paused = true;
            if (this.thumb) {
                this.thumb.classList.add("paused");
            }
            if (this.slide instanceof HTMLVideoElement) {
                this.slide.pause();
            }
        }, 300);
    }
    continue() {
        document.body.classList.remove("paused");
        this.pausedTimeout?.clear();
        if (this.paused) {
            this.paused = false;
            this.myTimeout?.continue();
            if (this.slide instanceof HTMLVideoElement) {
                this.slide.play();
            }
        }
        if (this.thumb) {
            this.thumb.classList.remove("paused");
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
        document.addEventListener("pointerup", () => this.continue());
        document.addEventListener("touchend", () => this.continue());
        prevButton.addEventListener("pointerup", () => this.prev());
        nextButton.addEventListener("pointerup", () => this.next());
    }
    addThumbItems() {
        const thumbContainer = document.createElement("div");
        thumbContainer.id = "slide-thumb";
        for (let i = 0; i < this.slides.length; i++) {
            thumbContainer.innerHTML += `
          <span>
            <span class="thumb-item"></span>
          </span>
        `;
        }
        this.controls.appendChild(thumbContainer);
        this.thumbItems = Array.from(document.querySelectorAll(".thumb-item"));
    }
    init() {
        this.addControls();
        this.addThumbItems();
        this.show(this.index);
    }
}
//# sourceMappingURL=Slide.js.map