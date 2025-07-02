// tests/test-case-9.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Test Case 9: Search Product', () => {
  test('should search for products and display relevant results', async ({ page }) => {
    // 1. Launch browser and
    // 2. Navigate to url 'http://automationexercise.com'
    await page.goto('/');

    // --- ÇEREZ ONAYI POP-UP'INI KAPATMA (GEREKİRSE) 
    try {
      const consentButtonLocator = page.locator('button:has(p.fc-button-label:has-text("Consent"))');
      const consentElement = consentButtonLocator.first();
      if (await consentElement.isVisible({ timeout: 5000 })) {
        await consentElement.click();
        console.log('Consent pop-up (TC9) başarıyla tıklandı.');
      }
    } catch (error) {
      console.warn('Consent pop-up (TC9) handle edilirken bir hata oluştu veya bulunamadı...', error.message);
    }
    // --- ÇEREZ ONAYI POP-UP'I SONU 

    // Reklamlar için ek kontrol (ana sayfada çıkabilir)
    try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]');
        if (frameAd) {
            const dismissButton = frameAd.locator('#dismiss-button, div[id="dismiss-button"], div[aria-label*="Close"]');
             if (await dismissButton.count() > 0 && await dismissButton.first().isVisible({timeout: 3000})) {
                await dismissButton.first().click({timeout: 3000});
                console.log('Reklam (TC9 ana sayfa) kapatıldı.');
            }
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }

    // 3. Verify that home page is visible successfully
    await expect(page).toHaveTitle(/Automation Exercise/);
    await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();

    // 4. Click on 'Products' button
    await page.locator('a[href="/products"]').click();

    // 'Products' sayfasına geçişte de reklam çıkabilir.
    try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]');
        if (frameAd) {
            const dismissButton = frameAd.locator('#dismiss-button, div[id="dismiss-button"], div[aria-label*="Close"]');
             if (await dismissButton.count() > 0 && await dismissButton.first().isVisible({timeout: 3000})) {
                await dismissButton.first().click({timeout: 3000});
                console.log('Reklam (TC9 products sayfası) kapatıldı.');
            }
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }

    // 5. Verify user is navigated to ALL PRODUCTS page successfully
    await expect(page).toHaveURL(/.*\/products/);
    const allProductsTitle = page.locator('h2.title.text-center:has-text("All Products")');
    await expect(allProductsTitle).toBeVisible();
    console.log('All Products sayfasına gelindi.');

    // 6. Enter product name in search input and click search button
    const productNameToSearch = 'Blue Top'; // Sitede var olan bir ürün adı
    // Arama input'unun ID'si 'search_product'
    await page.locator('#search_product').fill(productNameToSearch);
    // Arama butonunun ID'si 'submit_search'
    await page.locator('#submit_search').click();
    console.log(`"${productNameToSearch}" ürünü arandı.`);

    // Arama sonrası sayfada reklam çıkabilir (bu sitede pek olası değil ama genel bir önlem)
    // ... (gerekirse reklam kapatma kodu) ...

    // 7. Verify 'SEARCHED PRODUCTS' is visible
    // Arama sonuçları için başlık: <h2 class="title text-center">Searched Products</h2>
    const searchedProductsTitle = page.locator('h2.title.text-center:has-text("Searched Products")');
    await expect(searchedProductsTitle).toBeVisible({ timeout: 10000 }); // Arama sonuçlarının yüklenmesi için bekle
    console.log("'Searched Products' başlığı görünür.");

    // 8. Verify all the products related to search are visible
    // Arama sonuçları da 'div.features_items' içinde listelenir.
    // Her bir ürünün adında aranan kelimenin geçtiğini doğrulayabiliriz.
    const productListContainer = page.locator('div.features_items');
    await expect(productListContainer).toBeVisible();

    // En az bir ürünün listelendiğini kontrol edelim.
    const searchedProducts = productListContainer.locator('div.productinfo'); // Her ürünün bilgi bloğu
    await expect(searchedProducts.first()).toBeVisible(); // En az bir ürün olmalı
    const productCount = await searchedProducts.count();
    expect(productCount).toBeGreaterThan(0); // Bulunan ürün sayısı 0'dan büyük olmalı
    console.log(`${productCount} adet ürün bulundu.`);

    // Listelenen tüm ürünlerin adında aranan kelimenin geçtiğini doğrula
    for (let i = 0; i < productCount; i++) {
      const productItem = searchedProducts.nth(i);
      const productNameElement = productItem.locator('p'); // Ürün adı genellikle bir <p> içinde
      const productNameText = await productNameElement.textContent();
      
      // Ürün adının aranan kelimeyi içerip içermediğini (büyük/küçük harf duyarsız) kontrol et
      expect(productNameText.toLowerCase()).toContain(productNameToSearch.toLowerCase());
      console.log(`Doğrulandı: "${productNameText}" ürünü "${productNameToSearch}" kelimesini içeriyor.`);
    }
    console.log('Tüm aranan ürünler doğrulandı.');
  });
});