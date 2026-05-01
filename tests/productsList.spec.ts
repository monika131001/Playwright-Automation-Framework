import test from "@playwright/test";
import VerificationUtils from "../utils/VerificationUtils";
import ProductsPage from "../pages/ProductsPage";
import LoginPage from "../pages/LoginPage";

test.beforeEach(async ({ page }) => {
  // Navigate to application and Login
  await page.goto("/");
  const loginPage = new LoginPage(page);
  await loginPage.loginToApplicationWithValidCredentials();
});

test("Verify Product Listing Page UI", async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await page.goto("/inventory.html");

    VerificationUtils.elementIsVisible(productsPage.product_sort_container, "Product Sort Container")
  
    const count = await productsPage.products.count();
        VerificationUtils.elementsCount(productsPage.products, "products", 6);

    for(let i = 0; i < count; i++) {
        const product = productsPage.products.nth(i);

        VerificationUtils.elementIsVisible(product.locator(".inventory_item_name"), `Product Name[${i}]`);
  }

//   VerificationUtils.elementsCount(productsPage.product_images, "product images", 6);

//   VerificationUtils.elementIsVisible(productsPage.product_description, "Product Description");
//   VerificationUtils.elementIsVisible(productsPage.product_price, "Product Price");
//   VerificationUtils.elementIsVisible(productsPage.product_add_to_cart, "Product Add to Cart");


});
