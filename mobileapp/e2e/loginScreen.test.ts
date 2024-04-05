import {expect} from 'detox';

describe('Login Screen', () => {
  beforeAll(async () => {
    await device.launchApp({newInstance: true});
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login successfully', async () => {
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

    await waitFor(element(by.id('loginButton')))
      .toBeVisible()
      .withTimeout(5000);

    const loginButton = element(by.id('loginButton'));
    await loginButton.tap({x: 10, y: 10});
    await waitFor(element(by.id('couponList')))
      .toBeVisible()
      .withTimeout(10000);

    await expect(element(by.id('couponList'))).toBeVisible();
  });
});
