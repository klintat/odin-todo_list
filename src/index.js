import '../src/style.css';
import { noteModal } from './functions/noteModal';
import { taskModal } from './functions/taskModal';
import { deleteConfirmModal } from './functions/deleteConfirmModal';

function initialize() {
    deleteConfirmModal()
    noteModal();
    taskModal();
}

document.addEventListener("DOMContentLoaded", initialize);