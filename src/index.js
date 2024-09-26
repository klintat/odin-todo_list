import "../src/style.css";
import { noteModal } from "./functions/noteModule";
import { taskModal } from "./functions/taskModule";
import { projectModal } from "./functions/projectModule";

function initialize() {
  noteModal();
  taskModal();
  projectModal();
}

document.addEventListener("DOMContentLoaded", initialize);
