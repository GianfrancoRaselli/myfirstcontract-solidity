App = {

  web3Provider: {},
  account: {},
  contracts: {},
  tasksContract: {},

  init: async () => {
    App.loadEtherum();
    await App.loadTasksContract();
    App.renderTasks();
  },

  loadEtherum: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      App.loadAccount();
    } else {
      alert('No ethereum browser is installed. Try it installing MetaMask');
    }
  },

  loadAccount: async () => {
    const accounts = await App.web3Provider.request({ method: 'eth_requestAccounts' });
    App.account = accounts[0];
    document.getElementById('account').innerHTML = App.account;
  },

  loadTasksContract: async () => {
    const res = await fetch('TasksContract.json');
    const tasksContractJSON = await res.json();
    App.contracts.tasksContract = TruffleContract(tasksContractJSON);
    App.contracts.tasksContract.setProvider(App.web3Provider);
    App.tasksContract = await App.contracts.tasksContract.deployed();
  },

  renderTasks: async () => {
    const tasksCounter = await App.tasksContract.tasksCounter();
    const tasksCounterNumber = tasksCounter.toNumber();

    let html = '';

    for(let i = 1; i <= tasksCounterNumber; i++) {
      const task = await App.tasksContract.tasks(i);

      let taskElement = `
        <div class="card bg-dark rounded-0 mb-2">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>${task.title}</span>

            <div class="form-check form-switch">
              <input class="form-check-input" data-id="${task.id}" type="checkbox" ${task.done && "checked"} onChange="App.toggleDone(this)" />
            </div>
          </div>

          <div class="card-body">
            <span>${task.description}</span>
            <p class="text-muted">Task was created ${new Date(task.createdAt * 1000).toLocaleString()}</p>
          </div>
          
        </div>
      `;

      html += taskElement;
    }

    document.querySelector('#tasksList').innerHTML = html;
  },

  createTask: async (title, description) => {
    if (App.account) {
      await App.tasksContract.createTask(title, description, { from: App.account });

      App.renderTasks();
    }
  },

  toggleDone: async (element) => {
    if (App.account) {
      const taskId = element.dataset.id;
      await App.tasksContract.toggleDone(taskId, { from: App.account });

      App.renderTasks();
    }
  }

}

App.init();