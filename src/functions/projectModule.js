import { loadProjectTasks } from "./taskModule";

const projectModalDialog = document.getElementById("project-modal-container");
const addProjectBtn = document.querySelector(".add-project-btn");
const projectCancelBtn = document.getElementById("project-close-btn");
const projectText = document.getElementById("project-text");
const projectForm = document.getElementById("project-form");
const projectTitleText = document.querySelector(".project-title-text");
const projectContainer = document.querySelector(".project-container");
const projectDropdown = document.getElementById("project");
const deleteConfModal = document.getElementById("delete-conf-project-modal");
const deleteConfText = document.querySelector(".delete-conf-project-text");
const confDeleteProjectBtn = document.querySelector(".conf-delete-project-btn");
const confCancelBtn = document.querySelector(".conf-cancel-project-btn");

function projectModal() {
  function openProjectModal() {
    projectModalDialog.showModal();
    projectText.innerText = "";
  }

  function closeProjectModal() {
    projectModalDialog.close();
  }

  addProjectBtn.addEventListener("click", openProjectModal);
  projectCancelBtn.addEventListener("click", closeProjectModal);

  loadProjects();
  registerProjectModalDialog();
  selectBtn();
}

class Project {
  constructor(id, title, description) {
    this.id = id;
    this.title = title;
    this.description = description;
  }

  createProject() {
    const project = document.createElement("div");
    const projectBtnField = document.createElement("button");
    const projectTitle = document.createElement("span");
    const projectDescription = document.createElement("span");
    const editProjectBtn = document.createElement("button");
    const deleteProjectBtn = document.createElement("button");

    project.className = "project-content";
    projectBtnField.classList.add("btn-field", "btn-select");
    projectTitle.className = "project-title";
    projectDescription.className = "project-description";
    editProjectBtn.classList.add("edit-btn", "edit-project-btn");
    deleteProjectBtn.classList.add("delete-btn", "delete-project-btn");

    projectTitle.innerText = this.title;
    projectDescription.innerText = this.description;

    editProjectBtn.dataset.id = this.id;
    deleteProjectBtn.dataset.id = this.id;
    projectBtnField.type = "button";
    projectBtnField.setAttribute("data-btn", "select");

    editProjectBtn.addEventListener("click", editProject);
    deleteProjectBtn.addEventListener("click", showDeleteConfirm);
    projectBtnField.addEventListener("click", loadProjectTasks);

    project.appendChild(projectBtnField);
    projectBtnField.appendChild(projectTitle);
    projectBtnField.appendChild(projectDescription);
    projectBtnField.appendChild(editProjectBtn);
    projectBtnField.appendChild(deleteProjectBtn);

    return project;
  }
}

function selectBtn() {
  const bntSelect = document.querySelectorAll("[data-btn]");
  let activeBtn = null;

  bntSelect.forEach((bntSelect) => {
    bntSelect.addEventListener("click", (e) => {
      e.currentTarget.classList.add("current");

      if (activeBtn != null && activeBtn !== e.currentTarget) {
        activeBtn.classList.remove("current");
      }
      activeBtn = e.currentTarget;
    });
  });
}

function registerProjectModalDialog() {
  projectModalDialog.addEventListener("submit", onSubmitProjectModalDialog);
  projectForm.reset();
}

function onSubmitProjectModalDialog(e) {
  const projectId = parseInt(e.srcElement.dataset.id);
  let projectTitle = projectTitleText.value;
  let projectDescription = projectText.value;

  if (projectId) {
    let allProjects = getProjects();
    let projectToEdit = allProjects.find((project) => {
      return project.id === projectId;
    });
    projectToEdit.title = projectTitle;
    projectToEdit.description = projectDescription;
    setProjects(allProjects);

    delete e.srcElement.dataset.id;
  } else {
    let id = getId();

    let newProject = new Project(id, projectTitle, projectDescription);

    saveProject(newProject);
  }
  loadProjects();

  e.srcElement.reset();
  projectModalDialog.close();
}

function getId() {
  let id;
  do {
    id = Math.floor(Math.random() * 10000);
  } while (isIdNotUnique(id));
  return id;
}

function isIdNotUnique(id) {
  return getProjects()
    .map((project) => {
      return project.id;
    })
    .includes(id);
}

function addToProjectContainer(newProject) {
  projectContainer.appendChild(newProject.createProject());
}

function saveProject(newProject) {
  let allProjects = getProjects();
  allProjects.push(newProject);
  setProjects(allProjects);
}

function getProjects() {
  return (JSON.parse(localStorage.getItem("project")) || []).map((project) => {
    return new Project(project.id, project.title, project.description);
  });
}

function setProjects(projects) {
  localStorage.setItem("project", JSON.stringify(projects));
}

function removeProjectsFromHtml() {
  new DocumentFragment().append(
    ...projectContainer.querySelectorAll(".project-content"),
  );
}

function removeProjectsFromDropdown() {
  new DocumentFragment().append(
    ...projectDropdown.querySelectorAll("user-project"),
  );
}

function addToDropdownList(projectTitle) {
  const createProjectOption = document.createElement("option");
  createProjectOption.classList.add("user-project");
  createProjectOption.innerText = projectTitle;
  projectDropdown.appendChild(createProjectOption);
}

function loadProjects() {
  removeProjectsFromHtml();
  removeProjectsFromDropdown();
  getProjects().forEach(function (project) {
    addToProjectContainer(project);
    addToDropdownList(project.title);
  });
}

function showDeleteConfirm(e) {
  confDeleteProjectBtn.dataset.id = e.srcElement.dataset.id;
  deleteConfModal.showModal();
  deleteConfText.innerText = "Are you sure you want to delete this project?";
}

function hideDeleteModal() {
  deleteConfModal.close();
}

confDeleteProjectBtn.addEventListener("click", deleteProjects);
confCancelBtn.addEventListener("click", hideDeleteModal);

function deleteProjects(e) {
  const idToRemove = parseInt(e.srcElement.dataset.id);
  const allProjects = getProjects();
  const indexToRemove = allProjects.findIndex((project) => {
    return project.id === idToRemove;
  });
  allProjects.splice(indexToRemove, 1);
  setProjects(allProjects);
  loadProjects();
  hideDeleteModal();
}

function editProject(e) {
  projectModalDialog.showModal();
  let allProjects = getProjects();
  const projectIdToEdit = parseInt(e.srcElement.dataset.id);
  const projectToEdit = allProjects.find((project) => {
    return project.id === projectIdToEdit;
  });
  projectTitleText.value = projectToEdit.title;
  projectText.innerText = projectToEdit.description;
  projectForm.dataset.id = projectToEdit.id;
}

export { projectModal };
