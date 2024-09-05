import { format } from "date-fns";

function noteModal() {
    const noteDialog = document.getElementById("note-dialog");
    const openNoteModal = document.querySelector(".add-note-btn");
    const closeNoteModal = document.querySelector(".close-note-modal-btn");
    const noteText = document.getElementById("note-text");

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
        note.className = "new-note";
        const noteTextContainer = document.createElement("div");
        noteTextContainer.className = "note-text-container";
        noteTextContainer.innerText = this.noteText;

        const noteDate = document.createElement("div");
        noteDate.className = "note-date";
        noteDate.innerText = `Date: ` + this.date;

        const editNoteBtn = document.createElement("button");
        editNoteBtn.innerText = "Edit";
        editNoteBtn.className = "edit-note-btn";
        editNoteBtn.addEventListener("click", editNote);
        editNoteBtn.dataset.id = this.id;
        
        const deleteNoteBtn = document.createElement("button");
        deleteNoteBtn.innerText = "Delete";
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
    const noteForm = document.getElementById("note-modal-content");
    noteForm.addEventListener("submit", onSubmitNoteForm);
}

function onSubmitNoteForm(e) {
    const noteId = parseInt(e.srcElement.dataset.id);
    const noteText = document.getElementById("note-text");
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
    removeNotesFromHtml();
    getNotes().forEach(function(note) {
        addToNoteList(note);
    })
}

function removeNotesFromHtml() {
    const noteList = document.getElementById("all-note-container");
    new DocumentFragment().append(...noteList.querySelectorAll(".new-note"))
}

const deleteConfNoteModal = document.getElementById("delete-conf-note-modal");
const deleteConfNoteText = document.querySelector(".delete-conf-note-text");
const confDeleteNoteBtn = document.querySelector(".conf-delete-note-btn");
const confCancelBtn = document.querySelector(".conf-cancel-note-btn");

function showDeleteConfirm() {
    deleteConfNoteModal.showModal();
    deleteConfNoteText.innerText = "Are you sure you want to delete this note?";
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
    hideDeleteModal();
}

function editNote(e) {
    const noteDialog = document.getElementById("note-dialog");
    noteDialog.showModal();
    let allNotes = getNotes();
    const noteIdToEdit = parseInt(e.srcElement.dataset.id);
    const noteToEdit = allNotes.find(note => {
        return note.id === noteIdToEdit;
    })
    document.getElementById("note-text").innerText = noteToEdit.noteText;
    document.getElementById("note-modal-content").dataset.id = noteToEdit.id;
}

export { noteModal }