let states = {
    India: ["Delhi", "Odisha", "Karnataka"],
    USA: ["California", "Texas", "New York"],
    Canada: ["Ontario", "Quebec", "British Columbia"]
};

function loadStates() {
    let country = document.getElementById("country").value;
    let stateDropdown = document.getElementById("state");
    stateDropdown.innerHTML = "<option value=''>State</option>";
    if (states[country]) {
        states[country].forEach(state => {
            let option = document.createElement("option");
            option.value = state;
            option.textContent = state;
            stateDropdown.appendChild(option);
        });
    }
}

function addPhoneField() {
    let phoneNumber = document.getElementById("phnNum");
    let newPhoneRow = document.createElement("div");
    newPhoneRow.className = "d-flex";
    newPhoneRow.innerHTML = `
        <input type="text" maxlength="10" placeholder="" required><i onclick="removePhoneField(this)" class="bi bi-trash3"></i>
    `;
    phoneNumber.appendChild(newPhoneRow);
}

function removePhoneField(button) {
    button.parentNode.remove();
}

document.getElementById('add').addEventListener('click', addPhoneField);

document.getElementById('calendar').addEventListener('click', function() {
    document.getElementById('DOB').focus();
});

function resetForm() {
    document.getElementById('userForm').reset();
    document.getElementById('phnNum').innerHTML = `
        <div class='d-flex'>
            <input type="text" name="phoneNumber" id="phoneNumber" required> <i id="add" class="bi bi-plus-square-fill"></i>
        </div>`;
}

function saveForm() {
    let name = document.getElementById('fullName').value;
    let email = document.getElementById('email').value;
    let DOB = document.getElementById('DOB').value;
    let address = document.getElementById('address').value;
    let country = document.getElementById('country').value;
    let state = document.getElementById('state').value;
    let zip = document.getElementById('zip').value;
    let phoneInputs = document.querySelectorAll('#phnNum input[type="text"]');
    let phoneNumbers = Array.from(phoneInputs).map(input => input.value).filter(val => val);

    let fullnameError = document.getElementById('fullnameError');
    let emailError = document.getElementById('emailError');
    let phoneNumberError = document.getElementById('phoneNumberError');
    let addressError = document.getElementById('addressError');
    let zipError = document.getElementById('zipError');

    let isValid = true;

    let nameRegex = /^[a-zA-Z0-9]{3,64}$/;
    if (!nameRegex.test(name)) {
        isValid = false;
        fullnameError.textContent = 'Full name must be alphanumeric and contain 3 - 64 characters';
    } else {
        fullnameError.textContent = '';
    }

    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        isValid = false;
        emailError.textContent = 'Email must be a valid address, e.g. example@example.com';
    } else {
        emailError.textContent = '';
    } 

    let phoneRegex = /^\d{10}$/;
    if (!phoneNumbers.every(num => phoneRegex.test(num))) {
        isValid = false;
        phoneNumberError.textContent = 'Each phone number must be 10 digits.';
    } else {
        phoneNumberError.textContent = '';
    }

    let addressRegex = /^[\w\s.,'-]+$/;
    if (!addressRegex.test(address)) {
        isValid = false;
        addressError.textContent = 'Address is required.';
    } else {
        addressError.textContent = '';
    }

    let zipRegex = /^\d{6}$/;
    if (!zipRegex.test(zip)) {
        isValid = false;
        zipError.textContent = 'Zip code is required (6 digits).';
    } else {
        zipError.textContent = '';
    }

    if (!isValid) return;

    const userRow = `
        <tr>
            <td><input type="checkbox" id="checkbox"></td>
            <td>${name}</td>
            <td>${email}</td>
            <td>${DOB}</td>
            <td>${phoneNumbers.join(", ")}</td>
            <td>${address}, ${state}, ${country}, ${zip}</td>
            <td>
                <button class="editBtn">EDIT</button>
                <button class="deleteBtn">DELETE</button>
            </td>
        </tr>
    `;
    document.querySelector("#userTable tbody").insertAdjacentHTML("afterbegin", userRow);
    resetForm();
}

window.onload = function() {
    if (localStorage.getItem("userData")) {
        document.querySelector("#userTable tbody").innerHTML = localStorage.getItem("userData");
    }
}

window.onbeforeunload = function() {
    localStorage.setItem("userData", document.querySelector("#userTable tbody").innerHTML);
};
function deleteSelectedRows() {
    let rows = document.querySelectorAll("#userTable tbody tr");
    let deleted = false;

    rows.forEach(row => {
        if (row.querySelector("input[type='checkbox']").checked) {
            row.remove();
            deleted = true;
        }
    });

    if (deleted) {
        localStorage.setItem("userData", document.querySelector("#userTable tbody").innerHTML);
        toastr.success("Selected users deleted successfully");
    } else {
        toastr.warning("No user selected");
    }
}

