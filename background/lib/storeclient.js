// This is a custom store, so it should hold all the kinds of data required by the whole extension here
// also have setters and getters for each of them with validation (essentially models)

// NOTE - caching layer can be added if needed using private variables like _isUpdatedVerboseValue or something

class StoreClient {
  constructor(storageType) {
    this._currnentStore = storageType ?? chrome.storage.local;
  }

  /**
   * possible types could be chrome.storage.local
   * or .session or .sync
   * @param {Storage} storageType
   */
  setStorageType(storageType) {
    this._currnentStore = storageType;
  }

  /**
   * @returns {Promise<string>}
   */
  async getTextBoxValue() {
    let { textboxValue } = await this._currnentStore.get(["urlTextbox"]);
    // TODO - add default values and validations if needed
    textboxValue = textboxValue || "";
    return textboxValue;
  }

  /**
   * @param {string} textboxValue
   */
  async setTextBoxValue(textboxValue) {
    await this._currnentStore.set({ urlTextbox: textboxValue });
  }

  /**
   * @param {string} textToAppend
   */
  async appendTextBoxValue(textToAppend) {
    let textBoxValue = await this.getTextBoxValue();

    // Adding extra new line as new data going in should
    if (textBoxValue.length > 0) textBoxValue += "\n";

    textBoxValue += textToAppend;

    await this._currnentStore.set({ urlTextbox: textBoxValue });
  }

  async clearTextBoxValue() {
    this.setTextBoxValue("");
  }

  /**
   * @returns {Promise<Boolean>}
   */
  async getVerboseValue() {
    let { verboseValue } = await this._currnentStore.get(["verbose"]);
    verboseValue = verboseValue ?? false;

    return verboseValue;
  }

  /**
   * @param {Boolean} verboseValue
   */
  async setVerboseValue(verboseValue) {
    // TODO - validate that it is bool?
    await this._currnentStore.set({ verboseValue });
  }
}

export { StoreClient };
