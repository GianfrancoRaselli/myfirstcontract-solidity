const TasksContract = artifacts.require("TasksContract");

contract("TasksContractTest", () => {

  before(async () => {
    this.tasksContract = await TasksContract.deployed();
  });

  it("migrate deployed successfully", async () => {
    const address = this.tasksContract.address;

    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
  });

  it("get tasks list", async () => {
    const tasksCounter = await this.tasksContract.tasksCounter();
    const task = await this.tasksContract.tasks(tasksCounter.toNumber());

    assert.equal(task.id.toNumber(), tasksCounter.toNumber());
    assert.equal(task.title, "Primer tarea de ejemplo");
    assert.equal(task.description, "Tengo que hacer algo");
    assert.equal(task.done, false);
    assert.equal(tasksCounter.toNumber(), 1);
  });

  it("task created successfully", async () => {
    const result = await this.tasksContract.createTask("Tarea de test", "Tengo que hacer otra cosa");
    const taskEvent = result.logs[0].args;

    const taskCounter = await this.tasksContract.tasksCounter();

    assert.equal(taskCounter.toNumber(), 2);
    assert.equal(taskEvent.id.toNumber(), 2);
    assert.equal(taskEvent.title, "Tarea de test");
    assert.equal(taskEvent.description, "Tengo que hacer otra cosa");
    assert.equal(taskEvent.done, false);
  });

  it("task toggle done", async () => {
    const result = await this.tasksContract.toggleDone(1);
    const taskEvent = result.logs[0].args;

    const task = await this.tasksContract.tasks(1);

    assert.equal(taskEvent.id.toNumber(), 1);
    assert.equal(taskEvent.done, true);
    assert.equal(task.done, true);
    assert.equal(taskEvent.done, task.done);
  });

});
