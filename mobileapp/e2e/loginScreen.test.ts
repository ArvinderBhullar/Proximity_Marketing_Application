import {expect} from 'detox';

describe('Login Screen', () => {
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

  it('should login and display coupons successfully', async () => {
    await waitFor(element(by.id('loginScreen')))
      .toBeVisible()
      .withTimeout(10000);
    await waitFor(element(by.id('loginEmail')))
      .toBeVisible()
      .withTimeout(5000);
    await waitFor(element(by.id('loginPassword')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('loginEmail')).typeText('testmcgrest@gmail.com');
    await element(by.id('loginPassword')).typeText('Ind433ia');
    await element(by.id('loginPassword')).tapReturnKey();

    await waitFor(element(by.id('loginButton')))
      .toBeVisible()
      .withTimeout(5000);

    const loginButton = element(by.id('loginButton'));
    await loginButton.tap();
    await waitFor(element(by.id('couponList')))
      .toBeVisible()
      .withTimeout(10000);

    await expect(element(by.id('couponList'))).toBeVisible();
  });

  it('should save coupons successfully', async () => {
    await waitFor(element(by.id('couponList')))
      .toBeVisible()
      .withTimeout(10000);
    await waitFor(element(by.id('saveklX8H65CdoCFOxLehbUh')))
      .toBeVisible()
      .withTimeout(10000);

    const saveButton = element(by.id('saveklX8H65CdoCFOxLehbUh'));
    await saveButton.tap();
    await waitFor(element(by.id('saveklX8H65CdoCFOxLehbUh')))
      .not.toExist()
      .withTimeout(10000);
    await expect(element(by.id('saveklX8H65CdoCFOxLehbUh'))).not.toExist();
  });

  it('should navigate to saved coupons and display them successfully', async () => {
    await waitFor(element(by.id('couponList')))
      .toBeVisible()
      .withTimeout(10000);
    await waitFor(element(by.id('saveTab')))
      .toExist()
      .withTimeout(10000);

    const savedCouponTab = element(by.id('saveTab'));
    await savedCouponTab.tap();
    await waitFor(element(by.id('savedCouponList')))
      .toExist()
      .withTimeout(10000);
    await expect(element(by.id('savedCouponList'))).toBeVisible();
  });

  it('should unsave coupons successfully', async () => {
    await waitFor(element(by.id('savedCouponList')))
      .toBeVisible()
      .withTimeout(10000);
    await waitFor(element(by.id('unsaveklX8H65CdoCFOxLehbUh')))
      .toExist()
      .withTimeout(10000);

    const unSaveButton = element(by.id('unsaveklX8H65CdoCFOxLehbUh'));
    await unSaveButton.tap();
    await waitFor(element(by.id('unsaveklX8H65CdoCFOxLehbUh')))
      .not.toExist()
      .withTimeout(10000);
    await expect(element(by.id('unsaveklX8H65CdoCFOxLehbUh'))).not.toExist();
  });
});
