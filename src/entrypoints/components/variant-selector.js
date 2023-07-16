export default class VariantSelector extends HTMLElement {
  constructor() {
    super();

    this.productSection = this.closest("component-product");
    this.form = this.productSection.querySelector("form");

    this.optionSelectors = this.querySelectorAll(".option-selector");
    this.productData = JSON.parse(
      this.querySelector('[type="application/json"]').textContent
    );
    this.addEventListener("change", this.onOptionSelectChange.bind(this));
    this.moneyFormat = JSON.parse(
      document.querySelector("#moneyFormat").textContent
    );
    this.savedAmountTypeMap = {
      amount: (value) => `${value} off`,
      percentage: (value) => `${value}% off`,
    };
  }

  onOptionSelectChange(event) {
    const selectedOptions = this.getSelectedOptions();

    this.selectedVariant = this.productData.variants.find((variant) => {
      return variant.options.every(
        (val, index) => val === selectedOptions[index]
      );
    });

    if (this.selectedVariant) {
      this.updateURL();
      this.updateSKU();
      this.updatePrice();
      this.updateSelectedOption();

      this.dispatchEvent(
        new CustomEvent("on:variant:change", {
          bubbles: true,
          detail: {
            variant: this.selectedVariant,
          },
        })
      );
    }
  }

  getSelectedOptions() {
    const selectedOptions = [];
    this.optionSelectors.forEach((optionSelector) => {
      selectedOptions.push(optionSelector.querySelector("input:checked").value);
    });

    return selectedOptions;
  }

  updateSelectedOption() {
    this.querySelectorAll(".option-selector__label").forEach((ele, index) => {
      ele.querySelector(".selected-option").textContent = this.selectedVariant.options[index];
    })
  }

  updateSKU() {
    const sku = document.querySelector(".product-sku span");
    sku.textContent = `SKU: ${this.selectedVariant.sku}`;
  }

  updateURL() {
    window.history.replaceState(
      {},
      "",
      `${this.dataset.url}?variant=${this.selectedVariant.id}`
    );
  }

  updatePrice() {
    let savedAmount = null;
    let savedPercentage = null;
    const price = this.selectedVariant.price;
    const comparePrice =
      this.selectedVariant.compare_at_price ||
      this.productData.compare_at_price;
    const priceContainer = document.querySelector(".product-price");

    const formattedPrice = price ? this.formatMoney(price) : null;
    const formattedComparePrice = comparePrice
      ? this.formatMoney(comparePrice)
      : null;

    if (comparePrice) {
      savedAmount = this.formatMoney(comparePrice - price);
      savedPercentage = Math.round(
        ((comparePrice - price) / comparePrice) * 100.0
      );
    }

    this.replacePrice(
      priceContainer,
      formattedPrice,
      formattedComparePrice,
      savedAmount,
      savedPercentage
    );
  }

  replacePrice(container, price, comparePrice, savedAmount, savedPercentage) {
    const selector = comparePrice ? "#price-sale" : "#price-regular";
    const priceTemplate = document.querySelector(selector);
    const clone = priceTemplate.content.cloneNode(true);
    const savedAmountType = container.dataset.savedAmountType;

    clone.querySelector(".amount").textContent = price;

    if (comparePrice) {
      clone.querySelector(".compare-amount").textContent = comparePrice;
      clone.querySelector(".savings").textContent =
        savedAmountType == "hidden"
          ? null
          : savedAmountType == "amount"
          ? this.savedAmountTypeMap[savedAmountType](savedAmount)
          : this.savedAmountTypeMap[savedAmountType](savedPercentage);
    }

    container.removeChild(container.children[0]);
    container.appendChild(clone);
  }

  updateVariantId() {}

  formatMoney(cents) {
    return this.moneyFormat.replace("{{amount}}", cents / 100);
  }
}
