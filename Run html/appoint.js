var currentCell;
var durationHour;
var currentEditLeft;
var currentEditTop;
var currentEditWidth;
var currentEditHeight;
var normal = true;

function expandTables() {
	var hoursTable = document.getElementById("hours");
	var monday = document.getElementById("monday");
	var tuesday = document.getElementById("tuesday");
	expandHours(hoursTable);
	expandTable(monday);
	expandTable(tuesday);
	expandTable(wednesday);
	expandTable(thursday);
	expandTable(friday);
	expandTable(saturday);
	expandTable(sunday);
}

function expandHours(hoursTable) {
	createHeading(hoursTable);
	createHours(hoursTable);
}

function createHeading(table) {
	var row = document.createElement('tr');
	table.appendChild(row);
	var heading = document.createElement('th');
	row.appendChild(heading);
	// heading.style.border = "1px solid black";
	heading.innerHTML = table.id;
}

function createHours(table) {
	for (var i = 0; i < 24; i++) {
		var row = document.createElement('tr');
		table.appendChild(row);
		var cell = row.insertCell();
		cell.style.border = "1px solid black";
		cell.innerHTML = i + ":00";
	}
}

function expandTable(table) {
	createHeading(table);
	for (var i = 0; i < 24; i++) {
		var row = document.createElement("tr");
		table.appendChild(row);
		var cell = document.createElement("td");
		row.appendChild(cell);
		cell.className = i;
		cell.addEventListener("click", displayForm);
		cell.style.border = "1px solid black";
		cell.rowspan = "2";
		var div = document.createElement("div");
		cell.appendChild(div);
		div.style.height = "24px";
		div.style.width = window.innerWidth / 8 + "px";
		div.style.overflow = "auto";
		div.appendChild(document.createElement("br"));

	}
}

function displayForm() {
	document.getElementById("coverDiv").style.visibility = "visible";
	var formDiv = document.getElementById("formDiv");
	formDiv.style.visibility = "visible";
	currentCell = this;
	var box = document.getElementById("details");
	box.cols = (window.innerWidth * 0.8) / 13;
	var startTime = document.getElementById("startTime");
	var endTime = document.getElementById("endTime");
	document.getElementById("duration").value = "01:00";
	var startHour = currentCell.className;
	var endHour = parseInt(currentCell.className) + 1;

	if (startHour < 9) {
		startTime.value = "0" + startHour + ":00";
		endTime.value = "0" + endHour + ":00";
	} else if (startHour == 9) {
		startTime.value = "0" + startHour + ":00";
		endTime.value = endHour + ":00";
	} else {
		startTime.value = startHour + ":00";
		endTime.value = endHour + ":00";
	}

}

function putDataIn(form) {
	var details = form.details.value;
	var startTime = document.getElementById("startTime").value;
	var endTime = document.getElementById("endTime").value;

	var duration = document.getElementById("duration").value;
	var split = duration.split(":");
	durationHour = parseInt(duration);
	durationMinutes = parseInt(split[1]);
	("0" + durationHour).slice(-2);

	if (durationInHours() > 8) {
		durationerror.innerText = " Duration must be 8 hours or less. ";
		return;
	}

	if (endTime < startTime) {
		durationerror.innerText = " Appointment has to finish on the same day and can last at most 8 hours. ";
	
		return;
	}

	var appointment = document.createElement("div");
	var appointments = document.getElementById("appointments");
	appointments.appendChild(appointment);
	appointment.className = "appointment";
	
	appointment.addEventListener('mouseover', mouseEnter(displayImages), true);
	appointment.addEventListener('mouseout', mouseEnter(removeImages), true);
	if (normal === true) {

		appointment.style.left = currentCell.getBoundingClientRect().left + "px";
		appointment.style.top = currentCell.getBoundingClientRect().top + "px";
		appointment.style.width = (currentCell.getBoundingClientRect().right - currentCell.getBoundingClientRect().left) + "px";
		appointment.style.height = ((currentCell.getBoundingClientRect().bottom - currentCell.getBoundingClientRect().top) * durationInHours()) + "px";

	} else {
		appointment.style.left = currentEditLeft;
		appointment.style.top = currentEditTop;
		appointment.style.width = currentEditWidth;
		appointment.style.height = currentEditHeight;
		normal = true;
	}
	appointment.setAttribute("data-startTime", startTime);
	appointment.setAttribute("data-endTime", endTime);
	appointment.setAttribute("data-details", details);
	appointment.innerHTML = appointment.getAttribute("data-startTime") + " - " + appointment.getAttribute("data-endTime") + " " + appointment.getAttribute("data-details");
	// appointment.innerHTML = "aaa";
	appointment.style.background = colour.value;

	var rect2;
	rect2 = appointment.getBoundingClientRect();
	// alert("updated appoi " + rect2.left + " " + rect2.right);
	// alert(appointment.innerHTML);
	if (inputIsOk(form)) {
		// alert(currentCell.getBoundingClientRect().top);
		document.getElementById("formDiv").style.visibility = "hidden";
		document.getElementById("coverDiv").style.visibility = "hidden";
		durationerror.innerText = "";
		errorText.innerText = "";
		form.details.value = "";
	} else {
		appointments.removeChild(appointment);
	}

}

function durationInHours() {
	var startTime = document.getElementById("startTime").value;
	var endTime = document.getElementById("endTime").value;
	var duration = document.getElementById("duration").value;
	var endSplit = endTime.split(":");
	var startSplit = startTime.split(":");
	durationHour = parseInt(endTime) - parseInt(startTime);
	durationMinutes = parseInt(endSplit[1]) - parseInt(startSplit[1]);
	return durationHour + (durationMinutes / 60);
}

