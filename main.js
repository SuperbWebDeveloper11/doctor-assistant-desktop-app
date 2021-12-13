const electron = require("electron");
const { app, BrowserWindow, ipcMain, Menu } = electron;
let patients = require("./js-files/patients"); // patients list

let mainWindow;
let addPatientWindow;
let patientDetailsWindow;
let deleteConfirmationWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    // change nodeIntegration to true
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/html-files/main-window.html`);
  // quit the app when main window is closed
  mainWindow.on("closed", () => app.quit());
  // build menu from template
  const appMenu = Menu.buildFromTemplate(menuTemplate);
  // set application menu
  Menu.setApplicationMenu(appMenu);
});

function createAddPatientWindow() {
  addPatientWindow = new BrowserWindow({
    width: 600,
    height: 400,
    // change nodeIntegration to true
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  addPatientWindow.loadURL(`file://${__dirname}/html-files/add-patient.html`);
  // clear garbage collection when addPatientWindow is closed
  addPatientWindow.on("closed", () => (addPatientWindow = null));
}

function createPatientDetailsWindow(patientDetails) {
  patientDetailsWindow = new BrowserWindow({
    width: 600,
    height: 400,
    // change nodeIntegration to true
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  patientDetailsWindow.loadURL(
    `file://${__dirname}/html-files/patient-details.html`
  );
  // clear garbage collection when patientDetailsWindow is closed
  patientDetailsWindow.on("closed", () => (patientDetailsWindow = null));
  // send "display:details" along with patient details allow the window to display patient details
  patientDetailsWindow.webContents.send("display:details", patientDetails);
}

function createDeleteConfirmationWindow(patientDetails) {
  deleteConfirmationWindow = new BrowserWindow({
    width: 700,
    height: 500,
    // change nodeIntegration to true
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  deleteConfirmationWindow.loadURL(
    `file://${__dirname}/html-files/delete-confirmation.html`
  );
  // clear garbage collection when deleteConfirmationWindow is closed
  deleteConfirmationWindow.on(
    "closed",
    () => (deleteConfirmationWindow = null)
  );
  // send "display:details" to deleteConfirmationWindow
  deleteConfirmationWindow.webContents.send("display:details", patientDetails);
}

ipcMain.on("demand:patient:refresh", (event) => {
  // sending this event along with patient list allow the main window to display the new patient list
  mainWindow.webContents.send("patient:refresh", patients);
});

ipcMain.on("add:patient", (event, patientInfo) => {
  // add an id to the received patientInfo object
  const newPatient = { ...patientInfo, id: patients.length + 1 };
  // add new instance to the global patient list
  patients.push(newPatient);
  // sending this event along with patient list allow the main window to display the new patient list
  mainWindow.webContents.send("patient:refresh", patients);
  addPatientWindow.close();
});

// listen on "see:details" event and create window to display patients details
ipcMain.on("see:details", (event, patientId) => {
  // find the patient information using patient id
  patients.map((item) => {
    console.log(item);
    if (item.id == patientId) {
      return createPatientDetailsWindow(item);
    }
  });
});

// listen on "delete:confirmation" event and create window to display patients details
ipcMain.on("delete:confirmation", (event, patientId) => {
  // find the patient information using patient id
  let filteredPatients = patients.filter((item) => {
    return item.id != patientId;
  });
  patients = filteredPatients;
  // sending this event along with patient list allow the main window to display the new patient list
  mainWindow.webContents.send("patient:refresh", patients);
  deleteConfirmationWindow.close();
});

// listen on "delete:patient" event and create window to display patients details
ipcMain.on("delete:patient", (event, patientId) => {
  // find the patient information using patient id
  patients.map((item) => {
    console.log(item);
    if (item.id == patientId) {
      return createDeleteConfirmationWindow(item);
    }
  });
});

// declare menu template
const menuTemplate = [
  {
    label: "Manage",
    submenu: [
      {
        label: "Add patient",
        click() {
          createAddPatientWindow();
        },
      },
    ],
  },
];

// add an empty object when app is running on "OS"
if (process.platform === "darwin") {
  menuTemplate.unshift({});
}

// add "Toggle Dev Tools" and "reload" options when app is not running on "production" mode
if (process.env.NODE_ENV != "production") {
  menuTemplate.push({
    label: "View",
    submenu: [
      { role: "reload" },
      {
        label: "Toggle Dev Tools",
        accelerator:
          process.platform == "darwin" ? "Command+I" : "Ctrl+Shift+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
    ],
  });
}
