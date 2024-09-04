import '../src/style.css';
import { noteModal } from './functions/noteModal';
import { taskModal } from './functions/taskModal';

function setDateValue() {
	const dateInput = document.getElementById("task-date");
	const today = new Date().toISOString().split("T")[0];
	dateInput.setAttribute("min", today);
    dateInput.setAttribute("value", today);
}

class Task {
    constructor(id, text, date, prio, project) {
        this.id = id
        this.text = text;
        this.date = date;
        this.prio = prio;
        this.project = project;
    }

    getAsRow() {
        const task = document.createElement("div");
        task.classList.add("task", "new-task");

        const dotClassMap = {
            low: "dot-green",
            medium: "dot-yellow",
            high: "dot-red"
        };
        const prioDot = document.createElement("span");
        prioDot.classList.add("dot", dotClassMap[this.prio]);

        const checkTask = document.createElement("span");
        const checkBoxInput = document.createElement("input");
        checkBoxInput.type = "checkbox";
        checkBoxInput.name = "name";
        checkBoxInput.value = "value";
        checkBoxInput.className = "task-done";

        const taskText = document.createElement("span");
        taskText.innerHTML = this.text;
        taskText.classList.add("task-name");

        const taskDate = document.createElement("span");
        taskDate.textContent = this.date;
        taskDate.classList.add("task-date");

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-task");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-task");
        deleteBtn.addEventListener("click", deleteTasks);
        deleteBtn.dataset.id = this.id;

        task.appendChild(prioDot);
        task.appendChild(checkTask);
        checkTask.appendChild(checkBoxInput);
        task.appendChild(taskText);
        task.appendChild(taskDate);
        task.appendChild(editBtn);
        task.appendChild(deleteBtn);

        return task;
    }
};

function registerSubmitForm() {
    const resetForm = document.getElementById("task-modal-content");
    resetForm.addEventListener("submit", onSubmitForm);
}

function onSubmitForm(e) {
    const taskText = document.getElementById("task-text").value;
    const taskDate = document.getElementById("task-date").value;
    const taskPrio = ["prio", "prio-medium", "prio-high"].map((id) => {
        return document.getElementById(id);
    }).find((element) => {
        return element.checked;
    }).value;

    let id;

    do {
        id = Math.floor(Math.random() * 10000);
    } while(isIdNotUnique(id));

    let newTask = new Task(id, taskText, taskDate, taskPrio, "task");

    saveTask(newTask);
    loadTasks();

    e.srcElement.reset();
    document.getElementById("task-dialog").close();
}

function isIdNotUnique(id) {
    return getTasks().map(task => {
        return task.id;
    }).includes(id);
}

function addToList(newTask) {
    const taskList = document.querySelector(".task-list");
    taskList.appendChild(newTask.getAsRow());
}

function saveTask(newTask) {
    let allTasks = getTasks();
    allTasks.push(newTask);
    setTasks(allTasks);
}

function getTasks() {
    return (JSON.parse(localStorage.getItem("task")) || []).map(task => {
        return new Task(task.id, task.text, task.date, task.prio, task.project);
    });
}

function setTasks(tasks) {
    localStorage.setItem("task", JSON.stringify(tasks));
}

function loadTasks() {
    const taskList = document.querySelector(".task-list");
    taskList.replaceChildren([]);
    getTasks().forEach(function(task) {
        addToList(task)
    })
}

function deleteTasks(e) {
    const idToRemove = e.srcElement.dataset.id;
    const allTasks = getTasks();
    const indexToRemove = allTasks.findIndex(task => {
        return task.id === idToRemove;
    })
    allTasks.splice(indexToRemove, 1);
    setTasks(allTasks);
    loadTasks();
}

function initialize() {
    noteModal();
    taskModal();
    setDateValue();
    registerSubmitForm();
    loadTasks();
}

document.addEventListener("DOMContentLoaded", initialize);