function validateForm(event) {
    event.preventDefault(); 
  
    var username = document.querySelector('input[type="text"]').value;
    var email = document.querySelector('input[type="email"]').value;
    var password = document.querySelector('input[type="password"]').value;
    var confirmPassword = document.querySelectorAll('input[type="password"]')[1].value;
    var mobileNumber = document.querySelector('input[type="tel"]').value;
    var errorElement = document.querySelector('h2');
    var usernameRegex = /^[A-Za-z][A-Za-z0-9_]{5,29}$/;
    if (!usernameRegex.test(username)) {
      errorElement.textContent = 'Invalid username';
      return;
    }
  
    var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        errorElement.textContent = 'Invalid email address';
      return;
    }
  
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
    if (!passwordRegex.test(password)) {
      errorElement.textContent = 'Invalid password. Must have: Uppercase, Lowercase, Special Character, Number, 8-30 characters';
  
      return;
    }
  
    if (password !== confirmPassword) {
      errorElement.textContent = 'Passwords do not match';
      return;
    }
  
    var mobileNumberRegex = /^[6-9][0-9]{9}$/;
    if (!mobileNumberRegex.test(mobileNumber)) {
     errorElement.textContent = 'Invalid mobile number';
      return;
    }

    var formData = {
      username: username,
      email: email,
      password: password,
      mobileNumber: mobileNumber
    };
  
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (response.ok) {
          document.location.href = '/';
        } else {
          if(response.status == 400){
            errorElement.textContent = 'Email Already Exists';
          }else{
          errorElement.textContent = 'Error submitting the form';
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
        errorElement.textContent = 'Error submitting the form';
      });
  }
  
function redirectToLogin() {

  window.location.href = '/';
}
