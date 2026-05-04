import { Page, Locator } from "@playwright/test";

/**
 * CartPage class handles operations related to the Cart page of the application.
 */
class CartPage {
  // Elements
  private page: Page;

  readonly cart_item: Locator;
  readonly cart_item_name: Locator;

  readonly heading_your_cart: Locator;
  readonly text_QTY: Locator;
  readonly text_Description: Locator;

  readonly link_continue_shopping: Locator;
  readonly link_checkout: Locator;
  readonly remove_button: Locator;
  readonly shopping_cart_badge: Locator;

  /**
   * Initializes the CartPage instance with page elements.
   * @param {Page} page - The Playwright page object.
   */
  constructor(page: Page) {
    this.page = page;

    // Cart items and product details
    this.cart_item = page.locator(".cart_item");
    this.cart_item_name = page.locator(".inventory_item_name");

    // Cart page header
    this.heading_your_cart = page.locator(".title");

    // Cart table column headers (QTY / Description)
    this.text_QTY = page.locator(".cart_quantity_label");
    this.text_Description = page.locator(".cart_desc_label");

    // Cart item action
    this.remove_button = page.locator(".cart_button");

    // Cart navigation actions
    this.link_continue_shopping = page.getByRole("button", { name: "Continue Shopping" });
    this.link_checkout = page.getByRole("button", { name: "Checkout" });

    // Cart badge
    this.shopping_cart_badge = page.locator(".shopping_cart_badge");
  }

  // Operations/Methods
}

/**
 * Exports the CartPage class as the default export of this module.
 * @module CartPage
 */
export default CartPage;
