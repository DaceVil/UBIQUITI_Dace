import { test, expect } from '@playwright/test';

test('verify header and footer', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    //input[@id='user-name']
    await page.locator("//input[@id='user-name']").type('standard_user');
    //input password
    await page.locator("//input[@id='password']").type('secret_sauce');
    //press login button
    await page.locator("//input[@id='login-button']").click();
    // header contains logo, menu bar, shopping cart

    //footer
    await expect(page.locator("//*[@id='page_wrapper']/footer/ul")).toBeVisible();

    const footerSocialTwitter = await page.locator("//*[@id='page_wrapper']/footer/ul/li[1]/a").textContent();
    expect(footerSocialTwitter).toBe('Twitter');

    const footerSocialFacebook = await page.locator("//*[@id='page_wrapper']/footer/ul/li[2]/a").textContent();
    expect(footerSocialFacebook).toBe('Facebook');

    const footerSocialLinkedIn = await page.locator("//*[@id='page_wrapper']/footer/ul/li[3]/a").textContent();
    expect(footerSocialLinkedIn).toBe('LinkedIn');

    //copyrights
    const copyrights = await page.locator('.footer_copy').textContent();
    expect(copyrights.trim()).toBe('© 2025 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy');

    //header logo

    await expect(page.locator('.header_label')).toHaveText('Swag Labs');

    await expect(page.locator("//button[@id='react-burger-menu-btn']")).toBeVisible();

    await expect(page.locator("//*[@id='shopping_cart_container']")).toBeVisible();
    // hastitle 'Products'
    const title = page.locator("//div[@id='header_container']/div[2]/span");
    await expect(title).toHaveText('Products');
    //filter is present and there is 4 dropdown options
    await expect(page.locator("//*[@id='header_container']/div[2]/div")).toBeVisible();
    const filter = page.locator("//*[@id='header_container']/div[2]/div/span/select/option");
    await expect(filter).toHaveCount(4);

});


test('Login locked_out_user as first - should not be able to log in, standard_user able to log in', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    //input[@id='user-name']
    await page.locator("//input[@id='user-name']").type('locked_out_user');
    //input password
    await page.locator("//input[@id='password']").type('secret_sauce');
    //press login button
    await page.locator("//input[@id='login-button']").click();
    // error should occure
    const errorMessage = await page.locator('div.error-message-container.error');
    await expect(errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    //standard_user log s in
    await page.locator("//input[@id='user-name']").press('Control+a')
    await page.locator("//input[@id='user-name']").type('standard_user');
    //input password
    await page.locator("//input[@id='password']").press('Control+a')
    await page.locator("//input[@id='password']").type('secret_sauce');

    //press login button
    await page.locator("//input[@id='login-button']").click();

    //sort by low to high
    const dropdownSelector = '.product_sort_container';

    await page.waitForSelector(dropdownSelector, { state: 'visible' });
    // Choose the option by value or label (depending on what the dropdown is using)
    await page.selectOption(dropdownSelector, { value: 'lohi' }); // Use the label, value, or index

    //last item should be Sauce Labs Fleece Jacket
    const lastProduct = await page.locator('.inventory_item_name').last();
    // Get the text content of the first product
    const lastProductText = await lastProduct.textContent();

    // Compare the actual text of the first product to the expected string
    expect(lastProductText.trim()).toBe('Sauce Labs Fleece Jacket');

    // open filter
    await page.click('.select_container');

    const filterMenu2 = await page.isVisible('.product_sort_container');
    expect(filterMenu2).toBe(true);

    // add to cart Sauce Labs Fleece Jacket
    await page.getByText('Sauce Labs Fleece Jacket');
    await page.locator("//button[@id='add-to-cart-sauce-labs-fleece-jacket']").click();

    const cartBadge = await page.locator('.shopping_cart_container');
    const cartItemCount = await cartBadge.textContent();
    expect(cartItemCount).toBe('1');

    //sort on A to Z
    const dropdownSelectorAZ = '.product_sort_container';
    await page.waitForSelector(dropdownSelectorAZ, { state: 'visible' });
    await page.selectOption(dropdownSelectorAZ, { value: 'az' });

    //  await page.getByText('Sauce Labs Bike Light'); 
    //last item should be Sauce Labs Bike Light

    const topRightProduct = await page.locator("//a[@id='item_0_title_link']");
    const topRightProductText = await topRightProduct.textContent();

    // Compare the actual text of the first product to the expected string
    await expect(topRightProductText.trim()).toBe('Sauce Labs Bike Light');


    await page.locator("//div[@id='inventory_container']");
    await page.locator("//button[@id='add-to-cart-sauce-labs-bike-light']").click();
    // Get the text content of the first product
    const cartBadge2 = await page.locator('.shopping_cart_container');
    const cartItemCount2 = await cartBadge.textContent();
    expect(cartItemCount2).toBe('2');

    //go to checkout
    await page.locator('.shopping_cart_container').click();

    //fill in details
    await page.locator("//button[@id='checkout']").click();

    await page.getByPlaceholder('First name').fill('Dace');
    await page.getByPlaceholder('Last name').fill('Vilcina');
    await page.getByPlaceholder('Zip/Postal Code').fill('123');

    await page.locator("//input[@id='continue']").click();

    //Verify that the items to purchase match the ones put in the cart.

    const text = await page.locator("//a[@id='item_5_title_link']").textContent();
    await expect(text).toBe(lastProductText);

    const text2 = await page.locator("//a[@id='item_0_title_link']").textContent();
    await expect(text2).toBe(topRightProductText);

    //Verify that the purchase was successful.
    await page.locator("//button[@id='finish']").click();

    const orderComplete = await page.locator('h2.complete-header');
    await expect(orderComplete).toHaveText('Thank you for your order!');
});

test('Additional tests', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    //input[@id='user-name']
    await page.locator("//input[@id='user-name']").type('standard_user');
    //input password
    await page.locator("//input[@id='password']").type('secret_sauce');
    //press login button
    await page.locator("//input[@id='login-button']").click();
    // add to cart and remove 
    await page.getByText('Sauce Labs Fleece Jacket');
    await page.locator("//button[@id='add-to-cart-sauce-labs-fleece-jacket']").click();

    const cartBadge = await page.locator('.shopping_cart_container');
    const cartItemCount = await cartBadge.textContent();
    expect(cartItemCount).toBe('1');

    await page.locator("//button[@id='remove-sauce-labs-fleece-jacket']").click();
    const cartBadgeeEmpty = await page.locator('.shopping_cart_container');
    const cartItemCountEmpty = await cartBadge.textContent();
    expect(cartItemCountEmpty).toBe('');

});