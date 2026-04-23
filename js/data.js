// XML Data for Skills
const skillsXMLData = `<?xml version="1.0" encoding="UTF-8"?>
<skills>
    <skill>
        <name>HTML5 &amp; CSS3</name>
        <level>90</level>
        <icon>fab fa-html5</icon>
        <category>frontend</category>
    </skill>
    <skill>
        <name>JavaScript (ES6+)</name>
        <level>85</level>
        <icon>fab fa-js</icon>
        <category>frontend</category>
    </skill>
    <skill>
        <name>React.js</name>
        <level>75</level>
        <icon>fab fa-react</icon>
        <category>frontend</category>
    </skill>
    <skill>
        <name>Node.js</name>
        <level>70</level>
        <icon>fab fa-node-js</icon>
        <category>backend</category>
    </skill>
    <skill>
        <name>Python</name>
        <level>65</level>
        <icon>fab fa-python</icon>
        <category>backend</category>
    </skill>
    <skill>
        <name>Git &amp; GitHub</name>
        <level>80</level>
        <icon>fab fa-git-alt</icon>
        <category>tools</category>
    </skill>
</skills>`;

// JSON Data for Projects
const projectsData = [
    {
        id: 1,
        title: "Advanced Login",
        category: "fullstack",
        description: "A secure login system with form validation, user authentication, and session management. Built with HTML, CSS, JavaScript, and localStorage.",
        image: "assets/project1.jpg",
        tech: ["HTML5", "CSS3", "JavaScript", "localStorage"],
        liveLink: "#",
        githubLink: "#"
    },
    {
        id: 2,
        title: "Story Book",
        category: "frontend",
        description: "Interactive storybook application with dynamic content loading, smooth animations, and responsive design for all devices.",
        image: "assets/project2.jpg",
        tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
        liveLink: "#",
        githubLink: "#"
    },
    {
        id: 3,
        title: "Advanced Portfolio",
        category: "fullstack",
        description: "A comprehensive portfolio website with dashboard layout, project showcase, contact form, and integrated data management using XML and JSON.",
        image: "assets/project3.jpg",
        tech: ["HTML5", "CSS3", "JavaScript", "XML", "JSON"],
        liveLink: "#",
        githubLink: "#"
    }
];

// Function to load skills from XML
function loadSkillsFromXML() {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(skillsXMLData, "text/xml");
    const skills = xmlDoc.getElementsByTagName("skill");
    const skillsContainer = document.getElementById("skillsContainer");
    
    if (!skillsContainer) return;
    
    let html = '';
    
    for (let i = 0; i < skills.length; i++) {
        const name = skills[i].getElementsByTagName("name")[0].textContent;
        const level = skills[i].getElementsByTagName("level")[0].textContent;
        const icon = skills[i].getElementsByTagName("icon")[0].textContent;
        
        html += `
            <div class="skill-card">
                <i class="${icon} skill-icon"></i>
                <div class="skill-name">${name}</div>
                <div class="skill-level">
                    <div class="skill-progress" data-width="${level}"></div>
                </div>
                <div class="skill-percent">${level}%</div>
            </div>
        `;
    }
    
    skillsContainer.innerHTML = html;
    
    // Animate skill bars after they're in the DOM
    setTimeout(() => {
        const skillProgressBars = document.querySelectorAll('.skill-progress');
        skillProgressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
    }, 100);
}

// Function to load projects from JSON
function loadProjectsFromJSON(filter = 'all') {
    const projectsGrid = document.getElementById("projectsGrid");
    if (!projectsGrid) return;
    
    let filteredProjects = projectsData;
    if (filter !== 'all') {
        filteredProjects = projectsData.filter(project => project.category === filter);
    }
    
    let html = '';
    
    filteredProjects.forEach(project => {
        html += `
            <div class="project-card" data-id="${project.id}">
                <img src="${project.image}" alt="${project.title}" class="project-img" onerror="this.src='https://via.placeholder.com/400x200?text=${encodeURIComponent(project.title)}'">
                <div class="project-info">
                    <span class="project-category">${project.category}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p>${project.description.substring(0, 100)}...</p>
                    <div class="project-tech">
                        ${project.tech.map(t => `<small>#${t}</small>`).join(' ')}
                    </div>
                </div>
            </div>
        `;
    });
    
    projectsGrid.innerHTML = html;
    
    // Add click listeners to project cards for modal
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = parseInt(card.getAttribute('data-id'));
            const project = projectsData.find(p => p.id === projectId);
            if (project) {
                showProjectModal(project);
            }
        });
    });
}

// Modal functionality (INTERACTIVE EVENT FEATURE)
function showProjectModal(project) {
    const modal = document.getElementById("projectModal");
    const modalBody = document.getElementById("modalBody");
    
    modalBody.innerHTML = `
        <h2>${project.title}</h2>
        <img src="${project.image}" alt="${project.title}" style="width: 100%; border-radius: 10px; margin: 1rem 0;" onerror="this.src='https://via.placeholder.com/400x200'">
        <p><strong>Description:</strong> ${project.description}</p>
        <p><strong>Technologies:</strong> ${project.tech.join(', ')}</p>
        <p><strong>Category:</strong> ${project.category}</p>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <a href="${project.liveLink}" class="btn-primary" style="font-size: 0.9rem;">Live Demo</a>
            <a href="${project.githubLink}" class="btn-secondary" style="background: #333; color: white;">GitHub</a>
        </div>
    `;
    
    modal.style.display = "block";
    
    // Close modal when clicking X
    const closeBtn = document.querySelector(".close");
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}