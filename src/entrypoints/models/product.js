export default class Product extends HTMLElement {
  constructor() {
    super();

    this.qtyBtns = this.querySelectorAll("#quantity-selector .qty-btn");
    this.qtyInput = this.querySelector("#quantity-selector input");
    this.currentQty = this.qtyInput.value
    this.form = this.querySelector("form");

    this.init();
  }

  init() {
    this.trackQuantityChange();
    this.addEventListener('on:variant:change', this.handleVariantChange.bind(this))
  }

  handleVariantChange(event) {
    if (event.detail.variant) {
      const variantIdEle = this.form.querySelector('[name="id"]');
      variantIdEle.value = event.detail.variant.id;
    }
  }

  trackQuantityChange() {
    this.qtyBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const changeValue = btn.classList.contains("decrement") ? -1 : 1;
        this.changeQuantity(changeValue);
      });
    });
  }

  changeQuantity(changeQuantityBy) {
    const maxQty = this.qtyInput.getAttribute('max')
    const newQty = parseInt(this.qtyInput.value) + changeQuantityBy;
    this.qtyInput.value = Math.max(1, Math.min(newQty, maxQty));
  }
}
