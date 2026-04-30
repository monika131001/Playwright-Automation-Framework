import { test, expect } from "@playwright/test";

import CartPage from "../pages/CartPage";
import VerificationUtils from "../utils/VerificationUtils";
import BasePage from "../pages/BasePage";
import LoginPage from "../pages/LoginPage";
import Components from "../pages/Components";

test.beforeEach(async ({ page }) => {
  // Navigate to application and Login
  await page.goto("/");
  const loginPage = new LoginPage(page);
  await loginPage.loginToApplicationWithValidCredentials();
});

test.describe("Cart", () => {

  test("Static Messages. Validate that User is able to see elements in Cart component.", async ({
    page,
  }) => {
    const cartPage = new CartPage(page);
    const basePage = new BasePage();
    const components = new Components(page);

    // Click on Cart icon
    await basePage.clickOnWebElement(components.header_icon_cart,"Header: Cart icon",
    );

    // Verify the Page URL
    VerificationUtils.pageHasUrl(page, "cart.html"); // baseUrl value will be fetched from playwright.config.ts file

    // Verify the Page Title
    VerificationUtils.pageHasTitle(page, "Swag Labs");

    VerificationUtils.elementIsVisible(
      cartPage.link_continue_shopping,
      "Cart: Continue Shopping link",
    );
    VerificationUtils.elementIsVisible(
      cartPage.link_checkout,
      "Cart: Checkout link",
    );

    VerificationUtils.elementHasText(cartPage.text_QTY, "QTY");
    VerificationUtils.elementHasText(cartPage.text_Description, "Description");
  });
});
