import '../src/style.css';
import { noteModal } from './functions/noteModal';
import { taskModal } from './functions/taskModal';
import { projectModal } from './functions/projectModal';

function initialize() {
    noteModal();
    taskModal();
    projectModal();
}

document.addEventListener("DOMContentLoaded", initialize);