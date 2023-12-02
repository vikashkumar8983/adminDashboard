
      let users = []; // Array to store users
      let currentUser = [];
      let currentPage = 1;
      const pageSize = 10;

      // Fetch data from the provided endpoint
      fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json",
      )
        .then((response) => response.json())
        .then((data) => {
          users = data;
          currentUser = data;
          renderTable();
          renderPagination();
        });

      function renderTable() {
        const tableBody = document.querySelector("#userTable tbody");
        tableBody.innerHTML = "";

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        for (let i = startIndex; i < endIndex && i < users.length; i++) {
          const user = users[i];
          const row = tableBody.insertRow();

          const checkboxCell = row.insertCell(0);
          const idCell = row.insertCell(1);
          const nameCell = row.insertCell(2);
          const emailCell = row.insertCell(3);
          const roleCell = row.insertCell(4);
          const actionsCell = row.insertCell(5);

          checkboxCell.innerHTML = `<input type="checkbox" onclick="toggleSelect(${i})" ${
            user.selected ? "checked" : ""
          }>`;
          idCell.textContent = user.id;
          nameCell.textContent = user.name;
          emailCell.textContent = user.email;
          roleCell.textContent = user.role;
          actionsCell.innerHTML = `<button class="action-button edit" onclick="editUser(${i})">Edit</button>
                                    <button class="action-button delete" onclick="deleteUser(${i})">Delete</button>`;
        }
      }

      function renderPagination() {
        const totalPages = Math.ceil(users.length / pageSize);
        const paginationContainer = document.querySelector("#pagination");
        paginationContainer.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
          const button = document.createElement("button");
          button.textContent = i;
          button.onclick = () => changePage(i);
          if (i === currentPage) {
            button.classList.add("active");
          }
          paginationContainer.appendChild(button);
        }
      }

      function search() {
        users = currentUser;
        const searchInput = document.getElementById("searchInput");
        const searchTerm = searchInput.value.toLowerCase();

        users.forEach((user) => {
          user.selected = false; // Deselect all users on search
        });

        const filteredUsers = users.filter(
          (user) =>
            user.id.includes(searchTerm) ||
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm),
        );

        currentPage = 1;
        // Reset to first page after search
        users = filteredUsers;
        renderTable();
        renderPagination();
      }

      function changePage(page) {
        currentPage = page;
        renderTable();
        renderPagination();
      }

      function toggleSelect(index) {
        users[index].selected = !users[index].selected;
        renderTable();
      }

      function toggleSelectAll() {
        const selectAllCheckbox = document.getElementById("selectAll");
        const selectAll = selectAllCheckbox.checked;

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        for (let i = startIndex; i < endIndex && i < users.length; i++) {
          users[i].selected = selectAll;
        }

        renderTable();
      }

      function deleteSelected() {
        users = users.filter((user) => !user.selected);
        renderTable();
        renderPagination();
      }

      function editUser(index) {
        const tableBody = document.querySelector("#userTable tbody");
        const row = tableBody.rows[index];
        const cells = row.cells;

        for (let i = 1; i < cells.length - 1; i++) {
          const cell = cells[i];
          const content = cell.textContent;

          // Convert cell content to editable input field
          cell.innerHTML = `<input type="text" value="${content}">`;
        }

        // Replace "Edit" button with "Save" button
        cells[cells.length - 1].innerHTML =
          '<button class="action-button save" onclick="saveUser(' +
          index +
          ')">Save</button>';
      }

      function saveUser(index) {
        const tableBody = document.querySelector("#userTable tbody");
        const row = tableBody.rows[index];
        const cells = row.cells;

        for (let i = 1; i < cells.length - 1; i++) {
          const cell = cells[i];
          const newValue = cell.querySelector("input").value;

          // Update user data with new values
          users[index][cell.getAttribute("data-key")] = newValue;

          // Restore cell to non-editable state
          cell.innerHTML = newValue;
        }

        // Replace "Save" button with "Edit" button
        cells[
          cells.length - 1
        ].innerHTML = `<button class="action-button edit" onclick="editUser(${index})">Edit</button>
                                    <button class="action-button delete" onclick="deleteUser(${index})">Delete</button>`;
      }
      function deleteAll() {
        users = [];
        renderTable();
        renderPagination();
      }
      function deleteUser(index) {
        users.splice(index, 1);
        renderTable();
        renderPagination();
      }
    
