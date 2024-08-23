import '../src/style.css';
import { noteModal } from './functions/noteModal';
import { taskModal } from './functions/taskModal';

function setDateValue() {
	const dateInput = document.getElementById("task-date");
	const today = new Date().toISOString().split("T")[0];
	dateInput.setAttribute("min", today);
    dateInput.setAttribute("value", today);
}

noteModal();
taskModal();
setDateValue();

class Task {
    constructor(text, date, prio, project) {
        this.text = text;
        this.date = date;
        this.prio = prio;
        this.project = project;
    }

    getAsRow() {
        //const taskList = document.querySelector("task-list");
        const task = document.createElement("div");
        task.classList.add("task");

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
        checkBoxInput.id = "task-done";

        const taskText = document.createElement("span");
        taskText.innerHTML = this.text;
        taskText.classList.add("task-name");

        const taskDate = document.createElement("span");
        taskDate.innerHTML = this.date;
        taskDate.classList.add("task-date");

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-task");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-task");

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

const saveBtn = document.getElementById("save-task-btn");
saveBtn.addEventListener("click", () => {
    const taskText = document.getElementById("task-text").value;
    const taskDate = document.getElementById("task-date").value;
    const taskPrio = ["prio-low", "prio-medium", "prio-high"].map((id) => {
        return document.getElementById(id);
    }).find((element) => {
        return element.checked;
    }).value;

    let task = new Task(taskText, taskDate, taskPrio, "task");
    console.log(task);
    addToList(task);

})

// let firstTask = new Task ('Work out', '23-08-2024', 'low', 'task');
// console.log(firstTask);

function addToList(task) {
    const taskList = document.querySelector(".task-list");
    taskList.appendChild(task.getAsRow());
}
