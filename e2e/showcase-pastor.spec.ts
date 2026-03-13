/**
 * 🎬 PASTOR SHOWCASE — "Manage Your Ministry, Serve Your People"
 *
 * Targeted video for pastors/ministry leaders showing THEIR experience:
 * dashboard management, booking control, prayer responses, giving reports.
 *
 * Run: npx playwright test e2e/showcase-pastor.spec.ts --project=showcase
 */
import { test, type Page } from "@playwright/test";

const PASTOR_PORTAL = "http://localhost:15780";

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

// ─── PASTOR SHOWCASE ──────────────────────────────────────────

test.describe("🎬 Pastor Showcase", () => {
  test.describe.configure({ mode: "serial" });

  test("Scene 01 — Hero: Your Ministry Command Center", async ({ page }) => {
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 2500);

    // Let the hero breathe — headline + dashboard preview on right
    await pause(page, 2000);

    // Slow scroll to reveal the dashboard mockup stats
    await smoothScroll(page, 150, 1500);
    await pause(page, 2000);
  });

  test("Scene 02 — Features: Everything You Need", async ({ page }) => {
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    // Scroll to Features
    await scrollToElement(page, "#features");
    await pause(page, 1500);

    // Hover over each feature card — booking, prayer, giving, catalog, profile, community
    const cards = page.locator("#features .grid > div");
    const count = await cards.count();
    for (let i = 0; i < Math.min(count, 6); i++) {
      await cards.nth(i).hover();
      await pause(page, 700);
    }
    await pause(page, 800);
  });

  test("Scene 03 — Pricing: Simple & Transparent", async ({ page }) => {
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    await scrollToElement(page, "#pricing");
    await pause(page, 1500);

    // Hover on each pricing tier — Shepherd, Minister (highlighted), Ministry
    const tiers = page.locator("#pricing .grid > div");
    const count = await tiers.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await tiers.nth(i).hover();
      await pause(page, 1000);
    }
    await pause(page, 800);
  });

  test("Scene 04 — Testimonials: Trusted by Pastors", async ({ page }) => {
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await pause(page, 500);

    await scrollToElement(page, "#testimonials");
    await pause(page, 2000);

    // Hover over each testimonial
    const quotes = page.locator("#testimonials .grid > div");
    const count = await quotes.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await quotes.nth(i).hover();
      await pause(page, 1000);
    }
    await pause(page, 500);
  });

  test("Scene 05 — Grand Sweep: Full Pastor Experience", async ({ page }) => {
    await page.goto(PASTOR_PORTAL);
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
