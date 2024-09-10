function projectModal() {
    const projectModal = document.getElementById("project-modal");
    const addProjectBtn = document.querySelector(".add-project-btn");
    const projectCancelBtn = document.querySelector(".project-cancel-btn");

    function openProjectModal() {
        projectModal.showModal();
    };

    function closeProjectModal() {
        projectModal.close();
    };

    addProjectBtn.addEventListener("click", openProjectModal);
    projectCancelBtn.addEventListener("click", closeProjectModal);

    loadProjects();
    registerProjectForm();
}

class Project {
    constructor(id, title, description){
        this.id = id;
        this.title = title;
        this.description = description;
    }

    createProject() {
        const project = document.createElement("div");
        const projectTitle = document.createElement("div");
        const projectDescription = document.createElement("div");
        const editProjectBtn = document.createElement("button");
        const deleteProjectBtn = document.createElement("button");

        project.className = "project-content";
        projectTitle.className = "project-title";
        projectDescription.className = "project-description";
        editProjectBtn.className = "edit-project-btn";
        deleteProjectBtn.className = "delete-project-btn";

        editProjectBtn.dataset.id = this.id;
        deleteProjectBtn.dataset.id = this.id;

        projectTitle.innerText = this.title;
        projectDescription.innerText = this.description;

        editProjectBtn.addEventListener("click", editProject);
        deleteProjectBtn.addEventListener("click", showDeleteConfirm);

        project.appendChild(projectTitle);
        project.appendChild(projectDescription);
        project.appendChild(editProjectBtn);
        project.appendChild(deleteProjectBtn);

        return project
    }
}

function registerProjectForm() {
    const projectForm = document.getElementById("project-form");
    projectForm.addEventListener("submit", onSubmitProjectForm);
}

function onSubmitProjectForm(e) {
    const projectId = parseInt(e.srcElement.dataset.id);
    let projectTitle = document.querySelector(".project-title-text").value;
    let projectDescription = document.querySelector(".project-description-text").value;
    
    if (projectId) {
        let allProjects = getProjects();
        let projectToEdit = allProjects.find(project => {
            return project.id === projectId;
        })
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
    document.getElementById("project-modal").close();
}

function getId() {
    let id;
    do {
       id = Math.floor(Math.random() * 10000);
    } while (isIdNotUnique(id));
    return id;
}

function isIdNotUnique(id) {
    return getProjects().map(project => {
        return project.id;
    }).includes(id);
}

function addToProjectContainer(newProject) {
    const projectContent = document.querySelector(".project-container");
    projectContent.appendChild(newProject.createProject());
}

function saveProject(newProject) {
    let allProjects = getProjects();
    allProjects.push(newProject);
    setProjects(allProjects);
}

function getProjects() {
    return (JSON.parse(localStorage.getItem("project")) || []).map(project => {
        return new Project(project.id, project.title, project.description);
    });
}

function setProjects(projects) {
    localStorage.setItem("project", JSON.stringify(projects));
}

function removeProjectsFromHtml() {
    const projectContainer = document.querySelector(".project-container");
    new DocumentFragment().append(...projectContainer.querySelectorAll(".project-content"))
}

function loadProjects() {
    removeProjectsFromHtml();
    getProjects().forEach(function(project) {
        addToProjectContainer(project);
    })
}

const deleteConfModal = document.getElementById("delete-conf-project-modal");
const deleteConfText = document.querySelector(".delete-conf-project-text");
const confDeleteProjectBtn = document.querySelector(".conf-delete-project-btn");
const confCancelBtn = document.querySelector(".conf-cancel-project-btn");

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
    const indexToRemove = allProjects.findIndex(project => {
        return project.id === idToRemove;
    })
    allProjects.splice(indexToRemove, 1);
    setProjects(allProjects);
    loadProjects();
    hideDeleteModal()
}

function editProject(e) {
    const projectModal = document.getElementById("project-modal");
    projectModal.showModal();
    let allProjects = getProjects();
    const projectIdToEdit = parseInt(e.srcElement.dataset.id);
    const projectToEdit = allProjects.find(project => {
        return project.id === projectIdToEdit;
    })
    document.querySelector(".project-title-text").value = projectToEdit.title;
    document.querySelector(".project-description-text").innerText = projectToEdit.description;
    document.getElementById("project-form").dataset.id = projectToEdit.id;
}

export { projectModal }