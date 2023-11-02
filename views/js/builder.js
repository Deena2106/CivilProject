function validateForm(event) {
    event.preventDefault(); 
  

    var emailInput = document.getElementById("name").value;
    var passwordInput = document.querySelector('input[type="password"]').value;
    var error = document.querySelector('h2');
    error.textContent='';
    if(emailInput.trim()==''){
       error.textContent='Enter a Valid Email Address';
        return;
    }
    if(passwordInput.trim()==''){
       error.textContent='Password Field Cannot be Empty';
        return;
    }
        var formData = {
        email: emailInput.trim(),
        password: passwordInput.trim()
      };
  
      fetch('/builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (response.ok) {
          window.location.href='/home';
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