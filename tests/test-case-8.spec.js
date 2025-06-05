// tests/test-case-8.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Test Case 8: Verify All Products and product detail page', () => {
  test('should display all products and navigate to product detail page', async ({ page }) => {
    // 1. Launch browser and
    // 2. Navigate to url 'http://automationexercise.com'
    await page.goto('/');

    // --- ÇEREZ ONAYI POP-UP'INI KAPATMA (GEREKİRSE) ---
    try {
      const consentButtonLocator = page.locator('button:has(p.fc-button-label:has-text("Consent"))');
      const consentElement = consentButtonLocator.first();
      if (await consentElement.isVisible({ timeout: 5000 })) {
        await consentElement.click();
        console.log('Consent pop-up (TC8) başarıyla tıklandı.');
      }
    } catch (error) {
      console.warn('Consent pop-up (TC8) handle edilirken bir hata oluştu veya bulunamadı...', error.message);
    }
    // --- ÇEREZ ONAYI POP-UP'I SONU ---

    // Reklamlar için ek kontrol (ana sayfada çıkabilir)
    try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]');
        if (frameAd) {
            const dismissButton = frameAd.locator('#dismiss-button, div[id="dismiss-button"], div[aria-label*="Close"]');
             if (await dismissButton.count() > 0 && await dismissButton.first().isVisible({timeout: 3000})) {
                await dismissButton.first().click({timeout: 3000});
                console.log('Reklam (TC8 ana sayfa) kapatıldı.');
            }
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }

    // 3. Verify that home page is visible successfully
    await expect(page).toHaveTitle(/Automation Exercise/);
    await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();

    // 4. Click on 'Products' button
    // Header'daki link: <a href="/products"><i class="material-icons card_travel"></i> Products</a>
    await page.locator('a[href="/products"]').click();

    // 'Products' sayfasına geçişte de reklam çıkabilir.
    try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]');
        if (frameAd) {
            const dismissButton = frameAd.locator('#dismiss-button, div[id="dismiss-button"], div[aria-label*="Close"]');
             if (await dismissButton.count() > 0 && await dismissButton.first().isVisible({timeout: 3000})) {
                await dismissButton.first().click({timeout: 3000});
                console.log('Reklam (TC8 products sayfası) kapatıldı.');
            }
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }

    // 5. Verify user is navigated to ALL PRODUCTS page successfully
    await expect(page).toHaveURL(/.*\/products/);
    // Sayfa başlığını da kontrol edelim
    // <h2 class="title text-center">All Products</h2>
    const allProductsTitle = page.locator('h2.title.text-center:has-text("All Products")');
    await expect(allProductsTitle).toBeVisible();

    // 6. The products list is visible
    // Ürün listesini içeren genel bir konteyner var mı?
    // Örneğin, class'ı 'features_items' olan bir div.
    const productListContainer = page.locator('div.features_items');
    await expect(productListContainer).toBeVisible();
    // İçinde en az bir ürün (product-image-wrapper) olduğunu da doğrulayabiliriz.
    await expect(productListContainer.locator('div.product-image-wrapper').first()).toBeVisible();
    console.log('Ürün listesi görünür.');

    // 7. Click on 'View Product' of first product
    // İlk ürünün 'View Product' linkini bulalım.
    // Her ürün 'div.single-products' veya 'div.product-image-wrapper' içinde olabilir.
    // 'View Product' linki genellikle 'div.product-overlay' içindedir ve href'i '/product_details/X' şeklindedir.
    const firstProductViewLink = productListContainer.locator('div.product-image-wrapper').first().locator('a:has-text("View Product")');
    // VEYA daha spesifik: productListContainer.locator('a[href*="/product_details/"]').first();
    await firstProductViewLink.click();
    console.log('İlk ürünün "View Product" linkine tıklandı.');
    
    // Ürün detay sayfasına geçişte reklam çıkabilir.
     try {
        const frameAd = page.frameLocator('iframe[id^="ad_iframe"]');
        if (frameAd) {
            const dismissButton = frameAd.locator('#dismiss-button, div[id="dismiss-button"], div[aria-label*="Close"]');
             if (await dismissButton.count() > 0 && await dismissButton.first().isVisible({timeout: 3000})) {
                await dismissButton.first().click({timeout: 3000});
                console.log('Reklam (TC8 ürün detay sayfası) kapatıldı.');
            }
        }
    } catch(e) { /* Reklam yok veya kapatılamadı */ }


    // 8. User is landed to product detail page
    // URL'nin '/product_details/' içerdiğini kontrol edelim
    await expect(page).toHaveURL(/.*\/product_details\/\d+/); // \d+ ürün ID'sini temsil eder
    console.log('Ürün detay sayfasına gelindi.');

    // 9. Verify product detail is visible: product name, category, price, availability, condition, brand
    // Bu detaylar genellikle 'div.product-information' class'ı içindedir.
    const productInfoContainer = page.locator('div.product-information');
    await expect(productInfoContainer).toBeVisible();

    // Product Name (genellikle bir h2 içinde)
    await expect(productInfoContainer.locator('h2')).toBeVisible(); // Sadece varlığını kontrol ediyoruz, metin değişebilir.
    const productName = await productInfoContainer.locator('h2').textContent();
    console.log(`Product Name: ${productName}`);

    // Category (genellikle bir <p> içinde "Category: Women > Tops" gibi)
    await expect(productInfoContainer.locator('p:has-text("Category:")')).toBeVisible();
    const category = await productInfoContainer.locator('p:has-text("Category:")').textContent();
    console.log(`Category: ${category}`);

    // Price (genellikle bir <span> içinde "Rs. 500" gibi)
    await expect(productInfoContainer.locator('span > span:has-text("Rs.")')).toBeVisible(); // Fiyat span'ını hedefle
    const price = await productInfoContainer.locator('span > span:has-text("Rs.") ~ span').first().textContent(); // Fiyatın yanındaki span
    // Veya daha basit:
    // await expect(productInfoContainer.locator('span:has-text("Rs.")').first()).toBeVisible();
    // const price = await productInfoContainer.locator('span:has-text("Rs.")').first().textContent();
    console.log(`Price: ${price}`);


    // Availability (genellikle bir <p> içinde <b>Availability:</b> In Stock gibi)
    await expect(productInfoContainer.locator('p:has-text("Availability:")')).toBeVisible();
    const availability = await productInfoContainer.locator('p:has-text("Availability:")').textContent();
    console.log(`Availability: ${availability}`);


    // Condition (genellikle bir <p> içinde <b>Condition:</b> New gibi)
    await expect(productInfoContainer.locator('p:has-text("Condition:")')).toBeVisible();
    const condition = await productInfoContainer.locator('p:has-text("Condition:")').textContent();
    console.log(`Condition: ${condition}`);

    // Brand (genellikle bir <p> içinde <b>Brand:</b> Polo gibi)
    await expect(productInfoContainer.locator('p:has-text("Brand:")')).toBeVisible();
    const brand = await productInfoContainer.locator('p:has-text("Brand:")').textContent();
    console.log(`Brand: ${brand}`);

    console.log('Tüm ürün detayları doğrulandı.');
  });
});