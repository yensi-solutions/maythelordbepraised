/**
 * Record showcase videos of INTERNAL pages (post-login) for both portals.
 * Each test = one scene clip. Combined later with ffmpeg.
 *
 * Run: npx playwright test --project=showcase-internal
 */
import { test, expect, Page } from "@playwright/test";

const PASTOR = "http://localhost:15780";
const FOLLOWER = "http://localhost:15781";

async function smoothScroll(page: Page, distance: number, steps = 8) {
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, distance / steps);
    await page.waitForTimeout(120);
  }
}

async function pause(page: Page, ms = 2500) {
  await page.waitForTimeout(ms);
}

// Set dev token in localStorage before navigating
async function setDevToken(page: Page, token: string) {
  await page.addInitScript((t) => {
    localStorage.setItem("access_token", t);
  }, token);
}

// ─── PASTOR PORTAL SCENES ───────────────────────────────

test.describe("Pastor Portal — Internal Pages", () => {
  test.beforeEach(async ({ page }) => {
    await setDevToken(page, "dev-pastor-token");
  });

  test("P01 — Dashboard overview", async ({ page }) => {
    await page.goto(`${PASTOR}/dashboard`);
    await page.waitForSelector('text=Dashboard');
    await pause(page, 3000);
    // Show stat cards
    await pause(page, 2000);
    // Scroll to see bookings and prayers
    await smoothScroll(page, 400);
    await pause(page, 3000);
    await smoothScroll(page, -400);
    await pause(page, 1500);
  });

  test("P02 — Profile management", async ({ page }) => {
    await page.goto(`${PASTOR}/dashboard/profile`);
    await page.waitForSelector('text=My Profile');
    await pause(page, 2500);
    // Show the form fields populated
    await smoothScroll(page, 300);
    await pause(page, 2500);
    await smoothScroll(page, -300);
    await pause(page, 1500);
  });

  test("P03 — Services catalog", async ({ page }) => {
    await page.goto(`${PASTOR}/dashboard/services`);
    await page.waitForSelector('text=Services');
    await pause(page, 2500);
    // Show service cards
    await smoothScroll(page, 200);
    await pause(page, 2500);
    await smoothScroll(page, -200);
    await pause(page, 1500);
  });

  test("P04 — Availability schedule", async ({ page }) => {
    await page.goto(`${PASTOR}/dashboard/availability`);
    await page.waitForSelector('text=Availability');
    await pause(page, 2500);
    // Show day toggles and time slots
    await smoothScroll(page, 300);
    await pause(page, 2500);
    await smoothScroll(page, -300);
    await pause(page, 1500);
  });

  test("P05 — Bookings management", async ({ page }) => {
    await page.goto(`${PASTOR}/dashboard/bookings`);
    await page.waitForSelector('text=Bookings');
    await pause(page, 2500);
    // Show booking cards with status tags
    await smoothScroll(page, 200);
    await pause(page, 2500);
    await smoothScroll(page, -200);
    await pause(page, 1500);
  });

  test("P06 — Prayer requests", async ({ page }) => {
    await page.goto(`${PASTOR}/dashboard/prayers`);
    await page.waitForSelector('text=Prayer Requests');
    await pause(page, 2500);
    // Show prayers with response inputs
    await smoothScroll(page, 400);
    await pause(page, 2500);
    await smoothScroll(page, -400);
    await pause(page, 1500);
  });

  test("P07 — Giving dashboard", async ({ page }) => {
    await page.goto(`${PASTOR}/dashboard/giving`);
    await page.waitForSelector('text=Giving');
    await pause(page, 2500);
    // Show stat cards and donation history
    await smoothScroll(page, 200);
    await pause(page, 2500);
    await smoothScroll(page, -200);
    await pause(page, 1500);
  });
});

// ─── FOLLOWER PORTAL SCENES ─────────────────────────────

test.describe("Follower Portal — Internal Pages", () => {
  test.beforeEach(async ({ page }) => {
    await setDevToken(page, "dev-follower-token");
  });

  test("F01 — Browse pastors", async ({ page }) => {
    await page.goto(`${FOLLOWER}/pastors`);
    await page.waitForSelector('text=Find a Pastor');
    await pause(page, 3000);
    // Show pastor cards
    await smoothScroll(page, 300);
    await pause(page, 2500);
    await smoothScroll(page, -300);
    await pause(page, 1500);
  });

  test("F02 — Pastor detail page", async ({ page }) => {
    await page.goto(`${FOLLOWER}/pastors`);
    await page.waitForSelector('text=Find a Pastor');
    await pause(page, 1500);
    // Click first pastor's "View Profile" button
    const viewBtn = page.locator('text=View Profile').first();
    if (await viewBtn.isVisible()) {
      await viewBtn.click();
      await pause(page, 3000);
      // Show pastor details, services, availability
      await smoothScroll(page, 400);
      await pause(page, 2500);
      await smoothScroll(page, -400);
      await pause(page, 1500);
    } else {
      await pause(page, 3000);
    }
  });

  test("F03 — Prayer wall", async ({ page }) => {
    await page.goto(`${FOLLOWER}/prayers`);
    await page.waitForSelector('text=Prayer Wall');
    await pause(page, 2500);
    // Show submit form and prayer cards
    await smoothScroll(page, 500);
    await pause(page, 3000);
    await smoothScroll(page, -500);
    await pause(page, 1500);
  });

  test("F04 — My bookings", async ({ page }) => {
    await page.goto(`${FOLLOWER}/bookings`);
    await page.waitForSelector('text=My Bookings');
    await pause(page, 2500);
    // Show booking cards
    await smoothScroll(page, 200);
    await pause(page, 2500);
    await smoothScroll(page, -200);
    await pause(page, 1500);
  });

  test("F05 — Giving page", async ({ page }) => {
    await page.goto(`${FOLLOWER}/give`);
    await page.waitForSelector('text=Give');
    await pause(page, 2500);
    // Show preset amounts and form
    await smoothScroll(page, 200);
    await pause(page, 2500);
    await smoothScroll(page, -200);
    await pause(page, 1500);
  });
});
