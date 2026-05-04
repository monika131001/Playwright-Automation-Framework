import test, { expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import VerificationUtils from "../utils/VerificationUtils";
import BasePage from "../pages/BasePage";
import CheckoutPage from "../pages/CheckoutPage";
import CartPage from "../pages/CartPage";
import CheckoutOverviewPage from "../pages/CheckoutOverviewPage";
import ProductsPage from "../pages/ProductsPage";
import Components from "../pages/Components";

test.beforeEach(async ({ page }) => {
  // Navigate to application and Login
  await page.goto("/");
  const loginPage = new LoginPage(page);
  await loginPage.loginToApplicationWithValidCredentials();
});

test("End to end checkout flow", async ({ page }) => {
  // Initialize page objects
  const basePage = new BasePage();
  const components = new Components(page);
  const checkout = new CheckoutPage(page);
  const cartPage = new CartPage(page);
  const checkoutOverview = new CheckoutOverviewPage(page);
  const productsPage = new ProductsPage(page);

  // Navigate to products page and capture first product details for later validation
  await page.goto("/inventory.html");
  const productName = await productsPage.product_name.first().innerText();
  const productPrice = await productsPage.product_price.first().innerText();

  // Add product to cart and navigate to cart page
  await basePage.clickOnWebElement(checkout.product_add_to_cart.first(), "Add to cart");
  await components.click_header_icon_cart();
  await expect(page).toHaveURL("/cart.html");

  // Verify cart has items and key action buttons are visible
  expect(await cartPage.cart_item.count()).toBeGreaterThan(0);
  VerificationUtils.elementIsVisible(cartPage.link_continue_shopping, "Cart: Continue Shopping link");
  VerificationUtils.elementIsVisible(cartPage.link_checkout, "Cart: Checkout link");

  // Proceed to checkout step one
  basePage.clickOnWebElement(cartPage.link_checkout, "Cart: Checkout link");
  await expect(page).toHaveURL("/checkout-step-one.html");

  // Verify checkout form fields and action buttons
  VerificationUtils.elementIsVisible(checkout.checkout_first_name, "Checkout: First Name");
  VerificationUtils.elementIsVisible(checkout.checkout_last_name, "Checkout: Last Name");
  VerificationUtils.elementIsVisible(checkout.checkout_postal_code, "Checkout: Postal Code");
  VerificationUtils.elementIsVisible(checkout.checkout_cancel, "Checkout: Cancel");
  VerificationUtils.elementIsVisible(checkout.checkout_continue, "Checkout: Continue");

  // Fill checkout details and continue
  await basePage.fillTextBox(checkout.checkout_first_name, "John", "Checkout: First Name");
  await basePage.fillTextBox(checkout.checkout_last_name, "Doe", "Checkout: Last Name");
  await basePage.fillTextBox(checkout.checkout_postal_code, "12345", "Checkout: Postal Code");
  await basePage.clickOnWebElement(checkout.checkout_continue, "Checkout: Continue");

  // Verify navigation to checkout overview page
  await expect(page).toHaveURL("/checkout-step-two.html");

  // Validate selected product details are correctly carried forward
  await expect(checkoutOverview.product_name.first()).toHaveText(productName);
  await expect(checkoutOverview.product_price.first()).toHaveText(productPrice);

  // await basePage.clickOnWebElement(checkoutOverview.remove.first(), "Remove");
  // await expect(VerificationUtils.elementIsNotVisible(checkoutOverview.product_name.first(), "poduct name"));

  // Validate payment and shipping information
  await expect(checkoutOverview.payment_info).toHaveText("SauceCard #31337");
  await expect(checkoutOverview.shipping_info).toHaveText("Free Pony Express Delivery!");

  // Extract subtotal, tax, and total values from checkout overview UI
  const subtotalText = await checkoutOverview.subtotal.innerText();
  const taxText = await checkoutOverview.tax.innerText();
  const totalText = await checkoutOverview.total.innerText();

  // Convert extracted string values into numeric format for calculation
  const subtotal = parseFloat(subtotalText.replace(/[^\d.]/g, ""));
  const tax = parseFloat(taxText.replace(/[^\d.]/g, ""));
  const total = parseFloat(totalText.replace(/[^\d.]/g, ""));

  // Validate that total amount is correctly calculated (subtotal + tax)
  expect(total).toBeCloseTo(subtotal + tax, 2);

  // Complete checkout and verify order confirmation page
  await basePage.clickOnWebElement(checkoutOverview.finish, "Finish");
  await expect(page).toHaveURL("/checkout-complete.html");

  // Validate success message and confirmation text
  await expect(checkoutOverview.complete_header).toHaveText("Thank you for your order!");
  await expect(checkoutOverview.complete_text).toContainText("Your order has been dispatched");

  // Verify navigation back to products page and cart reset
  expect(VerificationUtils.elementIsVisible(checkoutOverview.back_home_button, "Back home button"));
  await basePage.clickOnWebElement(checkoutOverview.back_home_button, "Back home button");
  await expect(page).toHaveURL("/inventory.html");
  expect(await cartPage.cart_item.count()).toBe(0);
});
