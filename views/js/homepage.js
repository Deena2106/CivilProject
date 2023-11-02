document.addEventListener('DOMContentLoaded', () => {
  // Function to fetch projects by builder and display them
  const fetchAndDisplayProjects = () => {
    // Send a GET request to fetch projects by builder
    fetch('/builderProjects', {
      method: 'GET',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch projects');
        }
      })
      .then((data) => {
        // Get the projectGrid container
        const projectGrid = document.getElementById('projectGrid');

        // Clear any existing content in the projectGrid
        projectGrid.innerHTML = '';

        // Loop through the projects and create project cards
        data.projects.forEach((project) => {
          const projectCard = document.createElement('div');
          projectCard.classList.add('project-card');

          const projectImage = document.createElement('img');
          projectImage.src= project.projectImage.replace(/[\\/]/g, '/');
          console.log(project.projectImage)
          projectImage.alt = 'Project Image';

          const projectName = document.createElement('h3');
          projectName.textContent = project.projectName;

          // Add an event listener to show project details when clicked
          projectCard.addEventListener('click', () => {
            showProjectDetails(project);
          });

          projectCard.appendChild(projectImage);
          projectCard.appendChild(projectName);
          projectGrid.appendChild(projectCard);
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // Function to display project details in the modal
  const showProjectDetails = (project) => {
    const modal = document.getElementById('projectDetailsModal');
    const title = document.getElementById('projectModalTitle');
    const description = document.getElementById('projectModalDescription');
    const image = document.getElementById('projectModalImage');

    title.textContent = project.projectName;
    description.textContent = `Project ID: ${project.projectID}\nOwner: ${project.ownerName}`;
    image.src = project.projectImage.replace(/[\\/]/g, '/');
    image.style.width = "300px";
    image.style.margin = "20px";

    modal.style.display = 'block';

    // Close the modal when the close button is clicked
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  };

  // Fetch and display projects when the page loads
  fetchAndDisplayProjects();

  // Add event listener to the "Add Project" button to redirect to the add project page
  const addProjectButton = document.getElementById('addProjectButton');
  addProjectButton.addEventListener('click', () => {
    window.location.href = '/add';
  });
});
