/**
 * 🎬 FOLLOWER SHOWCASE — "Connect with Your Pastor, Grow in Faith"
 *
 * Targeted video for followers/congregation showing THEIR journey:
 * finding pastors, browsing services, prayer wall, community, giving.
 *
 * Run: npx playwright test e2e/showcase-follower.spec.ts --project=showcase
 */
import { test, type Page } from "@playwright/test";

const FOLLOWER_PORTAL = "http://localhost:15781";

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

async function scrollToElement(page: Page, selector: string) {
  const el = page.locator(selector).first();
  const box = await el.boundingBox();
  if (box) {
    const scrollY = await page.evaluate(() => window.scrollY);
    const target = scrollY + box.y - 80;
    await smoothScroll(page, target, 1000);
    await page.waitForTimeout(500);
  }
}

async function pause(page: Page, ms = 1500) {
  await page.waitForTimeout(ms);
}

// ─── FOLLOWER SHOWCASE ────────────────────────────────────────

test.describe("🎬 Follower Showcase", () => {
  test.describe.configure({ mode: "serial" });

  test("Scene 01 — Hero: Your Spiritual Journey Begins", async ({ page }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 2500);

    // Let the big headline breathe — "Connect with Your Pastor, Grow in Faith"
    await pause(page, 2000);
  });

  test("Scene 02 — How It Works: Three Simple Steps", async ({ page }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    // Scroll to How It Works — Find, Book, Grow
    await scrollToElement(page, 'text=How It Works');
    await pause(page, 2000);

    // Hover over each step
    const steps = page.locator('text=How It Works').locator('..').locator('..').locator('.grid > div');
    const count = await steps.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await steps.nth(i).hover();
      await pause(page, 1000);
    }
    await pause(page, 500);
  });

  test("Scene 03 — Featured Pastors: Find Your Guide", async ({ page }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    // Scroll to Featured Pastors
    await scrollToElement(page, "#pastors");
    await pause(page, 1500);

    // Hover over each pastor card — show the detail
    const pastorCards = page.locator("#pastors .grid > div");
    const count = await pastorCards.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await pastorCards.nth(i).hover();
      await pause(page, 1000);
    }
    await pause(page, 800);
  });

  test("Scene 04 — Services: What's Available", async ({ page }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    // Scroll to Services Preview
    await scrollToElement(page, 'text=Services We Offer');
    await pause(page, 1500);

    // Hover over service cards
    const serviceCards = page.locator('text=Services We Offer').locator('..').locator('..').locator('.grid > div');
    const count = await serviceCards.count();
    for (let i = 0; i < Math.min(count, 4); i++) {
      await serviceCards.nth(i).hover();
      await pause(page, 700);
    }
    await pause(page, 800);
  });

  test("Scene 05 — Prayer Wall: You Are Not Alone", async ({ page }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    // Scroll to Prayer Wall preview
    await scrollToElement(page, "#prayer");
    await pause(page, 2000);

    // Slow scroll through the prayer section to show both sides
    const prayerBox = await page.locator("#prayer").boundingBox();
    if (prayerBox) {
      const scrollY = await page.evaluate(() => window.scrollY);
      await smoothScroll(page, scrollY + 200, 1500);
      await pause(page, 1500);
    }
  });

  test("Scene 06 — Giving: Support Your Ministry", async ({ page }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    // Scroll to Giving section (dark section)
    await scrollToElement(page, "#give");
    await pause(page, 1500);

    // Hover over giving tier buttons
    const tiers = page.locator("#give button");
    const count = await tiers.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await tiers.nth(i).hover();
      await pause(page, 800);
    }
    await pause(page, 800);
  });

  test("Scene 07 — Grand Sweep: The Full Journey", async ({ page }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 1500);

    // Cinematic full scroll — top to bottom
    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const steps = Math.ceil(totalHeight / (viewportHeight * 0.6));
    for (let i = 1; i <= steps; i++) {
      const target = Math.min(
        i * viewportHeight * 0.6,
        totalHeight - viewportHeight
      );
      await smoothScroll(page, target, 2000);
      await pause(page, 800);
    }

    // Hold on final CTA
    await pause(page, 2500);
  });
});
