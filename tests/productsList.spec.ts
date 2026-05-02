import test, { expect } from "@playwright/test";
import VerificationUtils from "../utils/VerificationUtils";
import ProductsPage from "../pages/ProductsPage";
import LoginPage from "../pages/LoginPage";
import BasePage from "../pages/BasePage";

test.beforeEach(async ({ page }) => {
  // Navigate to application and Login
  await page.goto("/");
  const loginPage = new LoginPage(page);
  await loginPage.loginToApplicationWithValidCredentials();
});

test("Verify Product Listing Page UI", async ({ page }) => {
  const productsPage = new ProductsPage(page);

  // Navigate to Product Listing Page
  await page.goto("/inventory.html");

  // Verify Product Sorting section is visible
  VerificationUtils.elementIsVisible(productsPage.product_sort_container, "Product Sort Container");

  // Verify total number of products displayed
  const count = await productsPage.products.count();
  VerificationUtils.elementsCount(productsPage.products, "products", 6);

  // Verify Product Image, Name, Description, Price, and Action Button
  for (let i = 0; i < count; i++) {
    VerificationUtils.elementIsVisible(productsPage.product_image.nth(i), `Product Image [${i}]`);
    VerificationUtils.elementIsVisible(productsPage.product_name.nth(i), `Product Name [${i}]`);
    VerificationUtils.elementIsVisible(productsPage.product_description.nth(i), `Product Description [${i}]`);
    VerificationUtils.elementIsVisible(productsPage.product_price.nth(i), `Product Price [${i}]`);
    VerificationUtils.elementIsVisible(productsPage.product_add_to_cart.nth(i), `Product Add to Cart [${i}]`);
  }
});

test("Verify Add to Cart button changes to Remove", async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const basePage = new BasePage();
  const count = await productsPage.products.count();
  for (let i = 0; i < count; i++) {
    await VerificationUtils.elementHasText(productsPage.product_add_to_cart.nth(i), `Add to cart`);
    await basePage.clickOnWebElement(productsPage.product_add_to_cart.nth(i), `Product Add to Cart [${i}]`);
    await VerificationUtils.elementHasText(productsPage.product_add_to_cart.nth(i), `Remove [${i}]`);
  }
});

test("Verify products are sorted correctly by name and price", async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const basePage = new BasePage();

  // Verify Sorting Options
  await basePage.clickOnWebElement(productsPage.product_sort_container, "Product Sort Container");
  const options = await productsPage.product_sort_container.locator("option").allTextContents();
  console.log(options);

  // Verify Name Sorting (A → Z)
  {
    const names = await productsPage.product_name.allTextContents();
    const sortedNames = [...names].sort();
    await productsPage.product_sort_container.selectOption("az");
    const updatedNames = await productsPage.product_name.allTextContents();
    expect(updatedNames).toEqual(sortedNames);
  }

  // Verify Name Sorting (Z → A)
  {
    const names = await productsPage.product_name.allTextContents();
    const sortedDescNames = [...names].sort().reverse();
    await productsPage.product_sort_container.selectOption("za");
    const updatedDescNames = await productsPage.product_name.allTextContents();
    expect(updatedDescNames).toEqual(sortedDescNames);
  }

  // Verify Price Sorting (Low → High)
  {
    const prices = await productsPage.product_price.allTextContents();
    const priceNumbers = prices.map((p) => parseFloat(p.replace("$", "")));
    const sortedPrices = [...priceNumbers].sort((a, b) => a - b);
    await productsPage.product_sort_container.selectOption("lohi");
    const updatedPrices = await productsPage.product_price.allTextContents();
    const updatedNumbers = updatedPrices.map((p) => parseFloat(p.replace("$", "")));
    expect(updatedNumbers).toEqual(sortedPrices);
  }

  // Verify Price Sorting (High → Low)
  {
    const prices = await productsPage.product_price.allTextContents();
    const priceNumbers = prices.map((p) => parseFloat(p.replace("$", "")));
    const sortedDescPrices = [...priceNumbers].sort((a, b) => a - b).reverse();
    await productsPage.product_sort_container.selectOption("hilo");
    const updatedDescPrices = await productsPage.product_price.allTextContents();
    const updatedDescNumbers = updatedDescPrices.map((p) => parseFloat(p.replace("$", "")));
    expect(updatedDescNumbers).toEqual(sortedDescPrices);
  }
});
