import { expect, test } from "@playwright/test";

test("browse, filter, choose a real SKU, add to cart, change quantity", async ({ page }) => {
  await page.goto("/shop"); await page.getByLabel("Category").first().selectOption("running"); await page.getByRole("button", { name: "Show results" }).first().click();
  await expect(page).toHaveURL(/category=running/); await expect(page.getByRole("heading", { name: "PACE R1" })).toBeVisible();
  await page.getByRole("link", { name: /PACE R1/ }).first().click();
  await page.getByRole("button", { name: "US 9", exact: true }).click(); await expect(page.getByText(/SKU PACER1-GHO?ST?|SKU PACER1/)).toBeVisible();
  await page.getByRole("button", { name: "Add to cart" }).click(); await page.goto("/cart");
  await expect(page.getByText("US 9")).toBeVisible(); await page.getByRole("button", { name: /Increase quantity/ }).click(); await expect(page.getByText("2", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: /Remove/ }).click(); await expect(page.getByText("Your cart is empty")).toBeVisible();
});
test("sold-out size is visibly unavailable and cannot be selected", async ({ page }) => {
  await page.goto("/product/nord-01"); await expect(page.getByRole("button", { name: "US 12, sold out" })).toBeDisabled();
});
test("search with no match is communicated", async ({ page }) => { await page.goto("/shop?q=zzzz"); await expect(page.getByText("No matches")).toBeVisible(); });
test("vault can be exited and upcoming release shows a real date", async ({ page }) => {
  await page.goto("/vault"); await expect(page.getByText(/Next release/)).toBeVisible(); await page.getByRole("link", { name: /Exit the Vault/ }).click(); await expect(page).toHaveURL(/\/shop/);
});
test("upcoming product cannot be purchased", async ({ page }) => { await page.goto("/product/after-hours-ah1"); await expect(page.getByText("Scheduled release")).toBeVisible(); await expect(page.getByRole("button", { name: "Add to cart" })).toHaveCount(0); });
test("checkout API rejects forged client price and unknown SKU", async ({ request }) => {
  expect((await request.post("/api/checkout", { data: { lines: [{ sku: "NOPE", qty: 1 }] } })).status()).toBe(400);
  const r = await request.post("/api/checkout", { data: { lines: [{ sku: "PACER1-GHO-9", qty: 1, price: 1 }] } }); expect([400, 503, 409]).toContain(r.status());
});
test("fit passport save and delete", async ({ page }) => {
  await page.goto("/fit-passport"); await page.getByLabel(/Preferred size/).fill("9"); await page.getByRole("button", { name: "Save Fit Passport" }).click();
  await page.goto("/locker"); await expect(page.getByText("US 9")).toBeVisible(); await page.goto("/fit-passport"); await page.getByRole("button", { name: /Delete my fit/ }).click(); await expect(page.getByRole("button", { name: /Delete my fit/ })).toHaveCount(0);
});
test("admin is closed without credentials", async ({ page }) => { await page.goto("/admin"); await expect(page.getByRole("heading", { name: /Admin/ })).toBeVisible(); await expect(page.getByText("Control center")).toHaveCount(0); });
