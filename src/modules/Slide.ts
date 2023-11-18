export default class Slide {
    container: Element;
    slides: Element[];
    controls: Element;
    time: number;
    index: number;
    slide: Element

    constructor(container: Element, slides: Element[], controls: Element, time: number = 5000) {
      this.container = container;
      this.slides = slides;
      this.controls = controls;
      this.time = time;
      
      this.index = 0;
      this.slide = this.slides[this.index];
      this.init();
    }

    hide(el: Element){
      el.classList.remove("active")
    }

    show(index: number): void{ 
      this.index = index;
      this.slide = this.slides[this.index];//this.slide = slide Ativo no momento;      
      this.slides.forEach( el => this.hide(el));
      this.slides[index].classList.add("active");
    }


    prev(){
      const ultimoIndex = this.slides.length - 1;    
      
      const ifSe = this.index === 0 ? this.index = ultimoIndex : this.index - 1;
      this.show(ifSe);
    }

    next(){
      const ultimoIndex = this.slides.length - 1;    
      const ifSe = this.index < ultimoIndex ? this.index + 1 : this.index = 0;
      this.show(ifSe);
    }
    

    private addControls(){
      const prevButton = document.createElement("button");
      const nextButton = document.createElement("button");
      prevButton.innerText = "Anterior Slide";
      nextButton.innerText = "Próximo Slide";


      this.controls.appendChild(prevButton);
      this.controls.appendChild(nextButton);

      prevButton.addEventListener("pointerup", ()=> this.prev());
      nextButton.addEventListener("pointerup", ()=> this.next());

    }

    private init(){
      this.addControls();
      this.show(this.index);
    }

}
  