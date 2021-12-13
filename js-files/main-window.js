const electron = require("electron");
const { ipcRenderer } = electron;
// get a reference to some html elements
const patientsTableBody = document.querySelector("table#patients-table tbody");
const filterByFirstname = document.querySelector(
  "div#filter input#by-firstname"
);
const filterByLastname = document.querySelector("div#filter input#by-lastname");
const filterByGender = document.querySelector("div#filter select#by-gender");
const filterByDescription = document.querySelector(
  "div#filter input#by-description"
);

function createTableRows(patients) {
  /**
   * This function loop throw the given patients list a create a table row with :
   * first name, last name, gender, see-details and delete columns + a hidden input to hold description
   */
  patientsTableBody.innerHTML = "";
  patients.map((patient) => {
    // create a table row
    const tr = document.createElement("tr");

    // create "first name", "last name", "gender", "see-details" and "delete" columns

    // create "first name" column
    let fn = document.createElement("td");
    fn.classList.add("firstname");
    fn.innerHTML = patient["firstname"];
    // create "last name" column
    let ln = document.createElement("td");
    ln.classList.add("lastname");
    ln.innerHTML = patient["lastname"];
    // create "gender" column
    let g = document.createElement("td");
    g.classList.add("gender");
    g.innerHTML = patient["gender"];
    // create "see-details" column
    let d = document.createElement("td");
    let btn = document.createElement("button");
    btn.textContent = "details";
    btn.classList.add("see-details");
    btn.setAttribute("data-id", patient.id);
    d.appendChild(btn);
    // create "delete" column
    let x = document.createElement("td");
    let xbtn = document.createElement("button");
    xbtn.textContent = "X";
    xbtn.classList.add("delete-patient");
    xbtn.setAttribute("data-id", patient.id);
    x.appendChild(xbtn);

    // creating a hidden input to hold description is useful for filtering patients by description
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.classList.add("description");
    hiddenInput.value = patient.description;

    // append columns to row
    tr.appendChild(fn);
    tr.appendChild(ln);
    tr.appendChild(g);
    tr.appendChild(d);
    tr.appendChild(x);
    tr.appendChild(hiddenInput);

    // append the row to the table
    patientsTableBody.appendChild(tr);
  });
}

function filterPatientsByFirstname(event) {
  /**
   * This function loop throw all first names in the table rows by "first name"
   */
  const fnames = document.querySelectorAll(
    "table#patients-table tbody tr td.firstname"
  );
  const text = event.target.value.toLowerCase();
  Array.from(fnames).map((item) => {
    const fn = item.textContent.toLowerCase();
    if (fn.indexOf(text) === -1 && text != "") {
      item.parentElement.style.display = "none";
    } else {
      item.parentElement.style.display = "table-row";
    }
  });
}

function filterPatientsByLastname(event) {
  /**
   * This function loop throw all last names in the table rows by "last name"
   */
  const lnames = document.querySelectorAll(
    "table#patients-table tbody tr td.lastname"
  );
  const text = event.target.value.toLowerCase();
  Array.from(lnames).map((item) => {
    const ln = item.textContent.toLowerCase();
    if (ln.indexOf(text) === -1 && text != "") {
      item.parentElement.style.display = "none";
    } else {
      item.parentElement.style.display = "table-row";
    }
  });
}

function filterPatientsByGender(event) {
  /**
   * This function loop throw all genders in the table rows by "gender"
   */
  const genders = document.querySelectorAll(
    "table#patients-table tbody tr td.gender"
  );
  const text = event.target.value.toLowerCase();
  console.log(text);
  Array.from(genders).map((item) => {
    const g = item.textContent.toLowerCase();
    if (g !== text && text != "") {
      item.parentElement.style.display = "none";
    } else {
      item.parentElement.style.display = "table-row";
    }
  });
}

function filterPatientsByDescription(event) {
  /**
   * This function loop throw all description in the table rows by "description"
   */
  const descriptions = document.querySelectorAll(
    "table#patients-table tbody tr input.description"
  );
  const text = event.target.value.toLowerCase();
  Array.from(descriptions).map((item) => {
    const des = item.value.toLowerCase();
    if (des.indexOf(text) === -1 && text != "") {
      item.parentElement.style.display = "none";
    } else {
      item.parentElement.style.display = "table-row";
    }
  });
}

//
function sendPatientId(event) {
  /**
   * this method will be used to send an event for both (see-details & delete patient) operations
   */
  if (event.target.getAttribute("class") == "see-details") {
    // send "see:details" event along with the patient "id"
    const patientId = event.target.getAttribute("data-id");
    ipcRenderer.send("see:details", patientId);
  }
  if (event.target.getAttribute("class") == "delete-patient") {
    // send "delete:patient" event along with the patient "id"
    const patientId = event.target.getAttribute("data-id");
    ipcRenderer.send("delete:patient", patientId);
  }
}

ipcRenderer.on("patient:refresh", (event, patients) => {
  /**
   * loop throw patients list and create table columns for each instance
   */
  createTableRows(patients);
});

// the first time the file is loaded we emit "demand:patient:refresh" event to receive "patient:refresh" event
ipcRenderer.send("demand:patient:refresh");

// this event handler is used to display patient details
patientsTableBody.addEventListener("click", sendPatientId);

// filter patients by first name
filterByFirstname.addEventListener("keyup", filterPatientsByFirstname);

// filter patients by last name
filterByLastname.addEventListener("keyup", filterPatientsByLastname);

// filter patients by gender
filterByGender.addEventListener("change", filterPatientsByGender);

// filter patients by description
filterByDescription.addEventListener("keyup", filterPatientsByDescription);
