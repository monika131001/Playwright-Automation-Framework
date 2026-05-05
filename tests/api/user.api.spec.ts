import { test, expect } from "@playwright/test";

test("Verify users API returns valid data", async ({ request }) => {
  // Send GET request to fetch users
  const response = await request.get("https://jsonplaceholder.typicode.com/users");

  // Validate response status
  expect(response.status()).toBe(200);
  const body = await response.json();

  // Validate response is an array and not empty
  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);

  // Validate structure of first user object
  expect(body[0]).toHaveProperty("id");
  expect(body[0]).toHaveProperty("name");
  expect(body[0]).toHaveProperty("email");

  // Validate email format (basic check)
  expect(body[0].email).toMatch(/.+@.+\..+/);
});
