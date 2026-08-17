import Screen from './screen.js';

/**
 * forms.screen.js — the Forms tab of the WDIO native demo app.
 * A starter screen object; you'll extend it in the lab.
 */

const SELECTORS = {
  inputText: '~input-text',
  activeSwitch: '~switch',
  dropdown: '~Dropdown',
  activeButton: '~button-Active',
  inactiveButton: '~button-Inactive',
  resultText: '~input-text-result',
};

class FormsScreen extends Screen {
  async open() {
    await this.openTab('Forms');
    await this.waitFor(SELECTORS.inputText);
  }

  async typeInto(text) {
    await (await $(SELECTORS.inputText)).setValue(text);
  }

  get selectors() {
    return SELECTORS;
  }
}

export default new FormsScreen();
export { SELECTORS };
