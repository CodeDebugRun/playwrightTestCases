// tests/test-case-7.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Test Case 7: Verify Test Cases Page', () => {
  test('should navigate to the test cases page successfully', async ({ page }) => {
    // 1. Launch browser and
    // 2. Navigate to url 'http://automationexercise.com'
    await page.goto('/');

    // --- ÇEREZ ONAYI POP-UP'INI KAPATMA (GEREKİRSE) ---
    // Diğer test caselerinde kullandığınız ve çalışan pop-up kapatma kodunu buraya ekleyin.
    try {
      const consentButtonLocator = page.locator('button:has(p.fc-button-label:has-text("Consent"))');
      // VEYA sitenizdeki pop-up'a uygun diğer doğru seçici
      
      const consentElement = consentButtonLocator.first();
      if (await consentElement.isVisible({ timeout: 5000 })) {
        await consentElement.click();
        console.log('Consent pop-up (TC7) başarıyla tıklandı.');
      } else {
        console.log('Consent butonu (TC7) bulunamadı veya görünür değil (kısa bekleme sonrası).');
      }
    } catch (error) {
      console.warn('Consent pop-up (TC7) handle edilirken bir hata oluştu veya bulunamadı. Teste devam ediliyor...', error.message);
    }
    // --- ÇEREZ ONAYI POP-UP'I SONU ---

    // Reklamlar için ek kontrol (ana sayfada çıkabilir)
    try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]'); // iframe için genel seçiciler
        if (frameAd) {
            const dismissButton = frameAd.locator('#dismiss-button, div[id="dismiss-button"], div[aria-label="Close ad"]'); // iframe içindeki olası kapatma butonları
             if (await dismissButton.count() > 0 && await dismissButton.first().isVisible({timeout: 3000})) {
                await dismissButton.first().click({timeout: 3000});
                console.log('Reklam (TC7 ana sayfa) kapatıldı.');
            }
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }


    // 3. Verify that home page is visible successfully
    await expect(page).toHaveTitle(/Automation Exercise/);
    await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();

    // 4. Click on 'Test Cases' button
    // 'Test Cases' butonu header'da veya sol menüde olabilir.
    // Header'daki link: <a href="/test_cases"><i class="fa fa-list"></i> Test Cases</a>
    // data-qa attribute'u varsa o daha iyi olurdu, ama şimdilik text ile veya href ile bulalım.
    await page.locator('a[href="/test_cases"]:has-text("Test Cases")').click();
    // Veya sadece metinle:
    // await page.getByRole('link', { name: /Test Cases/i }).first().click();

    // 'Test Cases' sayfasına geçişte de reklam çıkabilir.
    try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]');
        if (frameAd) {
            const dismissButton = frameAd.locator('#dismiss-button, div[id="dismiss-button"], div[aria-label="Close ad"]');
             if (await dismissButton.count() > 0 && await dismissButton.first().isVisible({timeout: 3000})) {
                await dismissButton.first().click({timeout: 3000});
                console.log('Reklam (TC7 test cases sayfası) kapatıldı.');
            }
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }


    // 5. Verify user is navigated to test cases page successfully
    // URL'nin '/test_cases' içerdiğini kontrol edelim.
    await expect(page).toHaveURL(/.*\/test_cases/);

    // Sayfada belirgin bir başlık veya element var mı kontrol edelim.
    // Örneğin, "Test Cases" başlığı (genellikle bir h2 içinde)
    // <h2 class="title text-center"><b>Test Cases</b></h2>
    const testCasesPageTitle = page.locator('h2.title.text-center > b:has-text("Test Cases")');
    await expect(testCasesPageTitle).toBeVisible();
    await expect(testCasesPageTitle).toHaveText('Test Cases');

    // Alternatif olarak, sayfadaki test case listesinin bir kısmının varlığını da kontrol edebilirsiniz.
    // Örneğin, ilk test case'in başlığı:
    // await expect(page.getByText('Test Case 1: Register User')).toBeVisible();
  });
});