import express from 'express';
import fetch from 'node-fetch';
import authenticateHelper from './authentication.mjs';
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const router = express.Router();
import Socket from './socket.mjs'

// Socket.init();
const __dirname = dirname(fileURLToPath(import.meta.url))

router.get('/', (req, res) => {
    // res.send('Production server with Real-Time Web');
    res.sendFile('/index.html', { root: __dirname + '/../frontend' })

});

router.get('/home', (req, res) => {
    res.redirect('/')
})


// check coming webhooks.
router.post('/webhook', authenticateHelper, async (req, res) => {
    res.status(200).send('OK')
    // console.log(req.body)  
    // console.log(req.headers)

    if (Object.keys(req.body).length > 0) {
        Socket.notify('UpdateMessage', req.body);
    } else {
        // check error 
        console.log('Webhook body is empty or undefined');
    }

    //notify the received message.
    Socket.notify('message', req.body)
})


//route to fetch all projects
router.get('/projects', async (req, res) => {
    try {
        const response = await fetch(`https://gitlab.lnu.se/api/v4/projects?access_token=${process.env.GITLAB_API_TOKEN}`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error fetching the projects: ${response.statusText}. Response body: ${errorBody}`);
        }

        const projectData = await response.json();

        //the number of projects
        const numberOfProjects = projectData.length;
        // the names of the projects
        const projectNames = projectData.map(project => project.name);
        // send the project data, number and names to url in res 
        res.json({
            numberOfProjects: projectData.length,
            projectNames: projectData.map(project => project.name),
            projects: projectData
        });
    } catch (error) {
        console.error('Error fetching the projects:', error.message);
        res.status(500).json({ error: 'Failed to fetch the projects' });
    }
});

// fetch the project by ID
router.get('/projects/:projectId', async (req, res) => {
    const projectId = req.params.projectId;

    try {
        const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectId}?access_token=${process.env.GITLAB_API_TOKEN}`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error fetching the project: ${response.statusText}. Response body: ${errorBody}`);
        }

        const projectData = await response.json();
        res.json(projectData);
    } catch (error) {
        console.error('Error fetching the project:', error.message);
        res.status(500).json({ error: 'Failed to fetch the project' });
    }
});

// fetch all projects in the maintainer
router.get('/maintainer', async (req, res) => {
    const groupId = process.env.GITLAB_PROJECT_ID;
    const apiToken = process.env.GITLAB_API_TOKEN;

    try {
        if (!groupId) {
            throw new Error('Group ID is missing');
        }

        if (!apiToken) {
            throw new Error('API Token is missing');
        }

        console.log(`Fetching all projects for group ID: ${groupId}`);

        // fetch all projects in the maintainer
        const response = await fetch(`https://gitlab.lnu.se/api/v4/groups/${groupId}/projects`, {
            headers: {
                'PRIVATE-TOKEN': apiToken,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error fetching projects: ${response.statusText}. Response body: ${errorBody}`);
        }

        const projects = await response.json();

        //respond with the list of projects (just name and ID)
        res.json({
            groupId: groupId,
            projects: projects.map(project => ({
                id: project.id,
                name: project.name
            }))
        });
    } catch (error) {
        console.error('Error fetching projects:', error.message);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// fetch issues for a specific project by project ID
router.get('/projects/:projectId/issues', async (req, res) => {
    const projectId = req.params.projectId;
    const apiToken = process.env.GITLAB_API_TOKEN;

    try {
        if (!projectId) {
            throw new Error('Project ID is missing');
        }

        if (!apiToken) {
            throw new Error('API Token is missing');
        }

        console.log(`Fetching issues for project ID: ${projectId}`);

        const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectId}/issues`, {
            headers: {
                'PRIVATE-TOKEN': apiToken,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error fetching issues: ${response.statusText}. Response body: ${errorBody}`);
        }

        const issues = await response.json();

        // res list of issues
        res.json({
            projectId: projectId,
            issues: issues
        });
    } catch (error) {
        console.error('Error fetching issues:', error.message);
        res.status(500).json({ error: 'Failed to fetch issues' });
    }
});


export default router;
