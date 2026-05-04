import { Locator, Page } from "@playwright/test";

class CheckoutOverviewPage {
  private page: Page;
  readonly product_name: Locator;
  readonly product_price: Locator;

  readonly payment_info: Locator;
  readonly shipping_info: Locator;

  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;

  readonly cancel: Locator;
  readonly finish: Locator;

  readonly complete_header: Locator;
  readonly complete_text: Locator;
  readonly back_home_button: Locator;

  constructor(page: Page) {
    this.page = page;

    // Product details
    this.product_name = page.locator(".inventory_item_name");
    this.product_price = page.locator(".inventory_item_price");

    // Payment & shipping information
    this.payment_info = page.locator("[data-test='payment-info-value']");
    this.shipping_info = page.locator("[data-test='shipping-info-value']");

    // Price summary details
    this.subtotal = page.locator(".summary_subtotal_label");
    this.tax = page.locator(".summary_tax_label");
    this.total = page.locator(".summary_total_label");

    // Checkout actions
    this.cancel = page.locator("#cancel");
    this.finish = page.locator("#finish");

    // Order completion (thank you page content)
    this.complete_header = page.locator(".complete-header");
    this.complete_text = page.locator(".complete-text");
    this.back_home_button = page.locator("#back-to-products");
  }
}

export default CheckoutOverviewPage;
