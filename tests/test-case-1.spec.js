// tests/test-case-1.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Test Case 1: Register User', () => {
  test('should register a new user successfully', async ({ page }) => {
    // 1. Launch browser and navigate to url 'http://automationexercise.com'
    await page.goto('/'); // baseURL playwright.config.js'den geliyor

        // --- ÇEREZ ONAYI POP-UP'INI KAPATMA (DOĞRU YER) ---
    try {
      // Seçici: "<p class="fc-button-label">Consent</p>" içeren tıklanabilir element
      // Örnek 1: Eğer p bir button içindeyse
      const consentButtonLocator = page.locator('button:has(p.fc-button-label:has-text("Consent"))');
      
      // Örnek 2: Eğer p belirli bir class'a sahip bir div içindeyse
      // const consentButtonLocator = page.locator('div.fc-button:has(p.fc-button-label:has-text("Consent"))');

      // Örnek 3: XPath ile (daha esnek olabilir)
      // const consentButtonLocator = page.locator('//p[@class="fc-button-label" and normalize-space(text())="Consent"]/ancestor::button[1]');
      // Veya üstteki div için:
      // const consentButtonLocator = page.locator('//p[@class="fc-button-label" and normalize-space(text())="Consent"]/ancestor::div[contains(@class, "fc-button")][1]');


      // Butonun görünür olmasını bekle (timeout'u ihtiyaca göre ayarlayın)
      // .first() kullanmak, seçicinin birden fazla elementle eşleşme ihtimaline karşı iyi bir pratiktir.
      const consentElement = consentButtonLocator.first(); 

      await consentElement.waitFor({ state: 'visible', timeout: 15000 }); // Timeout'u biraz artırdım

      if (await consentElement.isVisible()) {
        await consentElement.click();
        console.log('Consent pop-up başarıyla tıklandı.');
      } else {
        // Bu log nadiren görülmeli eğer waitFor başarılıysa, ama bir güvenlik önlemi.
        console.log('Consent butonu waitFor sonrası görünür değil veya bulunamadı.');
      }
    } catch (error) {
      console.warn('Consent pop-up handle edilirken bir hata oluştu veya bulunamadı. Teste devam ediliyor...', error.message);
      // Hata olsa bile teste devam etmesini isteyebiliriz, çünkü pop-up her zaman çıkmayabilir.
      // Ya da burada testi fail ettirebilirsiniz: throw new Error('Consent pop-up handle edilemedi!');
    }
    // --- ÇEREZ ONAYI POP-UP'I SONU ---

    // 2. Verify that home page is visible successfully
    await expect(page).toHaveTitle(/Automation Exercise/);
    await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();


    // 3. Click on 'Signup / Login' button
    await page.locator('a[href="/login"]').click();

    // 4. Verify 'New User Signup!' is visible
    await expect(page.locator('div.signup-form h2')).toHaveText('New User Signup!');

    // 5. Enter name and email address
    const uniqueName = `TestUser${Date.now()}`;
    const uniqueEmail = `testuser${Date.now()}@example.com`;
    await page.locator('input[data-qa="signup-name"]').fill(uniqueName);
    await page.locator('input[data-qa="signup-email"]').fill(uniqueEmail);

    // 6. Click 'Signup' button
    await page.locator('button[data-qa="signup-button"]').click();

    // 7. Verify that 'ENTER ACCOUNT INFORMATION' is visible
    await expect(page.locator('div.login-form h2.title > b')).toHaveText('Enter Account Information');

    // 8. Fill details: Title, Name, Email, Password, Date of birth
    await page.locator('#id_gender1').check(); // Mr.
    // Name zaten girilmiş olacak, ama yine de kontrol edebilir veya değiştirebiliriz.
    // Email zaten girilmiş olacak.
    await page.locator('#password').fill('P@sswOrd123');
    await page.locator('#days').selectOption('10');
    await page.locator('#months').selectOption('5'); // May (dikkat: value'lar string olabilir)
    await page.locator('#years').selectOption('1990');

    // 9. Select checkbox 'Sign up for our newsletter!'
    await page.locator('#newsletter').check();

    // 10. Select checkbox 'Receive special offers from our partners!'
    await page.locator('#optin').check();

    // 11. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
    await page.locator('#first_name').fill('Test');
    await page.locator('#last_name').fill('User');
    await page.locator('#company').fill('Test Corp');
    await page.locator('#address1').fill('123 Test Street');
    await page.locator('#address2').fill('Apt 4B');
    await page.locator('#country').selectOption('Canada');
    await page.locator('#state').fill('Ontario');
    await page.locator('#city').fill('Toronto');
    await page.locator('#zipcode').fill('M5H 2N2');
    await page.locator('#mobile_number').fill('5551234567');

    // 12. Click 'Create Account' button
    await page.locator('button[data-qa="create-account"]').click();

    // 13. Verify that 'ACCOUNT CREATED!' is visible
    // Bazen sayfa yüklenmesi zaman alabilir, bu yüzden beklemeyi artırabiliriz veya belirli bir elementin görünür olmasını bekleyebiliriz.
    // await page.waitForSelector('h2[data-qa="account-created"] b', { timeout: 10000 }); // Gerekirse
    await expect(page.locator('h2[data-qa="account-created"] b')).toHaveText('Account Created!');

    // 14. Click 'Continue' button
    await page.locator('a[data-qa="continue-button"]').click();

    // Reklam çıkabilir, kapatmamız gerekebilir (opsiyonel, duruma göre)
    // Eğer bir iframe içinde reklam varsa:
    // const frameAd = page.frameLocator('iframe[id^="ad_iframe"]'); // id değişebilir, dikkatli seçin
    // if (await frameAd.locator('#dismiss-button').isVisible({timeout: 2000}).catch(() => false)) {
    //     await frameAd.locator('#dismiss-button').click();
    // }
    // Veya basitçe sayfada bir yere tıklayarak kapatmaya çalışabiliriz (riskli)
    // try {
    //     await page.locator('body').click({timeout: 1000, position: {x:0, y:0}}); // Reklamı kapatmak için
    // } catch (e) { /* ignore */ }


    // 15. Verify that 'Logged in as username' is visible
    // Kullanıcı adı yeni oluşturulduğu için `uniqueName` ile eşleşmeli
    await expect(page.locator('li a i.fa-user + b')).toHaveText(uniqueName);

    // 16. Click 'Delete Account' button
    await page.locator('a[href="/delete_account"]').click();

    // 17. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
    await expect(page.locator('h2[data-qa="account-deleted"] b')).toHaveText('Account Deleted!');
    await page.locator('a[data-qa="continue-button"]').click();

    // 18. (Ekstra) Ana sayfaya döndüğünü ve login/signup butonunun tekrar göründüğünü doğrulayalım
    await expect(page.locator('a[href="/login"]')).toBeVisible();
  });
});