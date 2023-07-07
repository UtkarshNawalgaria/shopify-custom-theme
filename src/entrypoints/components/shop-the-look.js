export default class ShopTheLook extends window.HTMLElement {
  constructor() {
    super();

    this.productElements = this.querySelectorAll(".product");
    this.productPins = this.querySelectorAll(".pin");
    this.init();
  }

  init() {
    this.productPins.forEach((item) => {
      item.addEventListener("click", (event) => {
        const blockId = item.dataset.blockId;
        const productElement = this.querySelector(`[data-block-id="${blockId}"].product`);
        productElement.classList.toggle("hide")
      });
    });
  }
}
