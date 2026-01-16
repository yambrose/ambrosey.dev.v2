const projectsPath = "../data/projects_metadata.json";
const projectsGrid = document.querySelector(".projects-grid");
const projectDialog = document.getElementById("project-dialog");

const getProjectsFromMetadata = async () => {
    const response = await fetch(projectsPath);
    return await response.json();
};

async function renderProjects() {
    const projects = await getProjectsFromMetadata();
    projects.forEach((project, index) => {
        const cardContainer = document.createElement("div");
        cardContainer.classList.add("project-card");
        cardContainer.dataset.index = index;

        const cardImage = document.createElement("img");
        cardImage.src = project.imageUrl;
        cardImage.alt = project.name;
        cardImage.classList.add("project-image");

        const cardTitle = document.createElement("h2");
        cardTitle.textContent = project.name;

        const cardAbout = document.createElement("p");
        cardAbout.textContent = project.about;

        cardContainer.append(cardImage, cardTitle, cardAbout);
        projectsGrid.appendChild(cardContainer);
    });

    // Event delegation for card clicks
    projectsGrid.addEventListener("click", (e) => {
        const card = e.target.closest(".project-card");
        if (card) {
            openProjectDialog(projects[card.dataset.index]);
        }
    });
}

function openProjectDialog(project) {
    projectDialog.querySelector("img").src = project.imageUrl;
    projectDialog.querySelector("img").alt = project.name;
    projectDialog.querySelector("h2").textContent = project.name;
    projectDialog.querySelector("section > p").textContent = project.description;

    const skillsContainer = projectDialog.querySelector(".project-skills");
    skillsContainer.innerHTML = "";
    project.skills.forEach(skill => {
        const span = document.createElement("span");
        span.textContent = skill;
        skillsContainer.appendChild(span);
    });

    const links = projectDialog.querySelectorAll(".project-footer a");
    links[0].href = project.sourceUrl;
    links[1].href = project.liveUrl;

    projectDialog.showModal();
}

renderProjects();
