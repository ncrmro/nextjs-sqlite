import { test, expect } from "@playwright/test";

test("login page", async ({ page }) => {
  page.on("console", console.log);
  const email = `jdoe@example.com`;
  await page.goto("/login");
  await page.getByPlaceholder("email").fill(email);
  await page.getByPlaceholder("password").fill("password");
  await page.locator("button", { hasText: "Login" }).click();
  await page.waitForURL("/dashboard");
});

test("sign up page", async ({ page }) => {
  page.on("console", console.log);
  const time = Date.now();
  const username = `user${time}`;
  const email = `${username}@test.com`;
  await page.goto("/signup");
  await page.getByPlaceholder("email").fill(email);
  await page.getByPlaceholder("password").fill("testpassword");
  await page.locator("button", { hasText: "Submit" }).click();
  await page.waitForURL("/dashboard");
});
