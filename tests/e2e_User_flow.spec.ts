import test, { expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import VerificationUtils from "../utils/VerificationUtils";
import BasePage from "../pages/BasePage";
import CheckoutPage from "../pages/CheckoutPage";
import CartPage from "../pages/CartPage";

test.beforeEach(async ({ page }) => {
  // Navigate to application and Login
  await page.goto("/");
  const loginPage = new LoginPage(page);
  await loginPage.loginToApplicationWithValidCredentials();
});

test("End to end checkout flow", async ({ page }) => {
  const basePage = new BasePage();
  const checkout = new CheckoutPage(page);
  const cartPage = new CartPage(page);

  await page.goto("/inventory.html");
  await basePage.clickOnWebElement(checkout.product_add_to_cart.first(), "Add to cart");
  await basePage.clickOnWebElement(checkout.shopping_cart_link, "Shopping cart link");
  await expect(page).toHaveURL("/cart.html");
  expect(await cartPage.cart_item.count()).toBeGreaterThan(0);

  VerificationUtils.elementIsVisible(cartPage.link_continue_shopping, "Cart: Continue Shopping link");
  VerificationUtils.elementIsVisible(cartPage.link_checkout, "Cart: Checkout link");
  1;

  basePage.clickOnWebElement(cartPage.link_checkout, "Cart: Checkout link");
  await expect(page).toHaveURL("/checkout-step-one.html");

  VerificationUtils.elementIsVisible(checkout.checkout_first_name, "Checkout: First Name");
  VerificationUtils.elementIsVisible(checkout.checkout_last_name, "Checkout: Last Name");
  VerificationUtils.elementIsVisible(checkout.checkout_postal_code, "Checkout: Postal Code");

  VerificationUtils.elementIsVisible(checkout.checkout_cancel, "Checkout: Cancel");
  VerificationUtils.elementIsVisible(checkout.checkout_continue, "Checkout: Continue");

  await basePage.fillTextBox(checkout.checkout_first_name, "John", "Checkout: First Name");
  await basePage.fillTextBox(checkout.checkout_last_name, "Doe", "Checkout: Last Name");
  await basePage.fillTextBox(checkout.checkout_postal_code, "12345", "Checkout: Postal Code");

  await basePage.clickOnWebElement(checkout.checkout_continue, "Checkout: Continue");

  await expect(page).toHaveURL("/checkout-step-two.html");
});
