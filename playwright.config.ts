import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/results",
  timeout: 60000,
  use: {
    headless: false,
    viewport: { width: 1440, height: 900 },
    screenshot: "on",
    video: "on",
    trace: "on",
  },
  projects: [
    {
      name: "walkthrough",
      use: {
        browserName: "chromium",
        launchOptions: { slowMo: 300 },
      },
    },
    {
      name: "showcase",
      testMatch: "showcase.spec.ts",
      use: {
        browserName: "chromium",
        viewport: { width: 1440, height: 900 },
        video: {
          mode: "on",
          size: { width: 1440, height: 900 },
        },
        launchOptions: { slowMo: 150 },
      },
    },
  ],
});
