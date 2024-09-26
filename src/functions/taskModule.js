import { isThisISOWeek, isToday, isPast, format } from "date-fns";

const taskDialog = document.getElementById("task-dialog");
const openTaskModal = document.getElementById("add-task-btn");
const closeTaskModal = document.getElementById("close-task-modal-btn");
const taskText = document.getElementById("task-text");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const taskDate = document.getElementById("task-date");
const deleteConfModal = document.getElementById("delete-conf-modal");
const deleteConfText = document.querySelector(".delete-conf-text");
const confDeleteTaskBtn = document.querySelector(".conf-delete-btn");
const confCancelBtn = document.querySelector(".conf-cancel-btn");

let allTasksBtn = document.querySelector(".btn-all-tasks");
let todayTasksBtn = document.querySelector(".btn-today-tasks");
let weekTasksBtn = document.querySelector(".btn-week-tasks");
let overdueTasksBtn = document.querySelector(".btn-overdue-tasks");
let completeTasksBtn = document.querySelector(".btn-done-tasks");
let allTasksDefault = document.querySelector(".btn-field-default");

function taskModal() {
  openTaskModal.addEventListener("click", () => {
    taskDialog.showModal();
    taskText.innerText = "";
  });

  closeTaskModal.addEventListener("click", () => {
    taskDialog.close();
  });

  loadTasks();
  setDateValue();
  registerSubmitForm();
}

function setDateValue() {
  const today = new Date().toISOString().split("T")[0];
  taskDate.setAttribute("min", today);
  taskDate.setAttribute("value", today);
}

class Task {
  constructor(id, text, date, prio, project, complete) {
    this.id = id;
    this.text = text;
    this.date = date;
    this.prio = prio;
    this.project = project;
    this.complete = complete;
  }

  getAsRow() {
    const task = document.createElement("div");
    const prioDot = document.createElement("span");
    const checkTask = document.createElement("span");
    const checkBoxInput = document.createElement("input");
    const checkmark = document.createElement("span");
    const taskText = document.createElement("span");
    const taskDate = document.createElement("span");
    const deleteBtn = document.createElement("button");
    const editBtn = document.createElement("button");

    const dotClassMap = {
      low: "dot-green",
      medium: "dot-yellow",
      high: "dot-red",
    };

    task.classList.add("task", "new-task");
    prioDot.classList.add("dot", dotClassMap[this.prio]);
    checkTask.classList.add("checkbox-container");
    checkBoxInput.classList.add("toggle-complete");
    checkmark.classList.add("checkmark");
    if (this.complete) {
      task.classList.add("completed");
    }
    taskText.classList.add("task-name");
    taskDate.classList.add("task-date");
    editBtn.classList.add("edit-btn", "edit-task");
    deleteBtn.classList.add("delete-btn", "delete-task");

    taskText.innerText = this.text;
    taskDate.innerText = this.date;

    checkBoxInput.type = "checkbox";
    checkBoxInput.checked = this.complete;
    checkBoxInput.dataset.id = this.id;
    task.dataset.id = this.id;
    editBtn.dataset.id = this.id;
    deleteBtn.dataset.id = this.id;

    checkBoxInput.addEventListener("click", taskComplete);
    editBtn.addEventListener("click", editTask);
    deleteBtn.addEventListener("click", showDeleteConfirm);

    task.appendChild(prioDot);
    task.appendChild(checkTask);
    checkTask.appendChild(checkBoxInput);
    checkTask.appendChild(checkmark);
    task.appendChild(taskText);
    task.appendChild(taskDate);
    task.appendChild(editBtn);
    task.appendChild(deleteBtn);

    return task;
  }
}

function taskComplete(e) {
  const checkbox = e.srcElement;
  let checkboxId = parseInt(checkbox.dataset.id);
  let allTasks = getTasks();
  let taskToEdit = allTasks.find((task) => {
    return task.id === checkboxId;
  });
  taskToEdit.complete = !!checkbox.checked;

  let task = document.querySelector(`[data-id="${checkboxId}"]`, ".new-task");
  if (taskToEdit.complete) {
    task.classList.add("completed");
  } else {
    task.classList.remove("completed");
  }
  setTasks(allTasks);
}

function registerSubmitForm() {
  taskForm.addEventListener("submit", onSubmitForm);
}

function onSubmitForm(e) {
  const taskId = parseInt(e.srcElement.dataset.id);
  let taskText = document.getElementById("task-text").value;
  let taskDate = document.getElementById("task-date").value;
  let taskDateFormat = format(new Date(taskDate), "PPP");
  let taskPrio = ["prio", "prio-medium", "prio-high"]
    .map((id) => {
      return document.getElementById(id);
    })
    .find((element) => {
      return element.checked;
    }).value;
  let taskProject = document.getElementById("project").value;
  let complete = false;

  if (taskId) {
    let allTasks = getTasks();
    let taskToEdit = allTasks.find((task) => {
      return task.id === taskId;
    });
    taskToEdit.text = taskText;
    taskToEdit.date = taskDateFormat;
    taskToEdit.prio = taskPrio;
    setTasks(allTasks);

    delete e.srcElement.dataset.id;
  } else {
    let id = getId();

    let newTask = new Task(
      id,
      taskText,
      taskDateFormat,
      taskPrio,
      taskProject,
      complete,
    );

    saveTask(newTask);
  }

  loadTasks();

  e.srcElement.reset();
  taskDialog.close();
}

