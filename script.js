const addTaskForm = document.querySelector(".js-add-task-form"),
  addInput = document.querySelector(".js-add-task"),
  addBtn = document.querySelector(".js-add-btn"),
  taskCompleteCounter = document.querySelector(".js-task-complete"),
  tasksCounter = document.querySelector(".js-task-counter"),
  tasksContainer = document.querySelector(".js-tasks-box"),
  taskTemplate = document.getElementById("task-template"),
  LOCAL_STORAGE_LIST_KEY = "task.list";

// ||local storage lists //
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

// ||form submit for input value and button //
addTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputValue = addInput.value.trim();
  if (inputValue == null || inputValue === "") return;
  const list = addList(inputValue);
  addInput.value = null;
  lists.push(list);
  saveAndRender();
});

// ||push value to array object list //
function addList(inputValue) {
  return {
    id: Date.now().toString(),
    name: inputValue,
    check: false,
  };
}

// ||remove todo data //
const removeTodo = (idToDelete) => {
  lists = lists.filter((list) => {
    if (list.id === idToDelete) {
      return false;
    } else {
      return true;
    }
  });

  saveAndRender();
};

// || delete todo //
function deleteTodo(event) {
  const deleteButton = event.target;
  const idToDelete = deleteButton.id;

  removeTodo(idToDelete);
  saveAndRender();
}

// ||complete task counter //
function taskCompleted() {
  const inputChecked = document.querySelectorAll(
    'input[type = "checkbox"]:checked'
  ).length;

  inputChecked === 0
    ? (taskCompleteCounter.textContent = `Complete:`)
    : (taskCompleteCounter.textContent = `Complete: ${inputChecked} `);
}

// ||counter for todos created //
function todoCounter() {
  const taskCreated = lists.length;

  let stringTask;
  if (taskCreated === 0) {
    tasksCounter.textContent = "Task:";
  } else if (taskCreated === 1) {
    stringTask = "Task:";
    tasksCounter.textContent = ` ${stringTask} ${taskCreated}`;
  } else {
    stringTask = "Tasks:";
    tasksCounter.textContent = `${stringTask} ${taskCreated} `;
  }
}

// ||save and render //
function saveAndRender() {
  save();
  render();
}

// ||save to local storage //
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
}

// ||rendering of todos //
function render() {
  clearElement(tasksContainer);

  lists.forEach((list) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    let checkbox = taskElement.querySelector("input");
    checkbox.id = list.id;
    checkbox.checked = list.check;
    const label = taskElement.querySelector("label");
    label.htmlFor = list.id;
    label.append(list.name);
    const button = taskElement.querySelector("button");
    button.setAttribute("id", list.id);
    button.onclick = deleteTodo;

    tasksContainer.appendChild(taskElement);

    checkbox.addEventListener("click", (e) => {
      // ||checked input save to local storage
      list.check = e.target.checked;
      save();

      // ||task completed counter
      let count = 0;
      list.check === true ? count++ : count--;
      taskCompleted();
    });
  });

  taskCompleted();
  todoCounter();
}

// ||clear all element for tasks //
function clearElement(tasksContainer) {
  if (lists.length === 0) {
    tasksContainer.innerHTML = "<p>You don't have any task.</p>";
  } else {
    while (tasksContainer.firstChild) {
      tasksContainer.removeChild(tasksContainer.firstChild);
    }
  }
}

render();
