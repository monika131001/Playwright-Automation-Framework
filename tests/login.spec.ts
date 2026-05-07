// @ts-check
import { test, expect } from "@playwright/test";

// Importing page objects
import LoginPage from "../pages/LoginPage";
import ProductsPage from "../pages/ProductsPage";
import Components from "../pages/Components";
import verificationUtils from "../utils/VerificationUtils";
import tagUtils from "../utils/TagUtils";

// Importing test data
import loginCredentials from "../test-data/login_credentials.json";
import BasePage from "../pages/BasePage";

// Extracting credentials for both valid and invalid cases
const { credentials_1, credentials_2, credentials_3, credentials_4, credentials_5 } = loginCredentials.data;

/**
 * Test suite for Sauce Demo login functionality.
 */
test.describe("[LOGIN]", () => {
  /**
   * Before each test, navigate to the application homepage.
   */
  test.beforeEach(async ({ page }) => {
    // Navigate to application
    await page.goto("/");
  });

  /**
   * [LOGIN] Test Case:
   * Validate that a user is able to successfully log in using valid credentials.
   * - Verify Products page heading after login
   * - Verify header logo
   * - Verify footer elements and LinkedIn link
   *
   * Tags: @regression @sanity @bvt
   */
  test(
    "Login with valid credentials. Validate that User is able to login using valid credentials.",
    { tag: [tagUtils.REGRESSION, tagUtils.SANITY, tagUtils.BVT] },
    async ({ page }) => {
      // Perform login with valid credentials
      const loginPage = new LoginPage(page);
      await loginPage.loginToApplication(credentials_1.username, credentials_1.password);

      // Assertions for successful login
      // Verify the heading on the Products page
      const productsPage = new ProductsPage(page);
      verificationUtils.elementHasText(productsPage.heading_products, "Products");

      // Verify the logo on the header
      const components = new Components(page);
      verificationUtils.elementHasText(components.header_logo_swag_labs, "Swag Labs");

      // Verify the copyright message in the footer
      verificationUtils.elementContainsText(
        components.footer_msg_copyright,
        " Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy",
      );

      // Verify that LinkedIn link in the footer is present
      verificationUtils.elementIsVisible(components.footer_link_linkedin, "Footer: LinkedIn link");

      // Verify the href attribute and value for the LinkedIn link in the footer
      verificationUtils.elementHasAttributeAndHasValue(
        components.footer_link_linkedin,
        "Footer: LinkedIn link",
        "href",
        "https://www.linkedin.com/company/sauce-labs/",
      );
    },
  );

  /**
   * [LOGIN] Test Case:
   * Validate that a user is unable to log in using invalid credentials.
   * - Verify the error message for incorrect Username and Password
   *
   * Tags: @regression @sanity
   */
  test(
    "Login with invalid credentials. Validate that User is unable to login using invalid credentials.",
    { tag: [tagUtils.REGRESSION, tagUtils.SANITY] },
    async ({ page }) => {
      // Perform login with invalid credentials
      const loginPage = new LoginPage(page);
      await loginPage.loginToApplication(credentials_2.username, credentials_2.password);

      // Verify the error message for Username and Password mismatch
      verificationUtils.elementContainsText(loginPage.error, "Username and password do not match");
    },
  );

  /**
   * [LOGIN] Test Case:
   * Validate error message when username is blank and password is provided.
   *
   * Tags: @regression @sanity
   */
  test(
    "Login with blank username and valid password",
    { tag: [tagUtils.REGRESSION, tagUtils.SANITY] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Attempt login with blank username
      await loginPage.loginToApplication(credentials_3.username, credentials_3.password);

      // Verify error message for missing username
      verificationUtils.elementContainsText(loginPage.error, "Username is required");
    },
  );

  /**
   * [LOGIN] Test Case:
   * Validate error message when password is blank and username is provided.
   *
   * Tags: @regression @sanity
   */
  test(
    "Login with valid username and blank password",
    { tag: [tagUtils.REGRESSION, tagUtils.SANITY] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Attempt login with blank password
      await loginPage.loginToApplication(credentials_4.username, credentials_4.password);

      // Verify error message for missing password
      verificationUtils.elementContainsText(loginPage.error, "Password is required");
    },
  );

  /**
   * [LOGIN] Test Case:
   * Validate error message when both username and password are blank.
   *
   * Tags: @regression @sanity
   */
  test(
    "Login with blank username and blank password",
    { tag: [tagUtils.REGRESSION, tagUtils.SANITY] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Attempt login with both fields blank
      await loginPage.loginToApplication(credentials_5.username, credentials_5.password);

      // Verify error message prioritizes username validation
      verificationUtils.elementContainsText(loginPage.error, "Username is required");
    },
  );

  test("Verify user logout functionality", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const basePage = new BasePage();
    const components = new Components(page);

    await loginPage.loginToApplicationWithValidCredentials();

    // Click on side panel/hamburger menu icon
    await components.click_side_panel_icon_expand();

    // Click on Logout option from side panel
    await basePage.clickOnWebElement(components.side_panel_link_logout, "Logout");

    // Verify user is redirected to login page after logout
    await expect(page).toHaveURL("/");
  });
});
