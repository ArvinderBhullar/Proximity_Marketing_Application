import {expect} from 'detox';
//to still test: displaying stubbed nearby coupons
//notification stub for nearby coupon and click on coupon to show nearby coupon
//unit testing for trilateration

describe('Nearest Coupons', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: {notifications: 'YES'},
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

  it('should login and navigate to nearby coupons successfully', async () => {
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

    await waitFor(element(by.id('nearestTab')))
      .toExist()
      .withTimeout(10000);

    const nearestCouponTab = element(by.id('nearestTab'));
    await nearestCouponTab.tap();
    await waitFor(element(by.id('nearbyCouponList')))
      .toExist()
      .withTimeout(10000);
    await expect(element(by.id('nearbyCouponList'))).toBeVisible();
  });
});
