
// pages/secure-area.js
exports.SecurePage = class SecurePage {

    constructor(page) {
      this.page = page;
      this.secureTitle = page.getByText('Secure Area', { exact: true });
      this.logoutButton = page.getByRole('link', { name: 'Logout' });
      this.flash = page.locator('#flash');
    }
    async gotoSecureArea() {
      await this.page.goto('/secure');
    }
    async clickLogout() {
      await this.logoutButton.click();
    }
    async goBack() {
      await this.page.goBack();
    }
  };
  
  