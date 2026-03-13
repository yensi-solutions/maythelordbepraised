/**
 * 🎬 SHOWCASE VIDEO — "Your Ministry, Amplified"
 *
 * A cinematic walkthrough of the entire MayTheLordBePraised platform.
 * Records a dramatic demo video showcasing every feature for embedding
 * on the landing pages.
 *
 * Director's Notes:
 *   - Slow, deliberate movements. Let the UI breathe.
 *   - Zoom into key details (pray counts, dashboard stats, pastor profiles).
 *   - Smooth scroll reveals — no jump cuts.
 *   - Two acts: Pastor's World → Follower's Journey
 *
 * Run: npx playwright test e2e/showcase.spec.ts --project=showcase
 */
import { test, expect, type Page } from "@playwright/test";

const PASTOR_PORTAL = "http://localhost:15780";
const FOLLOWER_PORTAL = "http://localhost:15781";
const API = "http://localhost:15782/api/v1";

// ─── Helpers ───────────────────────────────────────────────────
async function smoothScroll(page: Page, y: number, duration = 1200) {
  await page.evaluate(
    ([scrollY, dur]) => {
      return new Promise<void>((resolve) => {
        const start = window.scrollY;
        const distance = scrollY - start;
        const startTime = performance.now();
        function step(currentTime: number) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / dur, 1);
          // ease-in-out cubic
          const ease =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          window.scrollTo(0, start + distance * ease);
          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        }
        requestAnimationFrame(step);
      });
    },
    [y, duration]
  );
}

async function scrollToBottom(page: Page, stepDuration = 1500) {
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const steps = Math.ceil(totalHeight / (viewportHeight * 0.7));
  for (let i = 1; i <= steps; i++) {
    const target = Math.min(
      i * viewportHeight * 0.7,
      totalHeight - viewportHeight
    );
    await smoothScroll(page, target, stepDuration);
    await page.waitForTimeout(600);
  }
}

async function scrollToTop(page: Page) {
  await smoothScroll(page, 0, 800);
  await page.waitForTimeout(400);
}

async function scrollToElement(page: Page, selector: string) {
  const el = page.locator(selector).first();
  const box = await el.boundingBox();
  if (box) {
    const scrollY = await page.evaluate(() => window.scrollY);
    const target = scrollY + box.y - 100;
    await smoothScroll(page, target, 1000);
    await page.waitForTimeout(500);
  }
}

async function typeSlowly(page: Page, selector: string, text: string) {
  const el = page.locator(selector).first();
  await el.click();
  await page.waitForTimeout(200);
  for (const char of text) {
    await el.press(char === " " ? "Space" : char);
    await page.waitForTimeout(60 + Math.random() * 40);
  }
}

async function pause(page: Page, ms = 1500) {
  await page.waitForTimeout(ms);
}

async function screenshot(page: Page, name: string) {
  await page.screenshot({ path: `e2e/results/showcase-${name}.png` });
}

async function screenshotFull(page: Page, name: string) {
  await page.screenshot({
    path: `e2e/results/showcase-${name}-full.png`,
    fullPage: true,
  });
}

// ─── ACT 1: THE PASTOR'S WORLD ────────────────────────────────

