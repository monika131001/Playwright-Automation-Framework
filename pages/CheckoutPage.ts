import { Locator, Page } from "@playwright/test";

class CheckoutPage {
  private page: Page;

  // Product action on products page (add item to cart)
  readonly product_add_to_cart: Locator;

  //  Cart navigation
  readonly shopping_cart_link: Locator;

  // Checkout form inputs
  readonly checkout_first_name: Locator;
  readonly checkout_last_name: Locator;
  readonly checkout_postal_code: Locator;

  // Checkout form actions
  readonly checkout_cancel: Locator;
  readonly checkout_continue: Locator;

  constructor(page: Page) {
    this.page = page;
    this.product_add_to_cart = page.locator(".btn_inventory");
    this.shopping_cart_link = page.locator(".shopping_cart_link");

    this.checkout_first_name = page.locator("#first-name");
    this.checkout_last_name = page.locator("#last-name");
    this.checkout_postal_code = page.locator("#postal-code");

    this.checkout_cancel = page.locator("#cancel");
    this.checkout_continue = page.locator("#continue");
  }
}

export default CheckoutPage;
