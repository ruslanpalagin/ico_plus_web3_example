const contract = require("truffle-contract");

export default class ContactFactory {
  constructor({mmd, artifacts}){
    this.mmd = mmd;
    this.artifacts = artifacts;
  }

  /**
   * @param contractClassName
   * @param classOptions
   * @returns {Promise.<void>}
   *
   * Examples:
   *   await contractFactory.createClass('DoublyLinkedListPagination')
   *   await contractFactory.createClass('DoublyLinkedListPagination', {defaults: { from: '0x...'}})
   */
  async createClass (contractClassName, classOptions = {}){
    console.log('classOptions', classOptions);
    let Class = contract(this.artifacts[contractClassName]);
    Class.setProvider(this.mmd.web3.currentProvider);
    if (classOptions.defaults) {
      Class.defaults(classOptions.defaults);
    }
    return Class;
  }

  /**
   * @param contractClassName
   * @param address
   * @param classOptions
   * @returns {Promise.<*>}
   *
   * Examples:
   *   await contractFactory.createInstance('DoublyLinkedListPagination')
   *   await contractFactory.createInstance('DoublyLinkedListPagination', { classOptions: { defaults: { from: '0x...' }}})
   *   await contractFactory.createInstance('DoublyLinkedListPagination', { address: '0x...' })
   */
  async createInstance (contractClassName, {address, classOptions} = {}){
    let Class = await this.createClass(contractClassName, classOptions);

    let instance;
    try {
      if (address) {
        instance = await Class.at(address);
      } else {
        instance = await Class.deployed();
      }
    } catch (e) {
      console.warn(e.toString());
    }
    return instance;
  }

  /**
   *
   * @param contractClassName
   * @param options
   * @returns {Promise.<*>}
   *
   * Examples:
   *   await contractFactory.createInstanceForCurrentUser('DoublyLinkedListPagination')
   *   await contractFactory.createInstanceForCurrentUser('DoublyLinkedListPagination', { classOptions: { defaults: { from: '0x...' }}})
   *   await contractFactory.createInstanceForCurrentUser('DoublyLinkedListPagination', { address: '0x...' })
   */
  async createInstanceForCurrentUser (contractClassName, options = {}){
    return this.mmd.$when('isUserSignedIn').then(() => {
      options.classOptions = options.classOptions || {};
      options.classOptions.defaults = options.classOptions.defaults || {};
      options.classOptions.defaults.from = this.mmd.state.userAddress;
      return this.createInstance(contractClassName, options)
    });
  }
}