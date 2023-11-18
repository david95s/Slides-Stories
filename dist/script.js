import Slide from "./modules/Slide.js";
const container = document.getElementById("slide");
const dadElements = document.getElementById("slide-elements");
const elements = dadElements?.children;
const controls = document.getElementById("slide-controls");
if (container && controls && elements && elements.length) {
    const arrayOfElements = Array.from(elements);
    const meuSlide = new Slide(container, arrayOfElements, controls, 3000);
}
//# sourceMappingURL=script.js.map