test.describe("🎬 Showcase Video", () => {
  test.describe.configure({ mode: "serial" });

  test("Scene 01 — Opening: Pastor Portal Grand Reveal", async ({ page }) => {
    // Start with a dramatic entrance
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 2000);

    // Let the hero breathe — the headline, the dashboard preview
    await screenshot(page, "01-hero");
    await pause(page, 2000);

    // Slow scroll to reveal the dashboard mockup on the right
    await smoothScroll(page, 200, 1500);
    await pause(page, 1500);
    await screenshot(page, "01-dashboard-preview");
  });

  test("Scene 02 — Features That Matter", async ({ page }) => {
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 800);

    // Scroll to Features section
    await scrollToElement(page, "#features");
    await pause(page, 1500);
    await screenshot(page, "02-features-grid");

    // Hover over each feature card — let them shine
    const cards = page.locator("#features .grid > div");
    const count = await cards.count();
    for (let i = 0; i < Math.min(count, 6); i++) {
      await cards.nth(i).hover();
      await pause(page, 600);
    }
    await screenshot(page, "02-features-hover");
  });

  test("Scene 03 — Pricing That's Fair", async ({ page }) => {
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    await scrollToElement(page, "#pricing");
    await pause(page, 1500);
    await screenshot(page, "03-pricing-cards");

    // Hover on the highlighted Minister plan
    const ministerCard = page.locator("#pricing .scale-105").first();
    await ministerCard.hover();
    await pause(page, 1500);
    await screenshot(page, "03-pricing-highlighted");
  });

  test("Scene 04 — Trusted by Pastors", async ({ page }) => {
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    await scrollToElement(page, "#testimonials");
    await pause(page, 1500);
    await screenshot(page, "04-testimonials");

    // Continue to CTA
    await smoothScroll(
      page,
      await page.evaluate(() => document.body.scrollHeight - window.innerHeight),
      1500
    );
    await pause(page, 1500);
    await screenshot(page, "04-cta-footer");
  });

  test("Scene 05 — Full Pastor Portal Sweep", async ({ page }) => {
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 1000);

    // Grand sweep from top to bottom
    await scrollToBottom(page, 2000);
    await pause(page, 1000);
    await screenshotFull(page, "05-pastor-full-sweep");
  });

  // ─── ACT 2: THE FOLLOWER'S JOURNEY ────────────────────────────

  test("Scene 06 — Follower Portal: A New Beginning", async ({ page }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 2000);

    // Hero with the big headline
    await screenshot(page, "06-follower-hero");
    await pause(page, 1500);

    // Scroll to How It Works
    await smoothScroll(page, 700, 1500);
    await pause(page, 1500);
    await screenshot(page, "06-how-it-works");
  });

  test("Scene 07 — Discover Your Pastor", async ({ page }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    // Scroll to Featured Pastors
    await scrollToElement(page, "#pastors");
    await pause(page, 1500);
    await screenshot(page, "07-featured-pastors");

    // Hover over each pastor card
    const pastorCards = page.locator("#pastors .grid > div");
    const count = await pastorCards.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await pastorCards.nth(i).hover();
      await pause(page, 800);
    }
    await screenshot(page, "07-pastors-hover");
  });

  test("Scene 08 — The Prayer Wall", async ({ page }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    // Scroll to Prayer preview
    await scrollToElement(page, "#prayer");
    await pause(page, 1500);
    await screenshot(page, "08-prayer-wall");

    // Let the prayer cards and checklist breathe
    await smoothScroll(
      page,
      (await page.evaluate(() => {
        const el = document.querySelector("#prayer");
        return el ? el.getBoundingClientRect().top + window.scrollY + 200 : 0;
      })),
      1200
    );
    await pause(page, 1500);
    await screenshot(page, "08-prayer-detail");
  });

  test("Scene 09 — Generous Giving", async ({ page }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    // Scroll to giving section
    await scrollToElement(page, "#give");
    await pause(page, 1500);
    await screenshot(page, "09-giving-section");

    // Hover over giving tiers
    const tiers = page.locator("#give button");
    const count = await tiers.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await tiers.nth(i).hover();
      await pause(page, 700);
    }
    await screenshot(page, "09-giving-hover");
  });

  test("Scene 10 — Full Follower Portal Sweep", async ({ page }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 1000);

    // Full cinematic scroll
    await scrollToBottom(page, 2000);
    await pause(page, 1000);
    await screenshotFull(page, "10-follower-full-sweep");
  });

  // ─── ACT 3: THE LIVE PLATFORM ──────────────────────────────────

  test("Scene 11 — Browse Real Pastors (API-Powered)", async ({
    page,
    request,
  }) => {
    // First verify we have real data
    const apiRes = await request.get(`${API}/pastors`);
    expect(apiRes.ok()).toBeTruthy();

    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    // Navigate to pastor browsing (simulate clicking — go directly since behind auth)
    // Show the API data is real
    const pastorsData = await apiRes.json();
    const pastorsList = pastorsData.pastors || pastorsData;
    expect(pastorsList.length).toBeGreaterThanOrEqual(3);

    // Take a screenshot that shows the featured pastors section
    await scrollToElement(page, "#pastors");
    await pause(page, 1000);
    await screenshot(page, "11-real-pastors");
  });

  test("Scene 12 — Live Prayer Requests", async ({ page, request }) => {
    // Show real prayer data from API
    const prayersRes = await request.get(`${API}/prayers`);
    expect(prayersRes.ok()).toBeTruthy();
    const prayers = await prayersRes.json();
    expect(prayers.length).toBeGreaterThanOrEqual(5);

    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    await scrollToElement(page, "#prayer");
    await pause(page, 1500);
    await screenshot(page, "12-live-prayers");
  });

  test("Scene 13 — Waitlist Signup Moment", async ({ page }) => {
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 1000);

    // Type an email into the waitlist form — the dramatic finale
    const emailInput = page.locator('input[type="email"]').first();
    await typeSlowly(page, 'input[type="email"]', "yourname@church.org");
    await pause(page, 1000);
    await screenshot(page, "13-waitlist-typing");

    // Click Join Waitlist
    await page.locator('button:has-text("Join Waitlist")').first().click();
    await pause(page, 2000);
    await screenshot(page, "13-waitlist-success");
  });

  test("Scene 14 — Admin Dashboard Power", async ({ page }) => {
    await page.goto(`${PASTOR_PORTAL}/admin/waitlist`);
    await page.waitForLoadState("networkidle");
    await pause(page, 1000);

    // Login
    await page.fill('input[placeholder="Username"]', "admin");
    await pause(page, 500);
    await page.fill('input[placeholder="Password"]', "change-me-in-production");
    await pause(page, 500);
    await screenshot(page, "14-admin-login");

    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(2000);
    await screenshot(page, "14-admin-dashboard");

    // Let the dashboard stats breathe
    await pause(page, 2000);
    await screenshot(page, "14-admin-stats");
  });

  // ─── FINALE ────────────────────────────────────────────────────

  test("Scene 15 — Grand Finale: Side by Side", async ({ page, context }) => {
    // Open both portals — show the ecosystem
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 1500);
    await screenshot(page, "15-finale-pastor");

    // Switch to follower portal
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 1500);
    await screenshot(page, "15-finale-follower");

    // Back to pastor portal for the closing shot — the waitlist CTA
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 1000);

    // Scroll to the very bottom for the closing CTA
    await smoothScroll(
      page,
      await page.evaluate(
        () => document.body.scrollHeight - window.innerHeight
      ),
      2000
    );
    await pause(page, 2500);
    await screenshot(page, "15-finale-cta");
  });
});
