// tests/test-case-6.spec.js
const { test, expect } = require('@playwright/test');
const path = require('path'); // Dosya yolu oluşturmak için

test.describe('Test Case 6: Contact Us Form', () => {
  test('should submit the contact us form successfully', async ({ page }) => {
    // 1. Launch browser and
    // 2. Navigate to url 'http://automationexercise.com'
    await page.goto('/');

    // --- ÇEREZ ONAYI POP-UP'INI KAPATMA (GEREKİRSE) ---
    try {
      const consentButtonLocator = page.locator('button:has(p.fc-button-label:has-text("Consent"))');
      const consentElement = consentButtonLocator.first();
      if (await consentElement.isVisible({ timeout: 5000 })) {
        await consentElement.click();
        console.log('Consent pop-up (TC6) başarıyla tıklandı.');
      }
    } catch (error) {
      console.warn('Consent pop-up (TC6) handle edilirken bir hata oluştu veya bulunamadı...', error.message);
    }
    // --- ÇEREZ ONAYI POP-UP'I SONU ---

    // Reklamlar için ek kontrol
    try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]');
        if (await frameAd.locator('#dismiss-button').isVisible({timeout: 3000}).catch(() => false)) {
            await frameAd.locator('#dismiss-button').click();
            console.log('Reklam (TC6 ana sayfa) kapatıldı.');
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }

    // 3. Verify that home page is visible successfully
    await expect(page).toHaveTitle(/Automation Exercise/);
    await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();

    // 4. Click on 'Contact Us' button
    await page.locator('a[href="/contact_us"]').click();
    
    // Reklam çıkabilir (Contact Us sayfasına geçişte)
    try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]');
        if (await frameAd.locator('#dismiss-button').isVisible({timeout: 3000}).catch(() => false)) {
            await frameAd.locator('#dismiss-button').click();
            console.log('Reklam (TC6 contact us sonrası) kapatıldı.');
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }


    // 5. Verify 'GET IN TOUCH' is visible
    await expect(page.locator('div.contact-form h2.title')).toHaveText('Get In Touch');

    // 6. Enter name, email, subject and message
    const name = `Test Contact ${Date.now()}`;
    const email = `contact${Date.now()}@example.com`;
    const subject = 'Test Inquiry';
    const message = 'This is a test message for the contact us form automation.';

    await page.locator('input[data-qa="name"]').fill(name);
    await page.locator('input[data-qa="email"]').fill(email);
    await page.locator('input[data-qa="subject"]').fill(subject);
    await page.locator('textarea[data-qa="message"]').fill(message);

    // 7. Upload file
    // Proje kök dizininde 'test-files' adında bir klasör oluşturup içine 'sample.txt' gibi bir dosya koyun.
    // Ya da var olan bir dosyanın yolunu kullanın.
    // Eğer dosya proje içinde değilse tam yolunu vermeniz gerekir.
    const filePath = path.join(__dirname, '..', 'test-files', 'sample.txt'); // Proje kökünde test-files/sample.txt
    // Önce 'test-files' klasörünü ve içine 'sample.txt' (boş bir metin dosyası olabilir) oluşturun.
    // Örnek: playwright-automation-exercise/test-files/sample.txt

    // Dosya yükleme input'u genellikle görünmezdir, ama Playwright handle edebilir.
    // Eğer input'un bir `name` attribute'u varsa onu kullanmak daha iyi olabilir.
    // Örneğin: `input[name="upload_file"]`
    await page.locator('input[type="file"]').setInputFiles(filePath);
    console.log(`Dosya yüklendi: ${filePath}`);


    // 8. Click 'Submit' button
    // JavaScript alert'ini handle etmek için bir olay dinleyicisi ekliyoruz.
    page.on('dialog', async dialog => {
      console.log(`Dialog mesajı: ${dialog.message()}`);
      expect(dialog.type()).toContain('confirm'); // Veya 'alert' olabilir, kontrol edin. Sitede 'confirm' gibi davranıyor.
      // Test case 'OK' diyor, bu yüzden kabul ediyoruz.
      await dialog.accept();
      console.log('Dialog kabul edildi.');
    });

    await page.locator('input[data-qa="submit-button"]').click();

    // 9. Click OK button (Yukarıdaki dialog handler bunu otomatik yapacak)
    // Bu adım için ek bir kod gerekmiyor, `page.on('dialog', ...)` hallediyor.

    // 10. Verify success message 'Success! Your details have been submitted successfully.' is visible
    // Başarı mesajının seçicisi önemli. Genellikle formun hemen üstünde veya içinde olur.
    // div.status.alert.alert-success şeklinde bir class'ı var.
    const successMessageLocator = page.locator('div.contact-form div.status.alert.alert-success');
    await expect(successMessageLocator).toBeVisible({ timeout: 10000 }); // Mesajın yüklenmesi için biraz bekle
    await expect(successMessageLocator).toHaveText('Success! Your details have been submitted successfully.');

    // 11. Click 'Home' button and verify that landed to home page successfully
    // Başarı mesajı içindeki "Home" butonu bir link.
    // Eğer genel bir "Home" butonu varsa onu da kullanabilirsiniz: page.locator('a:has-text("Home")').first().click();
    // veya header'daki: page.locator('.shop-menu a[href="/"]').click();
    await successMessageLocator.locator('a[href="/"]').click(); // Başarı mesajı içindeki Home linki
    
    // Reklam çıkabilir (Home sayfasına geçişte)
    try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]');
        if (await frameAd.locator('#dismiss-button').isVisible({timeout: 3000}).catch(() => false)) {
            await frameAd.locator('#dismiss-button').click();
            console.log('Reklam (TC6 home dönüşü) kapatıldı.');
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }


    // Ana sayfaya dönüldüğünü doğrula
    await expect(page).toHaveURL('https://automationexercise.com/'); // Tam URL veya baseURL ile
    await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible(); // Ana sayfa imajı
  });
});