/* eslint-disable no-undef */
describe('Example', () => {
  beforeEach(async () => {
    // device.reloadReactNative();
  });

  it('should have list of examples', async () => {
    await expect(element(by.id('example_list'))).toBeVisible();
  });

  it('should open Scrollable top bar example', async () => {
    await element(by.id('Scrollable top bar')).tap();
    await expect(element(by.id('contacts-tab'))).toBeVisible();
    await element(by.id('article-tab')).tap();
    await expect(element(by.id('article-container'))).toBeVisible();
    if (device.getPlatform() === 'ios') {
      await element(by.id('article-container')).swipe('left');
    }
    await element(by.id('back-button')).tap();
  });

  it('should open Top tab bar with icons', async () => {
    await element(by.id('Top tab bar with icons')).tap();
    await expect(element(by.id('chat-container'))).toBeVisible();
    if (device.getPlatform() === 'ios') {
      await element(by.id('chat-container')).swipe('left');
      await expect(element(by.id('contact-container'))).toBeVisible();
    }
    await element(by.id('back-button')).tap();
  });

  it('should open Custom indicator example', async () => {
    await element(by.id('Custom indicator')).tap();
    await expect(element(by.id('article-container'))).toBeVisible();
    if (device.getPlatform() === 'ios') {
      await element(by.id('article-container')).swipe('left');
      await expect(element(by.id('contacts-tab'))).toBeVisible();
    }
    await element(by.id('albums-tab')).tap();
    await expect(element(by.id('albums-container'))).toBeVisible();
    await element(by.id('back-button')).tap();
  });

  it('should open Custom tab bar example', async () => {
    await element(by.id('Custom tab bar')).tap();
    await expect(element(by.id('contact-container'))).toBeVisible();
    if (device.getPlatform() === 'ios') {
      await element(by.id('contact-container')).swipe('left');
      await expect(element(by.id('albums-container'))).toBeVisible();
    }
    await element(by.id('chat-tab')).tap();
    await expect(element(by.id('chat-container'))).toBeVisible();
    await element(by.id('back-button')).tap();
  });

  it('should open coverflow example', async () => {
    await element(by.id('Coverflow')).tap();
    await expect(element(by.id('Homogenic'))).toBeVisible();
    await element(by.id('Homogenic')).swipe('left');
    await expect(element(by.id('Number of the Beast'))).toBeVisible();
    await element(by.id('back-button')).tap();
  });
});
