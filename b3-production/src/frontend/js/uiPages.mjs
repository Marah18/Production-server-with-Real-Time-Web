export const loadHomePage = (mainContent) => {
    mainContent.innerHTML = `
        <section class="home">
            <h1>Welcome to Project Tracker</h1>
            <p>For tracking and managing projects.</p>
        </section>
    `;
};

export const loadProjectsPage = async (mainContent) => {
    try {
        const response = await fetch('/projects');
        const data = await response.json();
        const projects = data.projects;

        if (!Array.isArray(projects)) {
            throw new Error('Unexpected format: projects is not an array');
        }

        mainContent.innerHTML = `
            <section class="projects">
                <h1>Your Projects</h1>
                ${projects.map(project => `
                    <div class="project-card">
                        <h2>${project.name}</h2>
                        <p>${project.description || 'No description available'}</p>
                        <button data-project-id="${project.id}">View Details</button>
                    </div>
                `).join('')}
            </section>
        `;

        const buttons = document.querySelectorAll('.project-card button');
        buttons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const projectId = e.target.getAttribute('data-project-id');
                await loadIssuesPage(projectId, mainContent);
            });
        });

    } catch (error) {
        console.error('Error loading projects:', error.message);
        mainContent.innerHTML = `
            <section class="error">
                <h1>Error</h1>
                <p>Failed to load projects. Please try again later.</p>
            </section>
        `;
    }
};

export const loadMaintainerPage = async (mainContent) => {
    try {
        const response = await fetch('/maintainer');
        const data = await response.json();
        const projects = data.projects;

        if (!Array.isArray(projects)) {
            throw new Error('Unexpected format: projects is not an array');
        }

        mainContent.innerHTML = `
            <section class="projects">
                <h1>Your Projects in the Maintainer!</h1>
                ${projects.map(project => `
                    <div class="project-card">
                        <h2>${project.name}</h2>
                        <p>${project.description || 'No description available'}</p>
                        <button data-project-id="${project.id}">View Details</button>
                    </div>
                `).join('')}
            </section>
        `;

        const buttons = document.querySelectorAll('.project-card button');
        buttons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const projectId = e.target.getAttribute('data-project-id');
                await loadIssuesPage(projectId, mainContent);
            });
        });

    } catch (error) {
        console.error('Error loading projects:', error.message);
        mainContent.innerHTML = `
            <section class="error">
                <h1>Error</h1>
                <p>This project has no created issues yet!</p>
            </section>
        `;
    }
};

export const loadIssuesPage = async (projectId, mainContent) => {
    try {
        const response = await fetch(`/projects/${projectId}/issues`);
        const data = await response.json();
        const issues = data.issues;

        mainContent.innerHTML = `
        <section class="issues">
            <h1 class="center">Issues for Project ID: ${projectId}</h1>
            ${issues.length > 0 ? issues.map(issue => `
                <div class="issue-card ${issue.state}"> 
                    <h3>${issue.title}</h3>
                    <p>Status: ${issue.state}</p> 
                    <p><strong>Created At:</strong> ${new Date(issue.created_at).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> ${new Date(issue.updated_at).toLocaleString()}</p>
                    <p><strong>Author:</strong> ${issue.author ? issue.author.name : 'Unknown'}</p>
                    <p><strong>Assignees:</strong> ${issue.assignees && issue.assignees.length > 0 ? issue.assignees.map(a => a.name).join(', ') : 'None'}</p>
                    <p><strong>Labels:</strong> ${issue.labels && issue.labels.length > 0 ? issue.labels.join(', ') : 'None'}</p>
                    <p><strong>Description:</strong> ${issue.description || 'No description available'}</p>
                </div>
            `).join('') : '<p>No issues found for this project.</p>'}
        </section>
    `;

    } catch (error) {
        console.error('Error loading issues:', error.message);
        mainContent.innerHTML = `
        <section class="error">
            <h1>Error</h1>
            <p>This project has no created issues yet!</p>
        </section>
    `;
    }
};
