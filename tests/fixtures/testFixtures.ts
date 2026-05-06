import { test as base } from "@playwright/test";
import LoginPage from "../../pages/LoginPage";
import CartPage from "../../pages/CartPage";

type myFixtures = {
  loginPage: LoginPage;
  cartPage: CartPage;
};

export const test = base.extend<myFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export const expect = test.expect;
