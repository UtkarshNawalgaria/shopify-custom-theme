import ShopTheLook from "./components/shop-the-look";
import ProductGallery from "./components/product-gallery";
import VariantSelector from "./components/variant-selector";
import Product from "./models/product";

window.customElements.define("shop-the-look", ShopTheLook);
window.customElements.define("product-gallery", ProductGallery);
window.customElements.define("variant-selector", VariantSelector);
window.customElements.define("component-product", Product);
