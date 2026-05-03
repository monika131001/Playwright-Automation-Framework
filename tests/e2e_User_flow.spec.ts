import test, { expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import VerificationUtils from "../utils/VerificationUtils";
import BasePage from "../pages/BasePage";
import CheckoutPage from "../pages/CheckoutPage";
import CartPage from "../pages/CartPage";
import CheckoutOverviewPage from "../pages/CheckoutOverviewPage";
import ProductsPage from "../pages/ProductsPage";

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
  const checkoutOverview = new CheckoutOverviewPage(page);
  const productsPage = new ProductsPage(page);

  await page.goto("/inventory.html");
  const productName = await productsPage.product_name.first().innerText();
  const productPrice = await productsPage.product_price.first().innerText();
  console.log("productName" + productName, "productPrice" + productPrice);

  await basePage.clickOnWebElement(checkout.product_add_to_cart.first(), "Add to cart");
  await basePage.clickOnWebElement(checkout.shopping_cart_link, "Shopping cart link");
  await expect(page).toHaveURL("/cart.html");
  expect(await cartPage.cart_item.count()).toBeGreaterThan(0);

  VerificationUtils.elementIsVisible(cartPage.link_continue_shopping, "Cart: Continue Shopping link");
  VerificationUtils.elementIsVisible(cartPage.link_checkout, "Cart: Checkout link");

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

  await expect(checkoutOverview.product_name.first()).toHaveText(productName);
  await expect(checkoutOverview.product_price.first()).toHaveText(productPrice);

  // await basePage.clickOnWebElement(checkoutOverview.remove.first(), "Remove");
  // await expect(VerificationUtils.elementIsNotVisible(checkoutOverview.product_name.first(), "poduct name"));

  await expect(checkoutOverview.payment_info).toHaveText("SauceCard #31337");
  await expect(checkoutOverview.shipping_info).toHaveText("Free Pony Express Delivery!");

  // const subtotalText = checkoutOverview.subtotal.innerText();
  // await expect(subtotalText).toContainText(productPrice);
  // await expect(checkoutOverview.tax).toBeVisible();
  // const totalText = await checkoutOverview.total.innerText();
  // const total = parseFloat(totalText.replace("$", ""));
  // const subtotal = parseFloat((await subtotalText).replace("$", ""));
  // await expect(total).toBeCloseTo(total + checkoutOverview.tax);
});
