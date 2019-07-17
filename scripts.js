const app = document.getElementById('root');
var direction = "desc";
var end = Date.now();
var start = end - 900000;//900000

// History pwr.v
var requestv = new XMLHttpRequest();
requestv.open('GET', 'http://localhost:8080/history/pwr.v?start=' + start + '&end=' + end, true);
requestv.onload = function() {
	var data = JSON.parse(this.response);
	if (requestv.status >= 200 && requestv.status < 400) {
		var k = 0;
		data.forEach(dataPoint => {
			const tr = document.createElement('tr');
			const id = document.createElement('td');
			id.textContent = dataPoint.id;
			const timestamp = document.createElement('td');
			timestamp.textContent = new Date(dataPoint.timestamp).toISOString();
			const value = document.createElement('td');
			value.textContent = dataPoint.value;
			app.appendChild(tr);
			tr.setAttribute('class', 'table-warning');
			tr.setAttribute('style', 'display: table-row');
			tr.appendChild(id);
			tr.appendChild(timestamp);
			tr.appendChild(value);
		});
	} else {
		const errorMessage = document.createElement('marquee');
		errorMessage.textContent = `Oh no! panic! it's not working!`;
		app.appendChild(errorMessage);
	}
}
requestv.send();

// History pwr.c
var requestc = new XMLHttpRequest();
requestc.open('GET', 'http://localhost:8080/history/pwr.c?start=' + start + '&end=' + end, true);
requestc.onload = function() {
	var data = JSON.parse(this.response);
	if (requestc.status >= 200 && requestc.status < 400) {
		data.forEach(dataPoint => {
			const tr = document.createElement('tr');
			const id = document.createElement('td');
			id.textContent = dataPoint.id;
			const timestamp = document.createElement('td');
			timestamp.textContent = new Date(dataPoint.timestamp).toISOString();
			const value = document.createElement('td');
			value.textContent = dataPoint.value;
			app.appendChild(tr);
			tr.setAttribute('class', 'table-info');
			tr.setAttribute('style', 'display: table-row');
			tr.appendChild(id);
			tr.appendChild(timestamp);
			tr.appendChild(value);
			sortTable("desc");
		});
	} else {
		const errorMessage = document.createElement('marquee');
		errorMessage.textContent = `Oh no! panic! it's not working!`;
		app.appendChild(errorMessage);
	}
}
requestc.send();

// Websocket
let ws = new WebSocket('ws://localhost:8080/realtime');
ws.onopen = function() {
	ws.send("subscribe pwr.v");
	ws.send("subscribe pwr.c");
}
ws.onclose = function(event) {
	alert('Oh no! panic! the websocket was closed. Error Code: ' + event.code);
}
ws.onmessage = function(msg) {
	const tr = document.createElement('tr');
	const id = document.createElement('td');
	id.textContent = JSON.parse(msg.data).id;
	const timestamp = document.createElement('td');
	timestamp.textContent = new Date(JSON.parse(msg.data).timestamp).toISOString();
	const value = document.createElement('td');
	value.textContent = JSON.parse(msg.data).value;
	if (direction == "asc") app.prepend(tr);
	else if (direction == "desc") app.appendChild(tr);
	var dataPoint = id.textContent;
	if (dataPoint === "pwr.c") tr.setAttribute('class', 'table-info');
	if (dataPoint === "pwr.v") tr.setAttribute('class', 'table-warning');
	if ((!document.getElementById('c').checked) && (id.textContent === "pwr.c")) tr.setAttribute('style', 'display: none');
	if ((!document.getElementById('v').checked) && (id.textContent === "pwr.v")) tr.setAttribute('style', 'display: none');
	tr.appendChild(id);
	tr.appendChild(timestamp);
	tr.appendChild(value);
}


// Display/hide pwr.c
function displayC() {
	var table = document.getElementById("root");
	for (var i = 0, row; row = table.rows[i]; i++) {
		if ((!document.getElementById('c').checked) && (row.cells[0].outerText === "pwr.c")) {
			row.style.display = "none";
		}
		if ((document.getElementById('c').checked) && (row.cells[0].outerText === "pwr.c")) {
			row.style.display = "table-row";
		}
	}
}

// Display/hide pwr.c
function displayV() {
	var table = document.getElementById("root");
	for (var i = 0, row; row = table.rows[i]; i++) {
		if ((!document.getElementById('v').checked) && (row.cells[0].outerText === "pwr.v")) {
			row.style.display = "none";
		}
		if ((document.getElementById('v').checked) && (row.cells[0].outerText === "pwr.v")) {
			row.style.display = "table-row";
		}
	}
}

// SortTable
function sortTable(dir) {
	var table, rows, switching, i, x, y, shouldSwitch;
	table = document.getElementById("root");
	switching = true;
	while (switching) {
		switching = false;
		rows = table.rows;
		for (i = 0; i < (rows.length - 1); i++) {
			shouldSwitch = false;
			x = rows[i].getElementsByTagName("TD")[1];
			y = rows[i + 1].getElementsByTagName("TD")[1];
			if (dir == "desc") {
				if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
					shouldSwitch = true;
					break;
				}
			} else if (dir == "asc") {
				if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
					shouldSwitch = true;
					break;
				}
			}
		}
		if (shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
		}
	}
}

// Update sorting direction
function updateDir() {
	var v = document.getElementById('order');
	if (direction === "desc") {
		v.textContent = "Timestamp ↑";
		sortTable("asc");
		direction = "asc";
	} else if (direction === "asc") {
		v.textContent = "Timestamp ↓";
		sortTable("desc");
		direction = "desc";
	}
}