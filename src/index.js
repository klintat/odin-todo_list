import '../src/style.css';
import { noteModal } from './functions/noteModal';
import { taskModal } from './functions/taskModal';

function initialize() {
    noteModal();
    taskModal();
}

document.addEventListener("DOMContentLoaded", initialize);