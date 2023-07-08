export default class ProductGallery extends HTMLElement {
  constructor() {
    super();

    this.productImages = this.querySelectorAll(".media-list__item");
    this.productThumbnails = this.querySelectorAll(
      ".product-thumbnails .thumbnail"
    );
    this.thumbnailContainer = this.querySelector(".product-thumbnails");

    this.init();
  }

  init() {
    this.thumbnailContainer.addEventListener("click", event => {
      const selectedThumbnail = event.target.closest('.thumbnail');
      const mediaId = selectedThumbnail.dataset.thumbnailId;
      const activeMedia = this.querySelector(`[data-media-id="${mediaId}"]`);

      this.productImages.forEach(image => image.classList.add("hide"));
      this.productThumbnails.forEach(thumbnail => thumbnail.dataset.active = false);

      activeMedia.classList.remove("hide");
      selectedThumbnail.dataset.active = true;
    })
  }
}
