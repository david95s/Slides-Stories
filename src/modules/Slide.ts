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
    //
    thumbItems: HTMLElement[] | null;
    thumb: HTMLElement | null;
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
      this.paused = false;
      

      this.thumbItems = null;
      this.thumb = null;

      this.init();
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

      if(this.thumbItems){
        this.thumb =  this.thumbItems[this.index];
        this.thumbItems.forEach(i => i.classList.remove("active"));
        this.thumb.classList.add("active")
      }

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
      //Necessario checar pq, se o meta-data-html do video n for carregado, ownVideo.duration retornar NAN
      //Assim checo se ele está playing p rodar o this.auto();
      //Só q td vz q pauso e despauso essa func roda dnv, aí é necessário q ela rode só uma vz

      ownVideo.muted = true;
      ownVideo.play();

      let jutOneTime = true;
      ownVideo.addEventListener("playing", ()=>{
        if(jutOneTime){
          this.auto(ownVideo.duration * 1000);
          jutOneTime = false;
        }
      })
    }

    auto(time: number){
      //Se ele extistir limpo oq já existe, se n crio um novo.
      //Assim eu sempre crio um novo e limpo o anterior.
      if(this.myTimeout){  this.myTimeout.clear() }
      this.myTimeout = new Timeout(()=> this.next(), time);

      if(this.thumb){
        this.thumb.style.animationDuration = `${time}ms`
      }
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
      document.body.classList.add("paused");
      this.pausedTimeout = new Timeout(()=>{
        this.myTimeout?.pauseTimeout();
        this.paused = true;

        if(this.thumb){
          this.thumb.classList.add("paused");
        }

        if(this.slide instanceof HTMLVideoElement){
          this.slide.pause()
        }
      }, 300);
    }

    continue(){
      document.body.classList.remove("paused");

      this.pausedTimeout?.clear();

      if(this.paused){
        this.paused = false;
        this.myTimeout?.continue();

        if(this.slide instanceof HTMLVideoElement){
          this.slide.play()
        }
      }

      if(this.thumb){
        this.thumb.classList.remove("paused");
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
      //Abaixo - Em qlqr lugar q eu levantar o mouse qro q continue o slide
      document.addEventListener("pointerup", ()=> this.continue());
      document.addEventListener("touchend", ()=> this.continue());

      
      prevButton.addEventListener("pointerup", ()=> this.prev());
      nextButton.addEventListener("pointerup", ()=> this.next());
    }

    private addThumbItems(){
      const thumbContainer = document.createElement("div");
      thumbContainer.id = "slide-thumb";

      for (let i = 0; i < this.slides.length; i++) {
        thumbContainer.innerHTML += `
          <span>
            <span class="thumb-item"></span>
          </span>
        `
      }

      this.controls.appendChild(thumbContainer);
      this.thumbItems = Array.from(document.querySelectorAll(".thumb-item"));
    }

    private init(){
      this.addControls();
      this.addThumbItems();
      this.show(this.index);
    }

}
  