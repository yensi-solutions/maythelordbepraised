/**
 * Capture full-page screenshots of all internal pages for PDF brochures.
 * Run: npx playwright test --project=pdf-screenshots
 */
import { test, Page } from "@playwright/test";

const PASTOR = "http://localhost:15780";
const FOLLOWER = "http://localhost:15781";
const OUT = "e2e/results/pdf-shots";

async function setDevToken(page: Page, token: string) {
  await page.addInitScript((t) => {
    localStorage.setItem("access_token", t);
  }, token);
}

async function waitAndShot(page: Page, url: string, name: string) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
}

test.describe("Pastor Portal screenshots", () => {
  test.beforeEach(async ({ page }) => {
    await setDevToken(page, "dev-pastor-token");
  });

  test("Pastor — all pages", async ({ page }) => {
    await waitAndShot(page, `${PASTOR}/dashboard`, "pastor-dashboard");
    await waitAndShot(page, `${PASTOR}/dashboard/profile`, "pastor-profile");
    await waitAndShot(page, `${PASTOR}/dashboard/services`, "pastor-services");
    await waitAndShot(page, `${PASTOR}/dashboard/availability`, "pastor-availability");
    await waitAndShot(page, `${PASTOR}/dashboard/bookings`, "pastor-bookings");
    await waitAndShot(page, `${PASTOR}/dashboard/prayers`, "pastor-prayers");
    await waitAndShot(page, `${PASTOR}/dashboard/giving`, "pastor-giving");
  });
});

test.describe("Follower Portal screenshots", () => {
  test.beforeEach(async ({ page }) => {
    await setDevToken(page, "dev-follower-token");
  });

  test("Follower — all pages", async ({ page }) => {
    await waitAndShot(page, `${FOLLOWER}/pastors`, "follower-browse-pastors");
    await waitAndShot(page, `${FOLLOWER}/prayers`, "follower-prayer-wall");
    await waitAndShot(page, `${FOLLOWER}/bookings`, "follower-bookings");
    await waitAndShot(page, `${FOLLOWER}/give`, "follower-giving");
  });
});

test("Landing pages", async ({ page }) => {
  await page.goto(`${PASTOR}/?novideo`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/pastor-landing.png`, fullPage: true });

  await page.goto(`${FOLLOWER}/?novideo`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/follower-landing.png`, fullPage: true });
});
