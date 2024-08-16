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

// To display created user notes
document.addEventListener("DOMContentLoaded", loadNotes);

const saveNoteBtn = document.getElementById("save-note-btn");
saveNoteBtn.addEventListener("click", function() {
    const noteText = document.getElementById("note-text");
    const note = noteText.value;
    if(note) {
        addNote(note);
        saveNote(note);
        noteText.value = "";
    }
});

function addNote(note) {
    const noteList = document.getElementById("all-note-container");
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("new-note");
    noteDiv.textContent = note;

    const deleteNoteBtn = document.createElement("button");
    deleteNoteBtn.textContent = "Delete";
    deleteNoteBtn.addEventListener("click", function(){
        noteList.removeChild(noteDiv);
        deleteNotes(note);
    });

    noteDiv.appendChild(deleteNoteBtn);
    noteList.appendChild(noteDiv);

    noteDiv.addEventListener("click", function() {
        noteDiv.style.textDecoration = noteDiv.style.textDecoration === 
        'line-through' ? 'none' : 'line-through'
        updateNoteStatus(note);
    });
}

function saveNote(note) {
    let notes = JSON.parse(localStorage.getItem("note")) || [];
    notes.push({note, completed: false});
    localStorage.setItem("note", JSON.stringify(notes));
}

function loadNotes() {
    let notes = JSON.parse(localStorage.getItem("note")) || [];
    notes.forEach(function (noteObj) {
        addNote(noteObj.note);
        if(noteObj.completed){
            const noteItems = document.querySelectorAll('li');
            noteItems[noteItems.lenght - 1].style.textDecoration = 
            'line-through'
        }
    }); 
}

function deleteNotes(note){
    let notes = JSON.parse(localStorage.getItem('note')) || [];
    notes = notes.filter((noteObj) => noteObj.note !== note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function updateNoteStatus(note) {
    let notes = JSON.parse(localStorage.getItem('note')) || [];
    notes = notes.map(noteObj => {
        if(noteObj.note === note){
            noteObj.completed = !noteObj.completed;
        }
        return noteObj;
    });
    localStorage.setItem("notes", JSON.stringify(notes));
}