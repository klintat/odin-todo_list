function projectModal() {
    const projectModal = document.getElementById("project-modal");
    const addProjectBtn = document.querySelector(".add-project-btn");
    // const projectSaveBtn = document.querySelector(".save-project-btn");
    const projectCancelBtn = document.querySelector(".project-cancel-btn");

    function openProjectModal() {
        projectModal.showModal();
    };

    function closeProjectModal() {
        projectModal.close();
    };

    addProjectBtn.addEventListener("click", openProjectModal);
    projectCancelBtn.addEventListener("click", closeProjectModal);
}

export { projectModal }