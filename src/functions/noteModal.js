import { format } from "date-fns";
import { deleteConfirmModal } from "./deleteConfirmModal";

function noteModal() {
    const noteDialog = document.getElementById("note-dialog");
    const openNoteModal = document.querySelector(".add-note-btn");
    const closeNoteModal = document.querySelector(".close-note-modal-btn");

    openNoteModal.addEventListener("click", () => {
        noteDialog.showModal();
    });

    closeNoteModal.addEventListener("click", () => {
        noteDialog.close();
    });

    loadNotes();
    registerNoteSubmitForm();
}

class Note {
    constructor(id, noteText, date) {
        this.id = id;
        this.noteText = noteText;
        this.date = date;
        // this.completed = false;
    }

    createNote() {
        const note = document.createElement("div");
        note.className = "new-note";
        const noteTextContainer = document.createElement("div");
        noteTextContainer.className = "note-text-container";
        noteTextContainer.innerHTML = this.noteText;

        const noteDate = document.createElement("div");
        noteDate.className = "note-date";
        noteDate.textContent = `Date: ` + this.date;

        const editNoteBtn = document.createElement("button");
        editNoteBtn.textContent = "Edit";
        editNoteBtn.className = "edit-note-btn";
        
        const deleteNoteBtn = document.createElement("button");
        deleteNoteBtn.textContent = "Delete";
        deleteNoteBtn.className = "delete-note-btn";
        deleteNoteBtn.addEventListener("click", showDeleteConfirm);
        deleteNoteBtn.dataset.id = this.id;

        note.appendChild(noteTextContainer);
        note.appendChild(editNoteBtn);
        note.appendChild(deleteNoteBtn);
        note.appendChild(noteDate);

        return note;
    }
}

function registerNoteSubmitForm() {
    const resetForm = document.getElementById("note-modal-content");
    resetForm.addEventListener("submit", onSubmitNoteForm);
}

function onSubmitNoteForm(e) {
    const noteText = document.getElementById("note-text");
    let note = noteText.value;
    let date = format(new Date(), "PPPP");
        
    let id = getId();

    let newNote = new Note(id, note, date);

    saveNote(newNote);
    loadNotes();

    e.srcElement.reset();
    document.getElementById("note-dialog").close();
}

function getId() {
    let id;
    do {
       id = Math.floor(Math.random() * 10000);
    } while(isIdNotUnique(id));
    return id;
}

function isIdNotUnique(id) {
    return getNotes().map(note => {
        return note.id;
    }).includes(id);
}

function addToNoteList(newNote) {
    const noteList = document.getElementById("all-note-container");
    noteList.appendChild(newNote.createNote());
}

function saveNote(newNote) {
    let allNotes = getNotes();
    allNotes.push(newNote);
    setNotes(allNotes);
}

function getNotes() {
    return (JSON.parse(localStorage.getItem("note")) || []).map(note => {
        return new Note(note.id, note.noteText, note.date);
    });
}

function setNotes(notes) {
    localStorage.setItem("note", JSON.stringify(notes));
}

function loadNotes() {
    const noteList = document.getElementById("all-note-container");
    noteList.replaceChildren([]);
    getNotes().forEach(function(note) {
        addToNoteList(note);
        // if(note.completed){
        //     const noteItems = document.querySelectorAll(".new-note");
        //     noteItems[noteItems.length - 1].style.textDecoration = 
        //     'line-through'
        // }
    })
}

const deleteConfNoteModal = document.getElementById("delete-conf-note-modal");
const deleteConfNoteText = document.querySelector(".delete-conf-note-text");
const confDeleteNoteBtn = document.querySelector(".conf-delete-note-btn");
const confCancelBtn = document.querySelector(".conf-cancel-note-btn");

function showDeleteConfirm() {
    // deleteConfirmModal();
    deleteConfNoteModal.showModal();
    deleteConfNoteText.textContent = "Are you sure you want to delete this note?";
}

function hideDeleteModal() {
    deleteConfNoteModal.close();
}

confDeleteNoteBtn.addEventListener("click", deleteNotes);
confCancelBtn.addEventListener("click", hideDeleteModal);

function deleteNotes(e) {
    const noteIdToRemove = e.srcElement.dataset.id;
    const allNotes = getNotes();
    const indexToRemove = allNotes.findIndex(note => {
        return note.id === noteIdToRemove;
    })
    allNotes.splice(indexToRemove, 1);
    setNotes(allNotes);
    loadNotes();
    hideDeleteModal()
}


// function defaultNote() {
//     const defaultNote = document.getElementById("default-note");
//     const allNotesList = document.getElementById("all-note-container");
    
//     if(allNotesList.childNodes.lenght > 1) {
//         defaultNote.style.display = none;
//     }
// }

// // defaultNote();

// function updateNoteStatus(note) {
//     let notes = getNotes();
//     notes = notes.map(noteObj => {
//         if(noteObj.note === note){
//              noteObj.completed = !noteObj.completed;
//         }
//         return noteObj;
//     });
//     localStorage.setItem("notes", JSON.stringify(notes));
// }

export { noteModal, deleteNotes }