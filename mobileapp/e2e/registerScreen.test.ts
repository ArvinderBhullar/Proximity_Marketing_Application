import {expect} from 'detox';
const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
let randomString = '';
for (let i = 0; i < 8; i++) {
  randomString += characters.charAt(
    Math.floor(Math.random() * characters.length),
  );
}
const registerEmail = `${randomString}@example.com`;

describe('Register Screen', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      launchArgs: {
        detoxPrintBusyIdleResources: 'YES',
        // Notifications
        detoxURLBlacklistRegex: '.*firestore.*',
      },
    });
  });

  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  it('should navigate to signup screen successfully', async () => {
    await waitFor(element(by.id('loginScreen')))
      .toBeVisible()
      .withTimeout(10000);

    await waitFor(element(by.id('loginButton')))
      .toBeVisible()
      .withTimeout(5000);

    const signupButton = element(by.id('signupButton1'));
    await signupButton.tap();
    await waitFor(element(by.id('registerScreen')))
      .toBeVisible()
      .withTimeout(10000);

    await expect(element(by.id('registerScreen'))).toBeVisible();
  });

  it('should register successfully', async () => {
    await waitFor(element(by.id('registerScreen')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('firstName')).typeText('test');
    await element(by.id('lastName')).typeText('account');
    await element(by.id('registerEmail')).typeText(registerEmail);
    await element(by.id('registerPassword')).typeText(randomString);
    await element(by.id('registerPassword')).tapReturnKey();

    const registerButton = element(by.id('registerButton'));
    await registerButton.tap();
    await waitFor(element(by.id('couponList')))
      .toBeVisible()
      .withTimeout(10000);

    await expect(element(by.id('couponList'))).toBeVisible();
  });

  it('should redeem successfully', async () => {
    await waitFor(element(by.id('couponList')))
      .toBeVisible()
      .withTimeout(10000);
    await waitFor(element(by.id('redeemklX8H65CdoCFOxLehbUh')))
      .toBeVisible()
      .withTimeout(10000);

    const redeemButton1 = element(by.id('redeemklX8H65CdoCFOxLehbUh'));
    await redeemButton1.tap();
    await waitFor(element(by.id('DYSON100')))
      .toBeVisible()
      .withTimeout(10000);
    const closePopupButton = element(by.id('closePopupButton'));
    await closePopupButton.tap();
    await waitFor(element(by.id('redeemklX8H65CdoCFOxLehbUh')))
      .not.toExist()
      .withTimeout(10000);
    await expect(element(by.id('redeemklX8H65CdoCFOxLehbUh'))).not.toExist();
  });

  it('should logout successfully', async () => {
    await waitFor(element(by.id('profileTab')))
      .toBeVisible()
      .withTimeout(10000);

    const profileTab = element(by.id('profileTab'));
    await profileTab.tap();

    await waitFor(element(by.id('logoutButton')))
      .toBeVisible()
      .withTimeout(10000);
    const logoutButton = element(by.id('logoutButton'));
    await logoutButton.tap();

    await waitFor(element(by.id('loginScreen')))
      .toBeVisible()
      .withTimeout(10000);

    await expect(element(by.id('loginScreen'))).toBeVisible();
  });
});
