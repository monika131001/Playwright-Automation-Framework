import test, { expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import Components from "../pages/Components";
import CheckoutPage from "../pages/CheckoutPage";
import BasePage from "../pages/BasePage";
import CartPage from "../pages/CartPage";

/**
 * Setup:
 * - Login to application
 * - Add product to cart
 * - Navigate to checkout step-one page
 */
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  const loginPage = new LoginPage(page);
  const components = new Components(page);
  const checkout = new CheckoutPage(page);
  const basePage = new BasePage();
  const cartPage = new CartPage(page);

  await loginPage.loginToApplicationWithValidCredentials();

  // Add product to cart and navigate to cart page
  await basePage.clickOnWebElement(checkout.product_add_to_cart.first(), "Add to cart");
  await components.click_header_icon_cart();
  await expect(page).toHaveURL("/cart.html");

  // Proceed to checkout step one
  await basePage.clickOnWebElement(cartPage.link_checkout, "Cart: Checkout link");
  await expect(page).toHaveURL("/checkout-step-one.html");
});

/**
 * Validate error when First Name is empty.
 */
test("Checkout with empty first name", async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);

  // Attempt to continue without filling any field
  await checkoutPage.checkout_continue.click();

  // Verify error message for missing first name
  await expect(checkoutPage.error).toContainText("First Name is required");
});

/**
 * Validate error when Last Name is empty.
 */
test("Checkout with empty last name", async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);

  // Fill only first name
  await checkoutPage.checkout_first_name.fill("John");

  // Attempt to continue
  await checkoutPage.checkout_continue.click();

  // Verify error message for missing last name
  await expect(checkoutPage.error).toContainText("Last Name is required");
});

/**
 * Validate error when Postal Code is empty.
 */
test("Checkout with empty Postal Code", async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);

  // Fill first and last name, leave postal code empty
  await checkoutPage.checkout_first_name.fill("John");
  await checkoutPage.checkout_last_name.fill("Doe");

  // Attempt to continue
  await checkoutPage.checkout_continue.click();

  // Verify error message for missing postal code
  await expect(checkoutPage.error).toContainText("Postal Code is required");
});
