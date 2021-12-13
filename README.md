## `Doctor Assistant desktop app with Electron`

Doctor Assistant is a desktop application built using Electron to allow a doctor to manage his patients and patient records

### `Here how the doctor will use the app`

clicks on Manage>add patient then fills the form with patient information

![Screenshot](https://github.com/pedrasfloki/doctor-assistant-desktop-app/blob/main/screenshots/02.png)

Main window will display patient list with the option to filter patients by First name, Last name gender or disease description

![Screenshot](https://github.com/pedrasfloki/doctor-assistant-desktop-app/blob/main/screenshots/03.png)

When he clicks on details button a window will be displayed to show patient details

![Screenshot](https://github.com/pedrasfloki/doctor-assistant-desktop-app/blob/main/screenshots/04.png)

When he clicks on delete button a confirmation window will be displayed to confirm patient deletion

![Screenshot](https://github.com/pedrasfloki/doctor-assistant-desktop-app/blob/main/screenshots/05.png)

### `Dependencies`

- **Electron:** framework for creating native applications with web technologies
- **vanilla JavaScript:** for the server-side
- **pure css:** for the design

### `Application workflow`

`Add a new patient workflow`

- The user click on **Add patient** from the menu
- An **addPatientWindow** will be created and show to the user
- The user fill first name, last name, gender and description
- When submitting the form the **addPatientWindow** will emit an event called **add:patient** along with **patientInfo** object which contain (firstname, lastname, gender, description)
- The electron app will listen on **add:patient** event and create new patient instance using the **patientInfo** sent
- After creating the new instance the electron app will send an event **patient:added** along with **patients** list to the **mainWindow**
- The **mainWindow** will listen on **patient:added** and loop throw **patients** list to create table rows for each patient
- **Note:** When looping throw patients list an attribute called **data-id** will be added to both **see-details** and **delete** html elements (to use it to (see patient details) and (delete patient) )

`See patient details workflow`

- The user clicks on **see details** button
- The **mainWindow** emit an event called **see:details** along with patient **id**
- Electron app will listen to **see:details**, take the patient **id**, find the patient info using that id and create **patientDetailsWindow** to display patient details

`Delete patient workflow`

- The user clicks on **delete** button
- The **mainWindow** emit an event called **delete:patient** along with patient **id**
- Electron app will listen to **delete:patient** event, take the patient **id**, find the patient info using that id and create **deleteConfirmationWindow** to display patient details and confirmation message
- When the user clicks on **Yes delete it** the **deleteConfirmationWindow** will send an event called **delete:confirmation** along with patient **id**
- Again Electron app will listen to **delete:confirmation**, take the patient **id**, find the patient instance, delete it, send **patient:deleted** event to the **mainWindow** along with patients list
- The **mainWindow** will listen on **patient:deleted** and loop throw **patients** list to create table rows for each patient
