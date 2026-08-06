import {ProjectColours} from "../data/definitions.js";

const matchDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const projectsPath = "../data/projects_data.json";
const projectsGrid = document.querySelector(".projects-grid");
const projectDialog = document.getElementById("project-dialog");

const experiencesPath = "../data/experience_data.json";
const experiencesContainer = document.querySelector(".experiences-flex");

const dialogElements = {
    image: projectDialog.querySelector('img'),
    title: projectDialog.querySelector('h2'),
    description: projectDialog.querySelector('section > p'),
    skillsContainer: projectDialog.querySelector('.project-skills'),
    sourceLink: projectDialog.querySelector('.project-src-link'),
    liveLink: projectDialog.querySelector('.project-live-link'),
    year: projectDialog.querySelector('.project-year'),
};

const getJsonMetadata = async (path) => {
    const response = await fetch(path);
    return await response.json();
};

async function renderProjects() {
    const projects = await getJsonMetadata(projectsPath);
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

        const projectTypeTag = document.createElement("span");
        projectTypeTag.classList.add("project-type-tag");
        projectTypeTag.textContent = project.type.toUpperCase();
        projectTypeTag.style.backgroundColor = ProjectColours[project.type] || "#ccc";
        cardContainer.appendChild(projectTypeTag);

        cardContainer.append(cardImage, cardTitle);
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
    const { image, title, description, skillsContainer, sourceLink, liveLink, year } = dialogElements;

    image.src = project.imageUrl;
    image.alt = project.name;
    title.textContent = project.name;
    description.textContent = project.description;

    skillsContainer.innerHTML = '';
    project.skills.forEach(skill => {
        const span = document.createElement('span');
        span.textContent = skill;
        skillsContainer.appendChild(span);
    });

    sourceLink.classList.remove('disabled');
    liveLink.classList.remove('disabled');

    if (!project.sourceUrl) {
        sourceLink.textContent = 'private';
        sourceLink.classList.add('disabled');
        sourceLink.removeAttribute('href');
    } else {
        sourceLink.textContent = 'source';
        sourceLink.href = project.sourceUrl;
    }

    if (!project.liveUrl) {
        liveLink.textContent = 'unavailable';
        liveLink.classList.add('disabled');
        liveLink.removeAttribute('href');
    } else {
        liveLink.textContent = 'live';
        liveLink.href = project.liveUrl;
    }

    year.textContent = `- ${project.year} -`;
    projectDialog.showModal();
}

async function renderExperiences() {
    const experiences = await getJsonMetadata(experiencesPath);
    experiencesContainer.innerHTML = "";

    experiences.forEach((experience) => {
        const experienceDiv = document.createElement("div");
        experienceDiv.classList.add("experience");
        experienceDiv.style.backgroundColor = matchDarkMode ? experience.background[1] : experience.background[0];

        const img = document.createElement("img");
        img.src = experience.companyLogo;
        img.alt = `${experience.companyName} logo`;

        const section = document.createElement("section");

        const companyDiv = document.createElement("div");
        companyDiv.classList.add("company");

        const nameContainer = document.createElement("div");
        const name = document.createElement("h2");
        name.classList.add("name");
        name.textContent = experience.companyName;

        const role = document.createElement("p");
        role.classList.add("role-name");
        role.textContent = experience.jobTitle;

        nameContainer.append(name, role);

        const date = document.createElement("p");
        date.classList.add("date");
        date.textContent = experience.date;

        companyDiv.append(nameContainer, date);

        const ul = document.createElement("ul");
        experience.milestones.forEach((milestone) => {
            const li = document.createElement("li");
            li.textContent = milestone;
            ul.appendChild(li);
        });

        section.append(companyDiv, ul);
        experienceDiv.append(img, section);
        experiencesContainer.appendChild(experienceDiv);
    });
}

renderProjects();
renderExperiences();
