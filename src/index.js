import '../src/style.css';

// New note module functionality
const openNotesModal = document.getElementById("new-note-btn");
const modal = document.getElementById("note-modal-overlay");
const closeNotesModal = document.querySelector(".close-modal-btn");

function openModal() {
    modal.classList.remove("note-modal-hide");
}

function closeModal(e, clickedOutside) {
    if (clickedOutside) {
        if (e.target.classList.contains("note-modal-overlay"))
            modal.classList.add("note-modal-hide");
    } else modal.classList.add("note-modal-hide");
}

openNotesModal.addEventListener("click", openModal);
modal.addEventListener("click", (e) => closeModal(e, true));
closeNotesModal.addEventListener("click", closeModal);