function getId() {
  let id;
  do {
    id = Math.floor(Math.random() * 10000);
  } while (isIdNotUnique(id));
  return id;
}

function isIdNotUnique(id) {
  return getTasks()
    .map((task) => {
      return task.id;
    })
    .includes(id);
}

function addToList(newTask) {
  taskList.appendChild(newTask.getAsRow());
}

function saveTask(newTask) {
  let allTasks = getTasks();
  allTasks.push(newTask);
  setTasks(allTasks);
}

function getTasks() {
  return (JSON.parse(localStorage.getItem("task")) || []).map((task) => {
    return new Task(
      task.id,
      task.text,
      task.date,
      task.prio,
      task.project,
      task.complete,
    );
  });
}

function setTasks(tasks) {
  localStorage.setItem("task", JSON.stringify(tasks));
}

function removeTasksFromHtml() {
  new DocumentFragment().append(...taskList.querySelectorAll(".new-task"));
}

function loadTasks() {
  removeTasksFromHtml();
  let allTasks = getTasks();
  allTasks = allTasks.filter((task) => task.complete == false);
  allTasks.forEach(function (task) {
    addToList(task);
  });
}

allTasksBtn.addEventListener("click", loadTasks);
todayTasksBtn.addEventListener("click", loadTodayTasks);
weekTasksBtn.addEventListener("click", loadWeekTasks);
overdueTasksBtn.addEventListener("click", loadOverdueTasks);
completeTasksBtn.addEventListener("click", loadCompleteTasks);
allTasksDefault.addEventListener("click", loadTasksNoProject);

function loadProjectTasks(e) {
  removeTasksFromHtml();
  let allTasks = getTasks();
  const projectToFilter =
    e.currentTarget.querySelector(".project-title").innerText;
  allTasks = allTasks.filter((task) => task.project === projectToFilter);
  allTasks.forEach(function (task) {
    addToList(task);
  });
}

function loadTodayTasks() {
  removeTasksFromHtml();
  let allTasks = getTasks();
  allTasks = allTasks.filter(
    (task) => isToday(new Date(task.date)) && task.complete === false,
  );
  allTasks.forEach(function (task) {
    addToList(task);
  });
}

function loadWeekTasks() {
  removeTasksFromHtml();
  let allTasks = getTasks();
  allTasks = allTasks.filter(
    (task) => isThisISOWeek(new Date(task.date)) && task.complete == false,
  );
  allTasks.forEach(function (task) {
    addToList(task);
  });
}

function loadOverdueTasks() {
  removeTasksFromHtml();
  let allTasks = getTasks();
  allTasks = allTasks.filter(
    (task) => isPast(new Date(task.date)) && task.complete == false,
  );
  allTasks.forEach(function (task) {
    addToList(task);
  });
}

function loadCompleteTasks() {
  removeTasksFromHtml();
  let allTasks = getTasks();
  allTasks = allTasks.filter((task) => task.complete);
  allTasks.forEach(function (task) {
    addToList(task);
  });
}

function loadTasksNoProject() {
  removeTasksFromHtml();
  let allTasks = getTasks();
  allTasks = allTasks.filter((task) => task.project === "None");
  allTasks.forEach(function (task) {
    addToList(task);
  });
}

function showDeleteConfirm(e) {
  confDeleteTaskBtn.dataset.id = e.srcElement.dataset.id;
  deleteConfModal.showModal();
  deleteConfText.innerText = "Are you sure you want to delete this task?";
}

function hideDeleteModal() {
  deleteConfModal.close();
}

confDeleteTaskBtn.addEventListener("click", deleteTasks);
confCancelBtn.addEventListener("click", hideDeleteModal);

function deleteTasks(e) {
  const idToRemove = parseInt(e.srcElement.dataset.id);
  const allTasks = getTasks();
  const indexToRemove = allTasks.findIndex((task) => {
    return task.id === idToRemove;
  });
  allTasks.splice(indexToRemove, 1);
  setTasks(allTasks);
  loadTasks();
  hideDeleteModal();
}

function editTask(e) {
  taskDialog.showModal();
  let allTasks = getTasks();
  const taskIdToEdit = parseInt(e.srcElement.dataset.id);
  const taskToEdit = allTasks.find((task) => {
    return task.id === taskIdToEdit;
  });
  taskText.innerText = taskToEdit.text;
  taskDate.value = taskToEdit.date;

  const hashmap = {
    low: "prio",
    medium: "prio-medium",
    high: "prio-high",
  };

  document.getElementById(hashmap[taskToEdit.prio]).checked = taskToEdit.prio;
  taskForm.dataset.id = taskToEdit.id;
}

export { taskModal, loadProjectTasks };
