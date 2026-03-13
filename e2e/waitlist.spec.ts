import { test, expect } from "@playwright/test";

const PASTOR_PORTAL = "http://localhost:15780";
const FOLLOWER_PORTAL = "http://localhost:15781";
const API = "http://localhost:15782/api/v1";

test.describe("Waitlist Feature", () => {
  test("01 — Pastor Portal shows waitlist form in hero", async ({ page }) => {
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "e2e/results/waitlist-01-pastor-hero.png" });
    await page.screenshot({ path: "e2e/results/waitlist-01-pastor-fullpage.png", fullPage: true });
  });

  test("02 — Follower Portal shows waitlist form in hero", async ({ page }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "e2e/results/waitlist-02-follower-hero.png" });
    await page.screenshot({ path: "e2e/results/waitlist-02-follower-fullpage.png", fullPage: true });
  });

  test("03 — Waitlist signup from pastor portal", async ({ page }) => {
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.fill("pastor.demo@example.com");
    await page.screenshot({ path: "e2e/results/waitlist-03-filled.png" });

    await page.locator('button:has-text("Join Waitlist")').first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "e2e/results/waitlist-03-success.png" });
  });

  test("04 — Waitlist signup from follower portal", async ({ page }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.fill("follower.demo@example.com");
    await page.locator('button:has-text("Join Waitlist")').first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "e2e/results/waitlist-04-success.png" });
  });

  test("05 — API has both signups", async ({ request }) => {
    const res = await request.get(`${API}/waitlist`, {
      headers: {
        Authorization: "Basic " + btoa("admin:change-me-in-production"),
      },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.total).toBeGreaterThanOrEqual(2);
    expect(data.by_source).toHaveProperty("pastor-portal");
    expect(data.by_source).toHaveProperty("follower-portal");
  });

  test("06 — Admin waitlist dashboard login", async ({ page }) => {
    await page.goto(`${PASTOR_PORTAL}/admin/waitlist`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);
    await page.screenshot({ path: "e2e/results/waitlist-06-admin-login.png" });

    await page.fill('input[placeholder="Username"]', "admin");
    await page.fill('input[placeholder="Password"]', "change-me-in-production");
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: "e2e/results/waitlist-06-admin-dashboard.png" });
  });
});
