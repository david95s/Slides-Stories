import Timeout from "./Timeout.js";

export default class Slide {
    container: Element;
    slides: Element[];
    controls: Element;
    time: number;
    index: number;
    slide: Element;
    paused: boolean;
    //Esse tipo Timeout é criado qndo eu criei minha Class Timeout;
    //E tipo null, vai se o valor inicial dele
    myTimeout: Timeout | null;
    pausedTimeout: Timeout | null;
    constructor(container: Element, slides: Element[], controls: Element, time: number = 5000) {
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

    hide(el: Element){
      el.classList.remove("active");
      
      //Pausando o video e reiniciando ele qndo ele n estiver ativo!
      if(el instanceof HTMLVideoElement){
        el.currentTime = 0;
        el.pause();
      }
    }

    show(index: number): void{ 
      this.index = index;
      this.slide = this.slides[this.index];//this.slide = slide Ativo no momento;      

      localStorage.setItem("activeSlide", String(this.index));

      this.slides.forEach( el => this.hide(el));
      
      this.slide.classList.add("active");

      if(this.slide instanceof HTMLVideoElement){
        this.autoVideo(this.slide)
      }else{
        this.auto(this.time);
      }
    }

    autoVideo(ownVideo: HTMLVideoElement){
       //playing é o momento em q o video realmente esta tocando.
      //Necessario checar pq, se o video n for carregado ownVideo.duration retornar NAN
      //Assim checo se ele está playing p rodar o this.auto();
      //Só q td vz q pauso e despauso essa func roda dnv, aí é necessário q ela rode só uma vz
      ownVideo.muted = true;
      ownVideo.play();

      let jutOneTime = true;
      ownVideo.addEventListener("playing", ()=>{
        if(jutOneTime){
          console.log("uma vz")
          this.auto(ownVideo.duration * 1000);
          jutOneTime = false;
        }
      })
    }

    auto(time: number){
      //Se ele extistir limpo oq já existe, se n crio um novo.
      //Assim eu sempre crio um novo e limpo o anterior.
      if(this.myTimeout){
        this.myTimeout.clear();
      }
      this.myTimeout = new Timeout(()=> this.next(), time);
    }

    prev(){
      if(this.paused) return;
      const ultimoIndex = this.slides.length - 1;    
      const ifSe = this.index === 0 ? this.index = ultimoIndex : this.index - 1;
      this.show(ifSe);
    }

    next(){
      if(this.paused) return;
      const ultimoIndex = this.slides.length - 1;    
      const ifSe = this.index < ultimoIndex ? this.index + 1 : this.index = 0;
      this.show(ifSe);
    }
    
    pause(){
      this.pausedTimeout = new Timeout(()=>{
        this.myTimeout?.pauseTimeout();
        this.paused = true;

        if(this.slide instanceof HTMLVideoElement){
          this.slide.pause()
        }
      }, 300);
    }

    continue(){
      this.pausedTimeout?.clear();

      if(this.paused){
        this.paused = false;
        this.myTimeout?.continue();

        if(this.slide instanceof HTMLVideoElement){
          this.slide.play()
        }
      }
    }

    private addControls(){
      const prevButton = document.createElement("button");
      const nextButton = document.createElement("button");
      prevButton.innerText = "Anterior Slide";
      nextButton.innerText = "Próximo Slide";
      this.controls.appendChild(prevButton);
      this.controls.appendChild(nextButton);

      this.controls.addEventListener("pointerdown", ()=> this.pause());
      this.controls.addEventListener("pointerup", ()=> this.continue());
      
      prevButton.addEventListener("pointerup", ()=> this.prev());
      nextButton.addEventListener("pointerup", ()=> this.next());
    }

    private init(){
      this.addControls();
      this.show(this.index);
    }

}
  