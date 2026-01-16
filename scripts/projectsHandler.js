const projectsPath = "../data/projects_metadata.json";
const projectsGrid = document.querySelector(".projects-grid");

const projectDialog = document.getElementById("project-dialog");
const projectCard = document.querySelector(".project-card");

const getProjectsFromMetadata = async () => {
    const response = await fetch(projectsPath);
    return await response.json();
};

async function renderProjects() {
    const projects = await getProjectsFromMetadata();
    projects.forEach((project) => {
        const cardContainer = document.createElement("div");
        cardContainer.classList.add("project-card");

        const cardImage = document.createElement("img");
        cardImage.src = project.image;
        cardImage.alt = project.name;
        cardImage.classList.add("project-image");

        const cardTitle = document.createElement("h2");
        cardTitle.textContent = project.name;

        const cardAbout = document.createElement("p");
        cardAbout.textContent = project.about;

        cardContainer.append(cardImage, cardTitle, cardAbout);


        projectsGrid.appendChild(cardContainer);
    });
}

renderProjects();
projectDialog.showModal();


