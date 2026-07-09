import { test, expect } from "@playwright/test";

import CartPage from "../pages/CartPage";
import VerificationUtils from "../utils/VerificationUtils";
import BasePage from "../pages/BasePage";
import LoginPage from "../pages/LoginPage";
import Components from "../pages/Components";
import CheckoutPage from "../pages/CheckoutPage";

test.beforeEach(async ({ page }) => {
  // Navigate to application and Login
  await page.goto("/");
  const loginPage = new LoginPage(page);
  await loginPage.loginToApplicationWithValidCredentials();
});

test.describe("Cart", () => {
  test("Static Messages. Validate that User is able to see elements in Cart component.", async ({ page }) => {
    const cartPage = new CartPage(page);
    const basePage = new BasePage();
    const components = new Components(page);

    // Click on Cart icon
    await basePage.clickOnWebElement(components.header_icon_cart, "Header: Cart icon");

    // Verify the Page URL
    VerificationUtils.pageHasUrl(page, "cart.html"); // baseUrl value will be fetched from playwright.config.ts file

    // Verify the Page Title
    VerificationUtils.pageHasTitle(page, "Swag Labs");

    // Verify Cart Action Buttons are visible
    VerificationUtils.elementIsVisible(cartPage.link_continue_shopping, "Cart: Continue Shopping link");
    VerificationUtils.elementIsVisible(cartPage.link_checkout, "Cart: Checkout link");

    // Verify Cart Table Headers are displayed correctly
    VerificationUtils.elementHasText(cartPage.text_QTY, "QTY");
    VerificationUtils.elementHasText(cartPage.text_Description, "Description");
  });

  test("Verify cart becomes empty after removing product", async ({ page }) => {
    const basePage = new BasePage();
    const checkout = new CheckoutPage(page);
    const components = new Components(page);
    const cartPage = new CartPage(page);

    await page.goto("/inventory.html");

    // Add product to cart and verify cart badge is updatedge
    await basePage.clickOnWebElement(checkout.product_add_to_cart.first(), "Add to cart");
    await expect(cartPage.shopping_cart_badge).toHaveText("1");

    // Navigate to cart page and verify product is added
    await components.click_header_icon_cart();
    await expect(page).toHaveURL("/cart.html");
    await expect(cartPage.cart_item).toHaveCount(1);

    // Remove product from cart
    await basePage.clickOnWebElement(cartPage.remove_button.first(), "Remove");

    // Verify cart is empty and badge is reset
    await expect(cartPage.cart_item).toHaveCount(0);
    await expect(cartPage.shopping_cart_badge).toHaveCount(0);
  });
});
