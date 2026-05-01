import { Page, Locator } from "@playwright/test";

/**
 * ProductsPage class handles operations related to the Products page of the application.
 */
class ProductsPage {
  private page: Page;
  readonly heading_products: Locator;
  readonly products: Locator;
  readonly product_images: Locator;
  readonly product_name: Locator;
  readonly product_description: Locator;
  readonly product_price: Locator;
  readonly product_add_to_cart: Locator;
  readonly product_sort_container: Locator;

  // Elements

  /**
   * Initializes locators for the Products page elements.
   * @param page - The Playwright Page instance.
   */
  constructor(page: Page) {
    this.page = page;
    this.heading_products = page.locator(".title");
    this.products = page.locator(".inventory_item");
    this.product_images = page.locator(".inventory_item_img");
    this.product_name = page.locator(".inventory_item_name");
    this.product_description = page.locator(".inventory_item_desc");
    this.product_price = page.locator(".inventory_item_price");
    this.product_add_to_cart = page.locator(".btn_inventory");
    this.product_sort_container = page.locator(".product_sort_container");
  }

  // Operations/Methods
}

/**
 * Exports the ProductsPage class as the default export of this module.
 * @module ProductsPage
 */
export default ProductsPage;
