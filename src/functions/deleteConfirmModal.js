import { deleteNotes } from "../functions/noteModal";

function deleteConfirmModal() {
    const confirmDeleteModal = document.createElement("dialog");
    const confirmDeleteText = document.createElement("div");
    const confirmDeleteBtn = document.createElement("button");
    const confirmCancelBtn = document.createElement("button");

    confirmDeleteModal.id = "delete-conf-modal";
    confirmDeleteText.className = "delete-conf-text";

    confirmDeleteBtn.textContent = "Delete";
    confirmDeleteBtn.className = "conf-delete-btn"

    confirmCancelBtn.textContent = "Cancel";
    confirmCancelBtn.className = "conf-cancel-btn";

    document.body.appendChild(confirmDeleteModal);
    confirmDeleteModal.appendChild(confirmDeleteText);
    confirmDeleteModal.appendChild(confirmDeleteBtn);
    confirmDeleteModal.appendChild(confirmCancelBtn);

    function showDeleteConfirmModal() {
        confirmDeleteModal.showModal();
        confirmDeleteText.textContent = "Are you sure you want to delete this note?";
    }

    function hideDeleteModal() {
        confirmDeleteModal.close();
    }

    confirmDeleteBtn.addEventListener("click", deleteNotes);
    confirmCancelBtn.addEventListener("click", hideDeleteModal);

    showDeleteConfirmModal();
    hideDeleteModal();
}

export { deleteConfirmModal }