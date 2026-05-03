import { Locator, Page } from "@playwright/test";

class CheckoutOverviewPage {
  private page: Page;
  readonly product_name: Locator;
  readonly product_price: Locator;
  readonly cancel: Locator;
  readonly finish: Locator;
  readonly remove: Locator;
  readonly payment_info: Locator;
  readonly shipping_info: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total : Locator;

  constructor(page: Page) {
    this.page = page;
    this.product_name = page.locator(".inventory_item_name");
    this.product_price = page.locator(".inventory_item_price");
    this.cancel = page.locator("#cancel");
    this.finish = page.locator("#finish");
    this.remove = page.locator(".remove-sauce-labs-bike-light");
    this.payment_info = page.locator("[data-test='payment-info-value']");
    this.shipping_info = page.locator("[data-test='shipping-info-value']");
    this.subtotal = page.locator(".summary_subtotal_label");
    this.tax = page.locator(".summary_tax_label");
    this.total = page.locator("summary_total_label");
  }
}

export default CheckoutOverviewPage;
