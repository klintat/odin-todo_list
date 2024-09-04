import '../src/style.css';
import { noteModal, registerNoteSubmitForm, loadNotes } from './functions/noteModal';
import { taskModal, setDateValue, registerSubmitForm, loadTasks } from './functions/taskModal';

function initialize() {
    noteModal();
    taskModal();
    setDateValue();
    registerSubmitForm();
    loadTasks();
    registerNoteSubmitForm();
    loadNotes();
}

document.addEventListener("DOMContentLoaded", initialize);