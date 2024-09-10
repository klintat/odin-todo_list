function taskModal() {
    const taskDialog = document.getElementById("task-dialog");
    const openTaskModal = document.getElementById("add-task-btn");
    const closeTaskModal = document.getElementById("close-task-modal-btn");
    const taskText = document.getElementById("task-text");

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
        taskText.innerText = this.text;
        taskText.classList.add("task-name");

        const taskDate = document.createElement("span");
        taskDate.innerText = this.date;
        taskDate.classList.add("task-date");

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-task");
        editBtn.addEventListener("click", editTask);
        editBtn.dataset.id = this.id;
    
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-task");
        deleteBtn.addEventListener("click", showDeleteConfirm);
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
    const taskId = parseInt(e.srcElement.dataset.id);
    let taskText = document.getElementById("task-text").value;
    let taskDate = document.getElementById("task-date").value;
    let taskPrio = ["prio", "prio-medium", "prio-high"].map((id) => {
        return document.getElementById(id);
    }).find((element) => {
        return element.checked;
    }).value;

    if(taskId) {
        let allTasks = getTasks();
        let noteToEdit = allTasks.find(task => {
            return task.id === taskId;
        })
        noteToEdit.text = taskText;
        noteToEdit.date = taskDate;
        noteToEdit.prio = taskPrio;
        setTasks(allTasks);

        delete e.srcElement.dataset.id;
    } else {
        let id = getId();

        let newTask = new Task(id, taskText, taskDate, taskPrio, "task");

        saveTask(newTask);
    }

    loadTasks();

    e.srcElement.reset();
    document.getElementById("task-dialog").close();
}

function getId() {
    let id;
    do {
       id = Math.floor(Math.random() * 10000);
    } while (isIdNotUnique(id));
    return id;
}

function isIdNotUnique(id) {
    return getTasks().map(task => {
        return task.id;
    }).includes(id);
}

function addToList(newTask) {
    const taskList = document.getElementById("task-list");;
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

function removeTasksFromHtml() {
    const taskList = document.getElementById("task-list");
    new DocumentFragment().append(...taskList.querySelectorAll(".new-task"))
}

function loadTasks() {
    removeTasksFromHtml();
    getTasks().forEach(function(task) {
        addToList(task)
    })
}

const deleteConfModal = document.getElementById("delete-conf-modal");
const deleteConfText = document.querySelector(".delete-conf-text");
const confDeleteTaskBtn = document.querySelector(".conf-delete-btn");
const confCancelBtn = document.querySelector(".conf-cancel-btn");

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
    const indexToRemove = allTasks.findIndex(task => {
        return task.id === idToRemove;
    })
    allTasks.splice(indexToRemove, 1);
    setTasks(allTasks);
    loadTasks();
    hideDeleteModal()
}

function editTask(e) {
    const taskDialog = document.getElementById("task-dialog");
    taskDialog.showModal();
    let allTasks = getTasks();
    const taskIdToEdit = parseInt(e.srcElement.dataset.id);
    const taskToEdit = allTasks.find(task => {
        return task.id === taskIdToEdit;
    })
    document.getElementById("task-text").innerText = taskToEdit.text;
    document.getElementById("task-date").value = taskToEdit.date;

    const hashmap = {
        low: "prio",
        medium: "prio-medium",
        high: "prio-high"
    };

    document.getElementById(hashmap[taskToEdit.prio]).checked = taskToEdit.prio;
    document.getElementById("task-modal-content").dataset.id = taskToEdit.id;
}

export { taskModal }