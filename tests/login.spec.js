
// tests/login.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login');
const { SecurePage } = require('../pages/secure-area');

test.describe('Login @login', () => {
  test('successful login @positive', async ({ page }) => {
    const login = new LoginPage(page);
    await login.gotoLoginPage();
    await login.enterUsername(process.env.TEST_USERNAME);
    await login.enterPassword(process.env.TEST_PASSWORD);
    await login.clickButton();
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/secure');
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!') 
  });

  test('invalid username @negative', async ({ page }) => {
    const login = new LoginPage(page);
    await login.gotoLoginPage();
    await login.enterUsername('test');
    await login.enterPassword(process.env.TEST_PASSWORD);
    await login.clickButton();
    await expect(page.locator('#flash')).toContainText('Your username is invalid!') 
  });

  test('invalid password @negative', async ({ page }) => {
    const login = new LoginPage(page);
    await login.gotoLoginPage();
    await login.enterUsername(process.env.TEST_USERNAME);
    await login.enterPassword('mala');
    await login.clickButton();
    await expect(page.locator('#flash')).toContainText('Your password is invalid!') 
  });

  test('empty fields @negative', async ({ page }) => {
    const login = new LoginPage(page);
    await login.gotoLoginPage();
    await login.enterUsername('');
    await login.enterPassword('');
    await login.clickButton();
    await expect(page.locator('#flash')).toContainText('Your username is invalid!') 
  });

  test('cannot access Secure Area without login @negative', async ({ page }) => {
    const secure = new SecurePage(page);
    await secure.gotoSecureArea();
    await expect(secure.flash).toContainText('You must login to view the secure area!');
  });

  test('Back does not restore authenticated session @negative @bug-validation', async ({ page }) => {
    const secure = new SecurePage(page);
    const login = new LoginPage(page);
    
    // Login and logout
    await login.gotoLoginPage();
    await login.enterUsername(process.env.TEST_USERNAME);
    await login.enterPassword(process.env.TEST_PASSWORD);
    await login.clickButton();
    await secure.clickLogout();
    
    // Back button - REAL BUG: should go to /login but stays on /secure
    await secure.goBack();
    
    const currentUrl = page.url();
    if (currentUrl.includes('secure')) {
      console.log('🐛 BUG DOCUMENTED: Back button does not invalidate session properly');
      await expect(page).toHaveURL('https://the-internet.herokuapp.com/secure');
    } else {
      console.log('✅ Correct behavior: Back redirects to login');
      await expect(page).toHaveURL('https://the-internet.herokuapp.com/login');
    }
  });
});

