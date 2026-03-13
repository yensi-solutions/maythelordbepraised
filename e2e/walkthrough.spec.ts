import { test, expect } from "@playwright/test";

const PASTOR_PORTAL = "http://localhost:15780";
const FOLLOWER_PORTAL = "http://localhost:15781";
const API = "http://localhost:15782/api/v1";

test.describe("MayTheLordBePraised — Full System Walkthrough", () => {
  // ──────────────────────────────────────────────
  // PART 1: API Health
  // ──────────────────────────────────────────────

  test("01 — API is healthy and database is connected", async ({ request }) => {
    const health = await request.get(`${API}/health`);
    expect(health.ok()).toBeTruthy();
    const healthBody = await health.json();
    expect(healthBody.status).toBe("healthy");

    const ready = await request.get(`${API}/ready`);
    expect(ready.ok()).toBeTruthy();
    const readyBody = await ready.json();
    expect(readyBody.status).toBe("ready");
    expect(readyBody.database).toBe("connected");
  });

  // ──────────────────────────────────────────────
  // PART 2: Pastor Portal Landing Page
  // ──────────────────────────────────────────────

  test("02 — Pastor Portal landing page loads with all sections", async ({
    page,
  }) => {
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Full page screenshot
    await page.screenshot({
      path: "e2e/results/02-pastor-fullpage.png",
      fullPage: true,
    });

    // Hero section
    await page.screenshot({ path: "e2e/results/02-pastor-hero.png" });

    // Scroll through sections
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight / 4, behavior: "smooth" })
    );
    await page.waitForTimeout(600);
    await page.screenshot({ path: "e2e/results/02-pastor-features.png" });

    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight / 2, behavior: "smooth" })
    );
    await page.waitForTimeout(600);
    await page.screenshot({ path: "e2e/results/02-pastor-pricing.png" });

    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
    );
    await page.waitForTimeout(600);
    await page.screenshot({ path: "e2e/results/02-pastor-footer.png" });
  });

  // ──────────────────────────────────────────────
  // PART 3: Follower Portal Landing Page
  // ──────────────────────────────────────────────

  test("03 — Follower Portal landing page loads with all sections", async ({
    page,
  }) => {
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Full page screenshot
    await page.screenshot({
      path: "e2e/results/03-follower-fullpage.png",
      fullPage: true,
    });

    // Hero
    await page.screenshot({ path: "e2e/results/03-follower-hero.png" });

    // Scroll through
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight * 0.25, behavior: "smooth" })
    );
    await page.waitForTimeout(600);
    await page.screenshot({ path: "e2e/results/03-follower-how-it-works.png" });

    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight * 0.5, behavior: "smooth" })
    );
    await page.waitForTimeout(600);
    await page.screenshot({ path: "e2e/results/03-follower-services.png" });

    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight * 0.75, behavior: "smooth" })
    );
    await page.waitForTimeout(600);
    await page.screenshot({ path: "e2e/results/03-follower-prayer.png" });

    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
    );
    await page.waitForTimeout(600);
    await page.screenshot({ path: "e2e/results/03-follower-footer.png" });
  });

  // ──────────────────────────────────────────────
  // PART 4: API — List Pastors
  // ──────────────────────────────────────────────

  test("04 — API returns seeded pastors", async ({ request }) => {
    const response = await request.get(`${API}/pastors`);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.pastors.length).toBe(3);
    expect(data.pastors[0]).toHaveProperty("first_name");
    expect(data.pastors[0]).toHaveProperty("church_name");
    expect(data.pastors[0]).toHaveProperty("specialties");
  });

  // ──────────────────────────────────────────────
  // PART 5: API — List Services for a Pastor
  // ──────────────────────────────────────────────

  test("05 — API returns services for a pastor", async ({ request }) => {
    const pastorsRes = await request.get(`${API}/pastors`);
    const pastorsData = await pastorsRes.json();
    const pastorId = pastorsData.pastors[0].id;

    const servicesRes = await request.get(
      `${API}/booking/pastors/${pastorId}/services`
    );
    expect(servicesRes.ok()).toBeTruthy();
    const services = await servicesRes.json();
    expect(services.length).toBeGreaterThan(0);
    expect(services[0]).toHaveProperty("name");
    expect(services[0]).toHaveProperty("duration_minutes");
    expect(services[0]).toHaveProperty("price_cents");
  });

  // ──────────────────────────────────────────────
  // PART 6: API — List Availability for a Pastor
  // ──────────────────────────────────────────────

  test("06 — API returns availability for a pastor", async ({ request }) => {
    const pastorsRes = await request.get(`${API}/pastors`);
    const pastorsData = await pastorsRes.json();
    const pastorId = pastorsData.pastors[0].id;

    const availRes = await request.get(
      `${API}/booking/pastors/${pastorId}/availability`
    );
    expect(availRes.ok()).toBeTruthy();
    const slots = await availRes.json();
    expect(slots.length).toBe(5); // Mon-Fri
    expect(slots[0]).toHaveProperty("day_of_week");
    expect(slots[0]).toHaveProperty("start_time");
    expect(slots[0]).toHaveProperty("end_time");
  });

  // ──────────────────────────────────────────────
  // PART 7: API — List Prayers
  // ──────────────────────────────────────────────

  test("07 — API returns seeded prayers", async ({ request }) => {
    const response = await request.get(`${API}/prayers`);
    expect(response.ok()).toBeTruthy();
    const prayers = await response.json();
    expect(prayers.length).toBe(5);

    const activePrayer = prayers.find(
      (p: { status: string }) => p.status === "active"
    );
    expect(activePrayer).toBeDefined();
    expect(activePrayer).toHaveProperty("text");
    expect(activePrayer).toHaveProperty("pray_count");

    const answered = prayers.find(
      (p: { status: string }) => p.status === "answered"
    );
    expect(answered).toBeDefined();
    expect(answered.testimony).toBeTruthy();
  });

  // ──────────────────────────────────────────────
  // PART 8: API — Pray for a prayer request
  // ──────────────────────────────────────────────

  test("08 — API increments pray count", async ({ request }) => {
    const prayersRes = await request.get(`${API}/prayers`);
    const prayers = await prayersRes.json();
    const prayer = prayers[0];
    const originalCount = prayer.pray_count;

    const prayRes = await request.post(`${API}/prayers/${prayer.id}/pray`);
    expect(prayRes.ok()).toBeTruthy();
    const updated = await prayRes.json();
    expect(updated.pray_count).toBe(originalCount + 1);
  });

  // ──────────────────────────────────────────────
  // PART 9: MinIO Console
  // ──────────────────────────────────────────────

  test("09 — MinIO console is accessible", async ({ page }) => {
    await page.goto("http://localhost:15788");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "e2e/results/09-minio-login.png" });
  });

  // ──────────────────────────────────────────────
  // PART 10: Mobile Responsive Views
  // ──────────────────────────────────────────────

  test("10 — Mobile responsive views", async ({ page }) => {
    // Pastor portal — mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "e2e/results/10-pastor-mobile.png",
      fullPage: true,
    });

    // Follower portal — mobile
    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "e2e/results/10-follower-mobile.png",
      fullPage: true,
    });

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(PASTOR_PORTAL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "e2e/results/10-pastor-tablet.png",
      fullPage: true,
    });

    await page.goto(FOLLOWER_PORTAL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "e2e/results/10-follower-tablet.png",
      fullPage: true,
    });
  });

  // ──────────────────────────────────────────────
  // PART 11: All services responding
  // ──────────────────────────────────────────────

  test("11 — All services responding correctly", async ({ request }) => {
    const api = await request.get(`${API}/health`);
    expect(api.ok()).toBeTruthy();

    const pastors = await request.get(`${API}/pastors`);
    expect(pastors.ok()).toBeTruthy();

    const prayers = await request.get(`${API}/prayers`);
    expect(prayers.ok()).toBeTruthy();

    const pp = await request.get(PASTOR_PORTAL);
    expect(pp.status()).toBe(200);

    const fp = await request.get(FOLLOWER_PORTAL);
    expect(fp.status()).toBe(200);
  });
});
