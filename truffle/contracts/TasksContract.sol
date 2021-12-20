// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TasksContract {

  uint256 public tasksCounter = 0;

  constructor() {
    createTask("Primer tarea de ejemplo", "Tengo que hacer algo");
  }

  struct Task {
    uint256 id;
    string title;
    string description;
    bool done;
    uint256 createdAt;
  }
  
  mapping (uint256 => Task) public tasks;

  event TaskCreated(
    uint256 id,
    string title,
    string description,
    bool done,
    uint256 createdAt
  );

  event TaskToggleDone(
    uint256 id,
    bool done
  );

  function createTask(string memory _title, string memory _desciption) public {
    tasksCounter++;
    tasks[tasksCounter] = Task(tasksCounter, _title, _desciption, false, block.timestamp);

    emit TaskCreated(tasksCounter, _title, _desciption, false, block.timestamp);
  }

  function toggleDone(uint256 _id) public {
    Task memory _task = tasks[_id];
    _task.done = !_task.done;
    tasks[_id] = _task;
    
    emit TaskToggleDone(_id, _task.done);
  }

}