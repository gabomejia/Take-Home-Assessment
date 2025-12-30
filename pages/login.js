
// pages/login.js
exports.LoginPage = class LoginPage {

    constructor(page) {
      this.page = page;
      this.usernameTextBox = page.getByRole('textbox', { name: 'Username' });
      this.passwordTextBox = page.getByRole('textbox', { name: 'Password' });
      this.loginButton = page.getByRole('button', { name: 'Login' });
      this.flash = page.locator('#flash'); 
    }
  
    async gotoLoginPage() {
      await this.page.goto('/login');
    }
    async enterUsername(username) {
      await this.usernameTextBox.fill(username);
    }
    async enterPassword(password) {
      await this.passwordTextBox.fill(password);
    }
    async clickButton() {
      await this.loginButton.click();
    }
    async expectFlashContains(text, expectFn) {
      await expectFn(this.flash).toContainText(text);
    }
  };

  