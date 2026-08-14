import FormsScreen from '../screenobjects/forms.screen.js';

/**
 * forms.spec.js — a starter spec to extend in the lab.
 */

describe('Forms', () => {
  it('accepts typed text', async () => {
    await FormsScreen.open();
    await FormsScreen.typeInto('hello workshop');
    const value = await (await $(FormsScreen.selectors.inputText)).getText();
    await expect(value).toContain('hello');
  });
});
