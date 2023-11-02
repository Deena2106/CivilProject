document.getElementById('projectForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting normally
    
    // Create a FormData object to collect form data
    const formData = new FormData(this);

    // Send a POST request to the '/addproject' endpoint
    fetch('/addproject', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // Handle success
            alert('Project data sent successfully');
            window.location.href='/home'
            // You can optionally redirect to a success page here
        } else {
            // Handle error
            console.error('Error sending project data');
            // You can display an error message to the user here
        }
    })
    .catch(error => {
        // Handle network or other errors
        console.error('Error:', error);
    });
});