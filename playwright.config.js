// playwright.config.js
// @ts-check
const { devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  testDir: './tests', // Test dosyalarınızın bulunduğu klasör
  /* Testler için maksimum toplam süre (milisaniye) */
  timeout: 30 * 1000, // 30 saniye
  expect: {
    /**
     * expect() içindeki assertion'lar için maksimum süre.
     */
    timeout: 5000 // 5 saniye
  },
  /* Başarısız testleri CI üzerinde tekrar çalıştırma */
  retries: process.env.CI ? 2 : 0,
  /* Paralel çalışacak test sayısı. CI'da farklı, lokalde farklı olabilir. */
  workers: process.env.CI ? 1 : undefined, // Lokal için 'undefined' genellikle CPU sayısına göre ayarlar
  /* Raporlama formatı */
  reporter: 'html', // HTML raporu oluşturur (playwright-report klasöründe)

  /* Tüm projeler için paylaşılan ayarlar */
  use: {
    /* Temel URL, testlerde page.goto('/') gibi kullanılabilir */
    baseURL: 'https://automationexercise.com', // <<< BU ÇOK ÖNEMLİ!

    /* Her test için ekran görüntüsü ve video kaydı ayarları */
    trace: 'on-first-retry', // İlk yeniden denemede trace kaydı al
    screenshot: 'only-on-failure', // Sadece başarısız testlerde ekran görüntüsü al
    video: 'retain-on-failure', // Sadece başarısız testlerde videoyu sakla

    headless: false, // Tarayıcıyı görünür modda çalıştırır (geliştirme için true yapabilirsiniz)
    actionTimeout: 0, // Action'lar için varsayılan timeout (0 = sınırsız)
    navigationTimeout: 30000, // Sayfa navigasyonları için timeout (milisaniye)
  },

  /* Farklı tarayıcılar ve cihazlar için projeler */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { channel: 'chrome' },
    // },
  ],

  /* Test sunucusunu başlatmak için (eğer varsa) */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
};

module.exports = config;