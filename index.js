if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        // Fetch data from the server and load the table
        fetch("http://localhost:5000/getAll")
            .then(response => response.json())
            .then(data => loadHTMLTable(data['data']));
    });

    document.querySelector('table tbody').addEventListener('click', function (event) {
        if (event.target.className === "delete-row-btn") {
            deleteRowById(event.target.dataset.id);
        }
        if (event.target.className === "edit-row-btn") {
            handleEditRow(event.target.dataset.id);
        }
    });

    const updateBtn = document.querySelector('#update-row-btn');
    const searchBtn = document.querySelector('#search-btn');
    const addBtn = document.querySelector('#add-btn');

    searchBtn.onclick = function () {
        const searchValue = document.querySelector('#searchBox').value;
        const searchColumn = document.getElementById('searchSelect').value;

        fetch(`http://localhost:5000/search/${searchColumn}/${searchValue}`)
            .then(response => response.json())
            .then(data => loadHTMLTable(data['data']))
            .catch(error => console.error(error));
    };

    updateBtn.onclick = function () {
        const updateDataInput = document.querySelector('#update-data-input');
        const updateDataCategory = document.getElementById('UpdateSelect').value;
        const id = updateDataInput.dataset.id;

        fetch('http://localhost:5000/update', {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                category: updateDataCategory,
                name: updateDataInput.value
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            })
            .catch(error => console.error(error));
    };

    addBtn.onclick = function () {
        const inputbox = document.querySelector('#inputBox');
        const input = inputbox.value;
        inputbox.value = "";

        fetch('http://localhost:5000/insert', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ input: input })
        })
            .then(response => response.json())
            .then(data => insertRowIntoTable(data['data']))
            .catch(error => console.error(error));
    };

    function deleteRowById(id) {
        fetch(`http://localhost:5000/delete/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            })
            .catch(error => console.error(error));
    }

    function handleEditRow(id) {
        const updateSection = document.querySelector('#update-row');
        updateSection.hidden = false;
        document.querySelector('#update-name-input').dataset.id = id;
    }

    function insertRowIntoTable(data) {
        const table = document.querySelector('table tbody');
        const isTableData = table.querySelector('.no-data');

        let tableHtml = "<tr>";

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                tableHtml += `<td>${data[key]}</td>`;
            }
        }

        tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
        tableHtml += "</tr>";

        table.innerHTML = tableHtml;
    }

    function loadHTMLTable(data) {
        const table = document.querySelector('table tbody');
        if (data.length === 0) {
            table.innerHTML = "<tr><td class='no-data' colspan='6'>No Data</td></tr>";
            return;
        }

        let tableHtml = "";

        data.forEach(function ({ resident_id, resident_name, type_id, district_id }) {
            tableHtml += "<tr>";
            tableHtml += `<td>${resident_id}</td>`;
            tableHtml += `<td>${resident_name}</td>`;
            tableHtml += `<td>${type_id}</td>`;
            tableHtml += `<td>${district_id}</td>`;
            tableHtml += `<td><button class="edit-row-btn" data-id=${resident_id}>Edit</td>`;
            tableHtml += `<td><button class="delete-row-btn" data-id=${resident_id}>Delete</td>`;
            tableHtml += "</tr>";
        });

        table.innerHTML = tableHtml;
    }
}