document.querySelector("#userTable").addEventListener("click", function(event) {
    if (event.target.classList.contains("deleteBtn")) {
        event.target.closest("tr").remove();
        localStorage.setItem("userData", document.querySelector("#userTable tbody").innerHTML);
        toastr.success("User deleted successfully");
    } else if (event.target.classList.contains("editBtn")) {
        const row = event.target.closest("tr");
        editForm(row);
    }
})

let editingRow = null; 

function editForm(row) {
    editingRow = row;
    let cells = row.children;
    document.getElementById("fullName").value = cells[1].innerText;
    document.getElementById("email").value = cells[2].innerText;
    document.getElementById("DOB").value = cells[3].innerText;
    document.getElementById("phoneNumber").value = cells[4].innerText;
    document.getElementById("address").value = cells[5].innerText.split(",")[0].trim();
    document.getElementById("country").value = cells[5].innerText.split(",")[2].trim();
    document.getElementById("state").value = cells[5].innerText.split(",")[1].split("-")[0].trim();
    document.getElementById("zip").value = cells[5].innerText.split(",")[1].split("-")[1].trim();

    document.getElementById("btn2").textContent = "Update";
}

function saveForm() {
    let name = document.getElementById('fullName').value;
    let email = document.getElementById('email').value;
    let DOB = document.getElementById('DOB').value;
    let address = document.getElementById('address').value;
    let country = document.getElementById('country').value;
    let state = document.getElementById('state').value;
    let zip = document.getElementById('zip').value;
    let phoneInputs = document.querySelectorAll('#phnNum input[type="text"]');
    let phoneNumbers = Array.from(phoneInputs).map(input => input.value).filter(val => val);

    let fullnameError = document.getElementById('fullnameError');
    let emailError = document.getElementById('emailError');
    let phoneNumberError = document.getElementById('phoneNumberError');
    let addressError = document.getElementById('addressError');
    let zipError = document.getElementById('zipError');

    let isValid = true;

    let nameRegex = /^[a-zA-Z0-9]{3,64}$/;
    if (!nameRegex.test(name)) {
        isValid = false;
        fullnameError.textContent = 'Full name must be alphanumeric and contain 3 - 64 characters';
    } else {
        fullnameError.textContent = '';
    }

    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        isValid = false;
        emailError.textContent = 'Email must be a valid address, e.g. example@example.com';
    } else {
        emailError.textContent = '';
    } 

    let phoneRegex = /^\d{10}$/;
    if (!phoneNumbers.every(num => phoneRegex.test(num))) {
        isValid = false;
        phoneNumberError.textContent = 'Each phone number must be 10 digits.';
    } else {
        phoneNumberError.textContent = '';
    }

    let addressRegex = /^[\w\s.,'-]+$/;
    if (!addressRegex.test(address)) {
        isValid = false;
        addressError.textContent = 'Address is required.';
    } else {
        addressError.textContent = '';
    }

    let zipRegex = /^\d{6}$/;
    if (!zipRegex.test(zip)) {
        isValid = false;
        zipError.textContent = 'Zip code is required (6 digits).';
    } else {
        zipError.textContent = '';
    }

    if (!isValid) return;

    if (editingRow) {
        editingRow.children[1].innerText = name;
        editingRow.children[2].innerText = email;
        editingRow.children[3].innerText = DOB;
        editingRow.children[4].innerText = phoneNumbers.join(", ");
        editingRow.children[5].innerText = `${address}, ${state}, ${country}, ${zip}`;
        toastr.success("User updated successfully");
        
        editingRow = null;
        document.getElementById("btn2").textContent = "Save";
    } else {
        let userRow = `
            <tr>
                <td><input type="checkbox" id="checkbox"></td>
                <td>${name}</td>
                <td>${email}</td>
                <td>${DOB}</td>
                <td>${phoneNumbers.join(", ")}</td>
                <td>${address}, ${state}, ${country}, ${zip}</td>
                <td>
                    <button class="editBtn">EDIT</button>
                    <button class="deleteBtn">DELETE</button>
                </td>
            </tr>
        `;
        document.querySelector("#userTable tbody").insertAdjacentHTML("afterbegin", userRow);
        toastr.success("User added successfully");
    }
    resetForm();
    localStorage.setItem("userData", document.querySelector("#userTable tbody").innerHTML);
}



let deleted = document.getElementById('deleteSelectedBtn')
deleted.addEventListener('click',deleteSelectedRows)
