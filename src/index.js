import '../src/style.css';
import { noteModal } from './functions/noteModal';
import { taskModal } from './functions/taskModal';

function setDateValue() {
	const dateInput = document.getElementById("task-date");
	const today = new Date().toISOString().split("T")[0];
	dateInput.setAttribute("min", today);
    dateInput.setAttribute("value", today);
}

noteModal();
taskModal();
setDateValue();