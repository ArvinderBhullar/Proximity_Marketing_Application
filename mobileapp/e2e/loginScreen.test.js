describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({newInstance: true});
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should test something', async () => {
    await element(by.id('ButtonID')).tap();
    await expect(element(by.text('The button has been pressed'))).toBeVisible();
  });
});
