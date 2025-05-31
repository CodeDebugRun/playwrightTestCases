// tests/test-case-2.spec.js
const { test, expect } = require('@playwright/test');

// Bu test case için önceden kayıtlı bir kullanıcıya ihtiyacımız var.

test.describe('Test Case 2: Login User with correct email and password', () => {
  const uniqueName = `LoginUser${Date.now()}`;
  const uniqueEmail = `loginuser${Date.now()}@example.com`;
  const password = 'MySecurePassword123';

  test.beforeAll(async ({ browser }) => {
    // Bu testten önce bir kullanıcı oluşturalım ki onunla giriş yapabilelim.
    // Yeni bir browser context ve page kullanmak, ana testin state'ini etkilemez.
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://automationexercise.com/login');
      // --- ÇEREZ ONAYI POP-UP'INI KAPATMA (beforeAll İÇİN) ---
    try {
      const consentButtonLocator = page.locator('button:has(p.fc-button-label:has-text("Consent"))');

      const consentElement = consentButtonLocator.first();
      await consentElement.waitFor({ state: 'visible', timeout: 7000 }); // 7 saniye bekle

      if (await consentElement.isVisible()) {
        await consentElement.click();
        console.log('Consent pop-up (beforeAll) başarıyla tıklandı.');
      } else {
        console.log('Consent butonu (beforeAll) waitFor sonrası görünür değil veya bulunamadı.');
      }
    } catch (error) {
      console.warn('Consent pop-up (beforeAll) handle edilirken bir hata oluştu veya bulunamadı. Teste devam ediliyor...', error.message);
    }
    // --- ÇEREZ ONAYI POP-UP'I SONU ---
    await page.locator('input[data-qa="signup-name"]').fill(uniqueName);
    await page.locator('input[data-qa="signup-email"]').fill(uniqueEmail);
    await page.locator('button[data-qa="signup-button"]').click();

    await expect(page.locator('div.login-form h2.title > b')).toHaveText('Enter Account Information');
    await page.locator('#id_gender1').check();
    await page.locator('#password').fill(password);
    await page.locator('#days').selectOption('15');
    await page.locator('#months').selectOption('7'); 
    await page.locator('#years').selectOption('1985');
    await page.locator('#first_name').fill('Login');
    await page.locator('#last_name').fill('TestUser');
    await page.locator('#company').fill('Login Corp');
    await page.locator('#address1').fill('456 Login Ave');
    await page.locator('#country').selectOption('United States');
    await page.locator('#state').fill('California');
    await page.locator('#city').fill('Los Angeles');
    await page.locator('#zipcode').fill('90001');
    await page.locator('#mobile_number').fill('5559876543');
    await page.locator('button[data-qa="create-account"]').click();

    await expect(page.locator('h2[data-qa="account-created"] b')).toHaveText('Account Created!');
    await page.locator('a[data-qa="continue-button"]').click();

    // Kullanıcıyı oluşturduktan sonra çıkış yapalım ki login testi temiz bir şekilde başlasın
    if (await page.locator('a[href="/logout"]').isVisible()) {
        await page.locator('a[href="/logout"]').click();
    }
    await page.close();
    await context.close();
    console.log(`Kullanıcı ${uniqueEmail} test için oluşturuldu ve çıkış yapıldı.`);
  }, 90000); // Corrected position for timeout

  test('should login with correct credentials and then logout', async ({ page }) => {
    // 1. Launch browser and navigate to url 'http://automationexercise.com'
    await page.goto('/');

    // 2. Verify that home page is visible successfully
    await expect(page).toHaveTitle(/Automation Exercise/);

    // 3. Click on 'Signup / Login' button
    await page.locator('a[href="/login"]').click();

    // 4. Verify 'Login to your account' is visible
    await expect(page.locator('div.login-form h2')).toHaveText('Login to your account');

    // 5. Enter correct email address and password
    await page.locator('input[data-qa="login-email"]').fill(uniqueEmail);
    await page.locator('input[data-qa="login-password"]').fill(password);

    // 6. Click 'login' button
    await page.locator('button[data-qa="login-button"]').click();

    // 7. Verify that 'Logged in as username' is visible
    await expect(page.locator('li a i.fa-user + b')).toHaveText(uniqueName);

    // 8. (Test Case 4'ten bir adım) Click 'Logout' button
    await page.locator('a[href="/logout"]').click();

    // 9. Verify that user is navigated to login page
    await expect(page).toHaveURL('https://automationexercise.com/login');
    await expect(page.locator('div.login-form h2')).toHaveText('Login to your account'); // Tekrar login formunu görmeliyiz
  });

  // Opsiyonel: Test sonrası kullanıcıyı silmek için afterAll hook'u eklenebilir

});