function inputIsOk(form) {
	var details = form.details.value;
	var startTime = document.getElementById("startTime").value;
	var endTime = document.getElementById("endTime").value;
	var duration = document.getElementById("duration").value;
	var errorText = document.getElementById("errorText");
	if (details == "") {
		errorText.innerText = "Must enter details. ";
	}
	if (duration == "") {
		durationerror.innerText = " Must enter duration. ";
	}
	if (endTime == "") {
		durationerror.innerText = " Must enter duration. ";
	}
	return details != "" && startTime != "" && endTime != "" && noOverlap();

}

function noOverlap() {
	var duration = document.getElementById("duration").value;
	durationHour = parseInt(duration);
	var errorText = document.getElementById("errorText");
	var appointments = document.getElementById("appointments");
	var rect1 = appointments.lastChild.getBoundingClientRect();
	var rect2;
	rect2 = appointments.children[0].getBoundingClientRect();
	
	for (var i = 0; i < appointments.children.length - 1; i++) {

		rect2 = appointments.children[i].getBoundingClientRect();

	
		if (rectangleOverlap(rect1, rect2)) {
			errorText.innerText = "This appointment coincides with another appointment. ";
			return false;
		}
	};
	return true;
}

function rectangleOverlap(rect1, rect2) {
	var overlap = !(rect1.right <= rect2.left || rect1.left >= rect2.right || rect1.bottom <= rect2.top || rect1.top >= rect2.bottom);
	
	return overlap;
}

function closeForm(form) {
	document.getElementById("coverDiv").style.visibility = "hidden";
	document.getElementById("formDiv").style.visibility = "hidden";
	durationerror.innerText = "";
	errorText.innerText = "";
	form.details.value = "";
}

function displayImages() {

	this.innerHTML = this.getAttribute("data-startTime") + " - " + this.getAttribute("data-endTime") + " " + this.getAttribute("data-details") + '<span class="pencil_icon" id="edit" onclick="editAppointment(this.parentNode)"></span> <span class="x_icon" id="close" onclick="removeAppointment(this.parentNode)"></span>';
}

function removeImages() {
	this.innerHTML = this.getAttribute("data-startTime") + " - " + this.getAttribute("data-endTime") + " " + this.getAttribute("data-details");
}

function mouseEnter(_fn) {
	return function(_evt) {
		var relTarget = _evt.relatedTarget;
		if (this === relTarget || isAChildOf(this, relTarget)) {
			return;
		}

		_fn.call(this, _evt);
	};
}

function isAChildOf(_parent, _child) {
	if (_parent === _child) {
		return false;
	}
	while (_child && _child !== _parent) {
		_child = _child.parentNode;
	}

	return _child === _parent;
}

function editAppointment(appointment) {
	currentCell = appointment;

	currentEditLeft = currentCell.getBoundingClientRect().left + "px";
	currentEditTop = currentCell.getBoundingClientRect().top + "px";
	currentEditWidth = (currentCell.getBoundingClientRect().right - currentCell.getBoundingClientRect().left) + "px";
	currentEditHeight = ((currentCell.getBoundingClientRect().bottom - currentCell.getBoundingClientRect().top) * durationInHours()) + "px";

	var appointments = document.getElementById("appointments");
	appointments.removeChild(appointment);
	var box = document.getElementById("details");
	box.cols = (window.innerWidth * 0.8) / 13;
	var startTime = document.getElementById("startTime");
	var endTime = document.getElementById("endTime");
	startTime.value = appointment.getAttribute("data-startTime");

	endTime.value = appointment.getAttribute("data-endTime");
	box.value = appointment.getAttribute("data-details");

	document.getElementById("coverDiv").style.visibility = "visible";
	var formDiv = document.getElementById("formDiv");
	formDiv.style.visibility = "visible";

	var rect2 = appointments.children[0].getBoundingClientRect();
	normal = false;

	
}

function removeAppointment(appointment) {
	appointment.parentNode.removeChild(appointment);
}

function test() {
	alert("here");
}

function empty() {

}

function createOutsideTable() {
	var main = document.getElementById("main");
	var table = document.createElement("table");
	main.appendChild(table);
	table.style.width = '100%';
	table.style.border = "1px solid black";
	var row = document.createElement("tr");
	table.appendChild(row);
	var cell = document.createElement("td");
	row.appendChild(cell);
	createHoursTable(cell);
	for (var i = 0; i < 7; i++) {

	}

	// cell.innerHTML = "aaimg";
	var tuesday = document.getElementById("tuesday");
	td.innerHTML = "aaa";
	tuesday.appendChild(tbl);
}

function tableCreate() {
	var main = document.getElementById("main");
	var tbl = document.createElement('table');
	tbl.style.width = '100%';
	tbl.style.border = "1px solid black";

	var tr = tbl.insertRow();
	main.appendChild(tbl);
	for (var i = 0; i < 7; i++) {

		var td;
		tr.appendChild(td);
		td.innerHTML = "bbb";
	}

}

function createDayTable() {


	for ( j = 0; j < 24; j++) {
		var row = document.createElement('tr');
		innerTable.appendChild(row);
		var cell = row.insertCell();
		cell.style.border = "1px solid black";
		cell.innerHTML = "aaa";
	}
	td.appendChild(innerTable);
}

