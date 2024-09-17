import { format } from "date-fns";

const noteDialog = document.getElementById("note-dialog");
const openNoteModal = document.querySelector(".add-note-btn");
const closeNoteModal = document.getElementById("close-note-modal-btn");
const noteText = document.getElementById("note-text");
const noteForm = document.getElementById("note-form");
const noteList = document.getElementById("all-note-container");
const deleteConfNoteModal = document.getElementById("delete-conf-note-modal");
const deleteConfNoteText = document.querySelector(".delete-conf-note-text");
const confDeleteNoteBtn = document.querySelector(".conf-delete-note-btn");
const confCancelBtn = document.querySelector(".conf-cancel-note-btn");

function noteModal() {
    openNoteModal.addEventListener("click", () => {
        noteDialog.showModal();
        noteText.innerText = "";
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
    }

    createNote() {
        const note = document.createElement("div");
        const noteTextContainer = document.createElement("div");
        const noteDate = document.createElement("div");
        const editNoteBtn = document.createElement("button");
        const deleteNoteBtn = document.createElement("button");

        note.className = "new-note";
        noteTextContainer.className = "note-text-container";
        noteDate.className = "note-date";
        editNoteBtn.className = "edit-note-btn";
        editNoteBtn.classList.add("edit-btn", "edit-note-btn");
        deleteNoteBtn.classList.add("delete-btn", "delete-note-btn");

        noteTextContainer.innerText = this.noteText;
        noteDate.innerText = `Date: ` + this.date;
        editNoteBtn.innerText = "Edit";
        deleteNoteBtn.innerText = "Delete";
        
        editNoteBtn.dataset.id = this.id;
        deleteNoteBtn.dataset.id = this.id;

        editNoteBtn.addEventListener("click", editNote);
        deleteNoteBtn.addEventListener("click", showDeleteConfirm);
        
        note.appendChild(noteTextContainer);
        note.appendChild(editNoteBtn);
        note.appendChild(deleteNoteBtn);
        note.appendChild(noteDate);

        return note;
    }
}

function registerNoteSubmitForm() {
    noteForm.addEventListener("submit", onSubmitNoteForm);
}

function onSubmitNoteForm(e) {
    const noteId = parseInt(e.srcElement.dataset.id);
    let note = noteText.value;

    if (noteId) {
        let allNotes = getNotes();
        const noteToEdit = allNotes.find(note => {
            return note.id === noteId;
        })
        noteToEdit.noteText = note;
        setNotes(allNotes);

        delete e.srcElement.dataset.id;

    } else {
        let date = format(new Date(), "PPPP");
            
        let id = getId();

        let newNote = new Note(id, note, date);

        saveNote(newNote);
    }
    loadNotes();

    e.srcElement.reset();
    noteDialog.close();
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
    removeNotesFromHtml();
    getNotes().forEach(function(note) {
        addToNoteList(note);
    })
}

function removeNotesFromHtml() {
    new DocumentFragment().append(...noteList.querySelectorAll(".new-note"))
}

function showDeleteConfirm(e) {
    confDeleteNoteBtn.dataset.id = e.srcElement.dataset.id;
    deleteConfNoteModal.showModal();
    deleteConfNoteText.innerText = "Are you sure you want to delete this note?";
}

function hideDeleteModal() {
    deleteConfNoteModal.close();
}

confDeleteNoteBtn.addEventListener("click", deleteNotes);
confCancelBtn.addEventListener("click", hideDeleteModal);

function deleteNotes(e) {
    const noteIdToRemove = parseInt(e.srcElement.dataset.id);
    const allNotes = getNotes();
    const indexToRemove = allNotes.findIndex(note => {
        return note.id === noteIdToRemove;
    })
    allNotes.splice(indexToRemove, 1);
    setNotes(allNotes);
    loadNotes();
    hideDeleteModal();
}

function editNote(e) {
    noteDialog.showModal();
    let allNotes = getNotes();
    const noteIdToEdit = parseInt(e.srcElement.dataset.id);
    const noteToEdit = allNotes.find(note => {
        return note.id === noteIdToEdit;
    })
    noteText.innerText = noteToEdit.noteText;
    noteForm.dataset.id = noteToEdit.id;
}

export { noteModal }