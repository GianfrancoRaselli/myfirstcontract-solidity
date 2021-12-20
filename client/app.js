App = {

  web3Provider: {},
  web3: {},
  account: {},
  contracts: {},
  tasksContract: {},

  init: async () => {
    await App.loadEtherum();
    await App.loadAccount();
    await App.loadTasksContract();
    App.render();
  },

  loadEtherum: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
    } else if (window.web3) {
      App.web3 = new web3(window.web3.currentProvider);
    } else {
      alert('No ethereum browser is installed. Try it installing MetaMask');
    }
  },

  loadAccount: async () => {
    const accounts = await App.web3Provider.request({ method: 'eth_requestAccounts' });
    App.account = accounts[0];
  },

  loadTasksContract: async () => {
    const res = await fetch('TasksContract.json');
    const tasksContractJSON = await res.json();
    App.contracts.tasksContract = TruffleContract(tasksContractJSON);
    App.contracts.tasksContract.setProvider(App.web3Provider);
    App.tasksContract = await App.contracts.tasksContract.deployed();
  },

  render: () => {
    document.getElementById('account').innerHTML = App.account;
  },

  createTask: async (title, description) => {
    await App.tasksContract.createTask(title, description, { from: App.account });
  },

}

App.init();