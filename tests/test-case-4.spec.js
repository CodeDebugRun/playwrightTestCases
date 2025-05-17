// tests/test-case-4.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Test Case 4: Logout User', () => {
  const uniqueName = `LogoutUser${Date.now()}`;
  const uniqueEmail = `logoutuser${Date.now()}@example.com`;
  const password = 'MySecurePassword123'; // Sabit bir şifre kullanıyoruz

  // Testten önce bir kullanıcı oluşturalım ki onunla giriş yapıp sonra çıkış yapabilelim.
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://automationexercise.com/login');

    // --- ÇEREZ ONAYI POP-UP'INI KAPATMA (beforeAll İÇİN) ---
    // Diğer test caselerinde kullandığınız ve çalışan pop-up kapatma kodunu buraya ekleyin.
    try {
      const consentButtonLocator = page.locator('button:has(p.fc-button-label:has-text("Consent"))');
      // VEYA sitenizdeki pop-up'a uygun diğer doğru seçici
      
      const consentElement = consentButtonLocator.first();
      if (await consentElement.isVisible({ timeout: 5000 })) {
        await consentElement.click();
        console.log('Consent pop-up (TC4 beforeAll) başarıyla tıklandı.');
      } else {
        console.log('Consent butonu (TC4 beforeAll) bulunamadı veya görünür değil.');
      }
    } catch (error) {
      console.warn('Consent pop-up (TC4 beforeAll) handle edilirken bir hata oluştu veya bulunamadı...', error.message);
    }
    // --- ÇEREZ ONAYI POP-UP'I SONU ---

    // Kullanıcı Kaydı
    await page.locator('input[data-qa="signup-name"]').fill(uniqueName);
    await page.locator('input[data-qa="signup-email"]').fill(uniqueEmail);
    await page.locator('button[data-qa="signup-button"]').click();

    // Kayıt formu detayları
    await expect(page.locator('h2.title > b:has-text("Enter Account Information")')).toBeVisible();
    await page.locator('#id_gender1').check();
    await page.locator('#password').fill(password);
    await page.locator('#days').selectOption('10');
    await page.locator('#months').selectOption('3'); // March
    await page.locator('#years').selectOption('1995');
    await page.locator('#first_name').fill(uniqueName.replace(/\d+/g, '')); // İsimden sayıları çıkaralım
    await page.locator('#last_name').fill('TestLogout');
    await page.locator('#company').fill('Logout Corp');
    await page.locator('#address1').fill('789 Logout Street');
    await page.locator('#country').selectOption('Australia');
    await page.locator('#state').fill('New South Wales');
    await page.locator('#city').fill('Sydney');
    await page.locator('#zipcode').fill('2000');
    await page.locator('#mobile_number').fill('5556543210');
    await page.locator('button[data-qa="create-account"]').click();

    // Kayıt sonrası
    await expect(page.locator('h2[data-qa="account-created"] b')).toHaveText('Account Created!');
    await page.locator('a[data-qa="continue-button"]').click();

    // Reklam çıkabilir, kapatmaya çalışalım
    try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]');
        if (await frameAd.locator('#dismiss-button').isVisible({timeout: 3000}).catch(() => false)) {
            await frameAd.locator('#dismiss-button').click();
            console.log('Reklam (TC4 beforeAll) kapatıldı.');
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }

    // Kullanıcıyı oluşturduktan sonra çıkış yapalım ki login testi temiz bir şekilde başlasın
    if (await page.locator('a[href="/logout"]').isVisible()) {
        await page.locator('a[href="/logout"]').click();
        console.log(`Kullanıcı ${uniqueEmail} test için oluşturuldu ve çıkış yapıldı.`);
    }
    
    await page.close();
    await context.close();
  }, 90000); // beforeAll timeout'unu artırdık

  test('should logout the user successfully', async ({ page }) => {
    // 1. Launch browser and
    // 2. Navigate to url 'http://automationexercise.com'
    await page.goto('/');

    // --- ÇEREZ ONAYI POP-UP'INI KAPATMA (ANA TEST İÇİN) ---
    // Diğer test caselerinde kullandığınız ve çalışan pop-up kapatma kodunu buraya ekleyin.
    try {
      const consentButtonLocator = page.locator('button:has(p.fc-button-label:has-text("Consent"))');
      const consentElement = consentButtonLocator.first();
      if (await consentElement.isVisible({ timeout: 5000 })) {
        await consentElement.click();
        console.log('Consent pop-up (TC4 ana test) başarıyla tıklandı.');
      } else {
        console.log('Consent butonu (TC4 ana test) bulunamadı veya görünür değil.');
      }
    } catch (error) {
      console.warn('Consent pop-up (TC4 ana test) handle edilirken bir hata oluştu veya bulunamadı...', error.message);
    }
    // --- ÇEREZ ONAYI POP-UP'I SONU ---
    
    // Reklamlar için ek kontrol (ana test için de gerekebilir)
    try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]');
        if (await frameAd.locator('#dismiss-button').isVisible({timeout: 3000}).catch(() => false)) {
            await frameAd.locator('#dismiss-button').click();
            console.log('Reklam (TC4 ana test) kapatıldı.');
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }


    // 3. Verify that home page is visible successfully
    await expect(page).toHaveTitle(/Automation Exercise/);
    await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();

    // 4. Click on 'Signup / Login' button
    await page.locator('a[href="/login"]').click();

    // 5. Verify 'Login to your account' is visible
    await expect(page.locator('div.login-form h2')).toHaveText('Login to your account');

    // 6. Enter correct email address and password (beforeAll'da oluşturulan)
    await page.locator('input[data-qa="login-email"]').fill(uniqueEmail);
    await page.locator('input[data-qa="login-password"]').fill(password);

    // 7. Click 'login' button
    await page.locator('button[data-qa="login-button"]').click();

    // Reklam çıkabilir, kapatmaya çalışalım (Login sonrası)
    try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]');
        if (await frameAd.locator('#dismiss-button').isVisible({timeout: 3000}).catch(() => false)) {
            await frameAd.locator('#dismiss-button').click();
            console.log('Reklam (TC4 login sonrası) kapatıldı.');
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }


    // 8. Verify that 'Logged in as username' is visible
    // uniqueName'i kullanıyoruz.
    await expect(page.locator('li a i.fa-user + b')).toHaveText(uniqueName);

    // 9. Click 'Logout' button
    await page.locator('a[href="/logout"]').click();

    // 10. Verify that user is navigated to login page
    // URL'nin /login ile bittiğini kontrol edebiliriz
    await expect(page).toHaveURL(/.*\/login/);
    // ve 'Login to your account' başlığının tekrar görünür olduğunu doğrulayabiliriz
    await expect(page.locator('div.login-form h2')).toHaveText('Login to your account');
  });
});