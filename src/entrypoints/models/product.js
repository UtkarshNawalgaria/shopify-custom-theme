export default class Product extends HTMLElement {
  constructor() {
    super();

    this.productId = this.dataset.productId;
    this.qtyBtns = this.querySelectorAll("#quantity-selector .qty-btn");
    this.qtyInput = this.querySelector("#quantity-selector input");
    this.currentQty = this.qtyInput.value;
    this.form = this.querySelector(`#AddToCartForm-${this.productId}`);

    this.init();
  }

  init() {
    this.trackQuantityChange();
    this.addEventListener(
      "on:variant:change",
      this.handleVariantChange.bind(this)
    );
  }

  handleVariantChange(event) {
    const selectedVariant = event.detail.variant;

    if (selectedVariant) {
      this.form.querySelector('[name="id"]').value = selectedVariant.id;
    }

    // If current variant is out of stock, hide payment buttons
    // and quantity selector
    if (!selectedVariant.available) {
      this.form.querySelector(".payment-buttons").classList.add("hide");
      this.form.querySelector("#quantity-selector").classList.add("hide");
      this.form.querySelector(".sold-out-button").classList.remove("hide");
    } else {
      this.form.querySelector(".payment-buttons").classList.remove("hide");
      this.form.querySelector("#quantity-selector").classList.remove("hide");
      this.form.querySelector(".sold-out-button").classList.add("hide");
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
    const maxQty = this.qtyInput.getAttribute("max");
    const newQty = parseInt(this.qtyInput.value) + changeQuantityBy;
    this.qtyInput.value = Math.max(1, Math.min(newQty, maxQty));
  }
}
