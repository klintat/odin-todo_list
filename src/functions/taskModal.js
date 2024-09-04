function taskModal() {
    const taskDialog = document.getElementById("task-dialog");
    const openTaskModal = document.getElementById("add-task-btn");
    const closeTaskModal = document.getElementById("close-task-modal-btn");

    //document.addEventListener("DOMContentLoaded", () => {
        openTaskModal.addEventListener("click", () => {
            taskDialog.showModal();
        });
    //})

    closeTaskModal.addEventListener("click", () => {
        taskDialog.close();
    });
}



export { taskModal }