// tests/test-case-3.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Test Case 3: Login User with incorrect email and password', () => {
  test('should display an error message for incorrect login credentials', async ({ page }) => {
    // 1. Launch browser and
    // 2. Navigate to url 'http://automationexercise.com'
    await page.goto('/');

    // --- ÇEREZ ONAYI POP-UP'INI KAPATMA (GEREKİRSE) ---
    // Diğer test caselerinde kullandığınız ve çalışan pop-up kapatma kodunu buraya ekleyin.
    // Örneğin:
    try {
      const consentButtonLocator = page.locator('button:has(p.fc-button-label:has-text("Consent"))');
      // VEYA sitenizdeki pop-up'a uygun diğer doğru seçici
      
      const consentElement = consentButtonLocator.first();
      // Pop-up'ın görünür olmasını bekleyelim, ancak çok uzun değil çünkü her zaman çıkmayabilir
      // veya testin akışını çok yavaşlatmamalı.
      if (await consentElement.isVisible({ timeout: 5000 })) { // Kısa bir timeout ile kontrol et
        await consentElement.click();
        console.log('Consent pop-up (TC3) başarıyla tıklandı.');
      } else {
        console.log('Consent butonu (TC3) bulunamadı veya görünür değil (kısa bekleme sonrası).');
      }
    } catch (error) {
      console.warn('Consent pop-up (TC3) handle edilirken bir hata oluştu veya bulunamadı. Teste devam ediliyor...', error.message);
    }
    // --- ÇEREZ ONAYI POP-UP'I SONU ---

    // 3. Verify that home page is visible successfully
    await expect(page).toHaveTitle(/Automation Exercise/);
    await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();

    // 4. Click on 'Signup / Login' button
    await page.locator('a[href="/login"]').click();

    // Login sayfasında tekrar pop-up çıkabilir, burada da bir kontrol gerekebilir.
    // Ancak genellikle aynı session içinde tekrar çıkmaz. Gerekirse buraya da pop-up kodu eklenebilir.

    // 5. Verify 'Login to your account' is visible
    await expect(page.locator('div.login-form h2')).toHaveText('Login to your account');

    // 6. Enter incorrect email address and password
    const incorrectEmail = `invalid${Date.now()}@example.com`; // Her seferinde farklı geçersiz bir e-posta
    const incorrectPassword = 'wrongpassword123';
    await page.locator('input[data-qa="login-email"]').fill(incorrectEmail);
    await page.locator('input[data-qa="login-password"]').fill(incorrectPassword);

    // 7. Click 'login' button
    await page.locator('button[data-qa="login-button"]').click();

    // 8. Verify error 'Your email or password is an incorrect!' is visible
    // Hata mesajının tam metni sitede değişebilir, o yüzden dikkatli seçin.
    // Genellikle bu tür mesajlar <p style="color: red;"> içinde olur.
    const errorMessageLocator = page.locator('form[action="/login"] p[style="color: red;"]');
    // VEYA daha spesifik bir metinle:
    // const errorMessageLocator = page.locator('p:has-text("Your email or password is an incorrect!")');

    await expect(errorMessageLocator).toBeVisible();
    // Tam metni de kontrol edebilirsiniz, ancak metin biraz bile değişirse test bozulur.
    // Bu yüzden sadece görünürlüğünü kontrol etmek veya bir kısmını kontrol etmek daha sağlam olabilir.
    await expect(errorMessageLocator).toContainText('Your email or password is incorrect'); // "an" kelimesi bazen olmayabilir veya tam metin değişebilir.
    // Veya tam eşleşme için:
    // await expect(errorMessageLocator).toHaveText('Your email or password is an incorrect!');

    // (Ekstra) Login formunun hala görünür olduğunu da doğrulayabiliriz.
    await expect(page.locator('div.login-form h2')).toHaveText('Login to your account');
  });
});