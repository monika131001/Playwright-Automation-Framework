import { Page, Locator } from "@playwright/test";

/**
 * CartPage class handles operations related to the Cart page of the application.
 */
class CartPage {
  // Elements
  private page: Page;
  readonly heading_your_cart: Locator;
  readonly link_continue_shopping: Locator;
  readonly link_checkout: Locator;
  readonly text_QTY: Locator;
  readonly text_Description: Locator;




  /**
   * Initializes the CartPage instance with page elements.
   * @param {Page} page - The Playwright page object.
   */
  constructor(page: Page) {
    this.page = page;
    this.heading_your_cart = page.locator(".title");
    this.link_continue_shopping = page.getByRole("button", {name: "Continue Shopping",
    });
    this.link_checkout = page.getByRole("button", {name: "Checkout",
    });
    this.text_QTY = page.locator(".cart_quantity_label");
    this.text_Description = page.locator(".cart_desc_label");
  }

  // Operations/Methods
}

/**
 * Exports the CartPage class as the default export of this module.
 * @module CartPage
 */
export default CartPage;
