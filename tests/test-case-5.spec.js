// tests/test-case-5.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Test Case 5: Register User with existing email', () => {
  const nameForFirstRegistration = `ExistingUser${Date.now()}`;
  const existingEmail = `existing${Date.now()}@example.com`; // Bu e-postayı önce kaydedeceğiz
  const passwordForFirstRegistration = 'Pa$$wOrd123';

  // Testten önce bir kullanıcıyı bu e-posta ile kaydedelim.
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://automationexercise.com/login');

    // --- ÇEREZ ONAYI POP-UP'INI KAPATMA (beforeAll İÇİN) ---
    try {
      const consentButtonLocator = page.locator('button:has(p.fc-button-label:has-text("Consent"))');
      const consentElement = consentButtonLocator.first();
      if (await consentElement.isVisible({ timeout: 5000 })) {
        await consentElement.click();
        console.log('Consent pop-up (TC5 beforeAll) başarıyla tıklandı.');
      }
    } catch (error) {
      
      console.warn('Consent pop-up (TC5 beforeAll) handle edilirken bir hata oluştu veya bulunamadı...', error.message);
    }
    // --- ÇEREZ ONAYI POP-UP'I SONU ---

    // İlk Kullanıcı Kaydı
    await page.locator('input[data-qa="signup-name"]').fill(nameForFirstRegistration);
    await page.locator('input[data-qa="signup-email"]').fill(existingEmail);
    await page.locator('button[data-qa="signup-button"]').click();

    // Kayıt formu detayları
    await expect(page.locator('h2.title > b:has-text("Enter Account Information")')).toBeVisible();
    await page.locator('#id_gender1').check(); // Mr.
    await page.locator('#password').fill(passwordForFirstRegistration);
    await page.locator('#days').selectOption('15');
    await page.locator('#months').selectOption('8'); // August
    await page.locator('#years').selectOption('1992');
    await page.locator('#first_name').fill(nameForFirstRegistration.replace(/\d+/g, ''));
    await page.locator('#last_name').fill('TestExisting');
    await page.locator('#company').fill('Existing Corp');
    await page.locator('#address1').fill('101 Existing Road');
    await page.locator('#country').selectOption('New Zealand');
    await page.locator('#state').fill('Auckland');
    await page.locator('#city').fill('Auckland');
    await page.locator('#zipcode').fill('1010');
    await page.locator('#mobile_number').fill('5551122334');
    await page.locator('button[data-qa="create-account"]').click();

    // Kayıt sonrası
    await expect(page.locator('h2[data-qa="account-created"] b')).toHaveText('Account Created!');
    await page.locator('a[data-qa="continue-button"]').click();

    // Reklam çıkabilir, kapatmaya çalışalım
    try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]');
        if (await frameAd.locator('#dismiss-button').isVisible({timeout: 3000}).catch(() => false)) {
            await frameAd.locator('#dismiss-button').click();
            console.log('Reklam (TC5 beforeAll) kapatıldı.');
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }


    // Oluşturulan kullanıcıyla çıkış yapalım
    if (await page.locator('a[href="/logout"]').isVisible()) {
      await page.locator('a[href="/logout"]').click();
      console.log(`Kullanıcı ${existingEmail} test için oluşturuldu ve çıkış yapıldı.`);
    }

    await page.close();
    await context.close();
  }, 90000); // beforeAll timeout

  test('should display an error for already registered email', async ({ page }) => {
    // 1. Launch browser and
    // 2. Navigate to url 'http://automationexercise.com'
    await page.goto('/');

    // --- ÇEREZ ONAYI POP-UP'INI KAPATMA (ANA TEST İÇİN) ---
    try {
      const consentButtonLocator = page.locator('button:has(p.fc-button-label:has-text("Consent"))');
      const consentElement = consentButtonLocator.first();
      if (await consentElement.isVisible({ timeout: 5000 })) {
        await consentElement.click();
        console.log('Consent pop-up (TC5 ana test) başarıyla tıklandı.');
      }
    } catch (error) {
      console.warn('Consent pop-up (TC5 ana test) handle edilirken bir hata oluştu veya bulunamadı...', error.message);
    }
    // --- ÇEREZ ONAYI POP-UP'I SONU ---
    
    // Reklamlar için ek kontrol
    try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]');
        if (await frameAd.locator('#dismiss-button').isVisible({timeout: 3000}).catch(() => false)) {
            await frameAd.locator('#dismiss-button').click();
            console.log('Reklam (TC5 ana test) kapatıldı.');
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }

    // 3. Verify that home page is visible successfully
    await expect(page).toHaveTitle(/Automation Exercise/);
    await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();

    // 4. Click on 'Signup / Login' button
    await page.locator('a[href="/login"]').click();

    // 5. Verify 'New User Signup!' is visible
    await expect(page.locator('div.signup-form h2')).toHaveText('New User Signup!');

    // 6. Enter name and already registered email address
    const newNameAttempt = `AttemptUser${Date.now()}`; // Farklı bir isim, ama aynı e-posta
    await page.locator('input[data-qa="signup-name"]').fill(newNameAttempt);
    await page.locator('input[data-qa="signup-email"]').fill(existingEmail); // beforeAll'da kaydedilen e-posta

    // 7. Click 'Signup' button
    await page.locator('button[data-qa="signup-button"]').click();

    // 8. Verify error 'Email Address already exist!' is visible
    // Hata mesajının seçicisi Test Case 3'teki gibi olabilir, ancak metin farklı.
    // Bu hata mesajı, signup formu içindeki bir p elementi olarak görünüyor.
    const errorMessageLocator = page.locator('form[action="/signup"] p[style="color: red;"]');
    // VEYA daha spesifik metinle:
    // const errorMessageLocator = page.locator('p:has-text("Email Address already exist!")');

    await expect(errorMessageLocator).toBeVisible();
    // Tam metin kontrolü veya içerik kontrolü
    await expect(errorMessageLocator).toHaveText('Email Address already exist!');
    // VEYA
    // await expect(errorMessageLocator).toContainText('Email Address already exist');

    // (Ekstra) Signup formunun hala görünür olduğunu da doğrulayabiliriz.
    await expect(page.locator('div.signup-form h2')).toHaveText('New User Signup!');
  });
});