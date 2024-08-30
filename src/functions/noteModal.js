import { format } from "date-fns";

function noteModal() {
    let noteDialog = document.getElementById("note-dialog");
    let openNoteModal = document.querySelector(".add-note-btn");
    let closeNoteModal = document.querySelector(".close-note-modal-btn");
    const saveNoteBtn = document.getElementById("save-note-btn");

    document.addEventListener("DOMContentLoaded", loadNotes);
    document.addEventListener("DOMContentLoaded", () => {
        openNoteModal.addEventListener("click", () => {
            noteDialog.showModal();
        });
    })

    closeNoteModal.addEventListener("click", () => {
        noteDialog.close();
    });

    saveNoteBtn.addEventListener("click", function() {
        const noteText = document.getElementById("note-text");
        const note = noteText.value;
        if(note) {
            addNote(note);
            saveNote(note);
            noteDialog.close();
            noteText.value = "";
        }
    });

    function addNote(note) {
        const noteList = document.getElementById("all-note-container");
        const noteTextContainer = document.createElement("div");
        const noteDiv = document.createElement("div");
        noteTextContainer.className = "note-text-container";
        noteDiv.classList.add("new-note");
        noteTextContainer.textContent = note;

        const editNoteBtn = document.createElement("button");
        editNoteBtn.textContent = "Edit";
        editNoteBtn.className = "edit-note-btn";
        const deleteNoteBtn = document.createElement("button");
        deleteNoteBtn.textContent = "Delete";
        deleteNoteBtn.className = "delete-note-btn";
        deleteNoteBtn.addEventListener("click", function(){
            noteList.removeChild(noteDiv);
            deleteNotes(note);
        });

        const noteDate = document.createElement("div");
        noteDate.className = "note-date";
        const dateFormat = format(new Date(), "PPPP");
        noteDate.textContent = `Date: ` + dateFormat;

        noteDiv.appendChild(noteTextContainer);
        noteDiv.appendChild(editNoteBtn);
        noteDiv.appendChild(deleteNoteBtn);
        noteDiv.appendChild(noteDate);
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
                const noteItems = document.querySelectorAll(".new-note");
                noteItems[noteItems.length - 1].style.textDecoration = 
                'line-through'
            }
        }); 
    }

    function deleteNotes(note){
        let notes = JSON.parse(localStorage.getItem('note')) || [];
        notes = notes.filter((noteObj) => noteObj.note !== note);
        localStorage.setItem('note', JSON.stringify(notes));
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
}

export { noteModal }