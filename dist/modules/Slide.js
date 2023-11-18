export default class Slide {
    container;
    slides;
    controls;
    time;
    index;
    slide;
    constructor(container, slides, controls, time = 5000) {
        this.container = container;
        this.slides = slides;
        this.controls = controls;
        this.time = time;
        this.index = 0;
        this.slide = this.slides[this.index];
        this.init();
    }
    hide(el) {
        el.classList.remove("active");
    }
    show(index) {
        this.index = index;
        this.slide = this.slides[this.index];
        this.slides.forEach(el => this.hide(el));
        this.slides[index].classList.add("active");
    }
    prev() {
        const ultimoIndex = this.slides.length - 1;
        const ifSe = this.index === 0 ? this.index = ultimoIndex : this.index - 1;
        this.show(ifSe);
    }
    next() {
        const ultimoIndex = this.slides.length - 1;
        const ifSe = this.index < ultimoIndex ? this.index + 1 : this.index = 0;
        this.show(ifSe);
    }
    addControls() {
        const prevButton = document.createElement("button");
        const nextButton = document.createElement("button");
        prevButton.innerText = "Anterior Slide";
        nextButton.innerText = "Próximo Slide";
        this.controls.appendChild(prevButton);
        this.controls.appendChild(nextButton);
        prevButton.addEventListener("pointerup", () => this.prev());
        nextButton.addEventListener("pointerup", () => this.next());
    }
    init() {
        this.addControls();
        this.show(this.index);
    }
}
//# sourceMappingURL=Slide.js.map