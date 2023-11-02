function validateForm(event) {
    event.preventDefault(); 
  

    var IdInput = document.getElementById("id").value;
    var passwordInput = document.querySelector('input[type="password"]').value;
    var error = document.querySelector('h2');
    error.textContent='';
    if(IdInput.trim()==''){
       error.textContent='Enter a Id';
        return;
    }
    if(passwordInput.trim()==''){
       error.textContent='Password Field Cannot be Empty';
        return;
    }
        var formData = {
        aid: IdInput.trim(),
        password: passwordInput.trim()
      };
  
      fetch('/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (response.ok) {
          document.getElementById("loginpanel").style.visibility = 'hidden';
          const element = document.getElementById('content');
          element.style.visibility = 'visible';
        } else {
            response.json().then(data => {
               error.textContent =  data.error;
              });
        }
      })
      .catch(error => {
        console.error(error);
       error.textContent= 'Error:'+error;
      });
    }
    function addBuilder() {
      const builderName = document.getElementById("builderName").value;
      const builderPassword = document.getElementById("builderPassword").value;
    
      // Check if both fields are not empty
      if (builderName.trim() !== "" && builderPassword.trim() !== "") {
          const builderData = {
              builderName: builderName,
              builderPassword: builderPassword
          };
    
          // Send a POST request to add the builder
          fetch('/addbuilder', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(builderData)
          })
          .then(response => {
              if (response.ok) {
                  // Builder added successfully, now update the table
                  updateBuilderTable();
              } else {
                  // Handle error here
              }
          })
          .catch(error => {
              console.error(error);
          });
      } else {
          // Handle empty fields error
      }
    }


// Add this function to update the builder table
function updateBuilderTable() {
  const builderTable = document.getElementById("BuilderBody");
  
  // Clear the table
  builderTable.innerHTML = '';

  // Fetch the builder data and populate the table
  fetch('/getbuilders')
  .then(response => response.json())
  .then(data => {
      data.forEach(builder => {
          const row = builderTable.insertRow();
          const cell1 = row.insertCell(0);
          const cell2 = row.insertCell(1);
          const cell3 = row.insertCell(2);

          cell1.innerHTML = builder.builderName;
          cell2.innerHTML = builder.builderPassword;

          // Add a delete button to each row
          const deleteButton = document.createElement('button');
          deleteButton.innerText = 'Delete';
          deleteButton.onclick = () => deleteBuilder(builder.builderName); // Pass the builder ID to the delete function
          cell3.appendChild(deleteButton);
      });
  })
  .catch(error => {
      console.error(error);
  });
}

// Modify the deleteBuilder function to accept builderName
function deleteBuilder(builderName) {
  fetch(`/deletebuilder/${builderName}`, {
      method: 'DELETE'
  })
  .then(response => {
      if (response.ok) {
          // Builder deleted successfully, now update the table
          updateBuilderTable();
      } else {
          // Handle error here
      }
  })
  .catch(error => {
      console.error(error);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Add this function to handle adding a builder

// Call this function to update the table when the page loads
updateBuilderTable();
});