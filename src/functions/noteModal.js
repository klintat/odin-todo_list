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
33
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