import '/socket.io-client/socket.io.min.js';

const BASE_URL = window.location.origin;

const WebSocketManager = {
  socket: null,

  initialize: async function () {
    if (this.socket === null) {
      try {
        this.socket = io(BASE_URL);
      } catch (error) {
        console.error('Error on connecting to server', error);
      }

      this.socket.on('connect', () => {
        console.log('Connected to server with id: ' + this.socket.id);
      });
    }
    return this.socket;
  }
};

const socket = await WebSocketManager.initialize();

socket.on('connect', () => {
  sessionStorage.setItem('socketId', socket.id);
  console.log('Connected to server with id: ' + socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('UpdateMessage', (message) => {
  console.log('UpdateMessage frontend:', message);
  displayMessageLink(message);

  const pathSegments = window.location.pathname.split('/').filter(segment => segment !== '');

  console.log('Path Segments:', pathSegments);

  if (pathSegments[0] === 'projects') {
    handleProjectUpdates(message);
  } else if (pathSegments[0] === 'project') {
    if (pathSegments[1] === message.project.id.toString() && message.object_kind === 'issue') {
      setTimeout(() => {
        window.location.reload();
      }, 15000);
    }
  }
});

const displayMessageLink = (message) => {
  const messageLinkElm = document.getElementById('messageLink');
  const lastUpdated = new Date(message.object_attributes.updated_at).toLocaleString();
  const authorName = message.user ? message.user.name : 'Unknown';

  let messageText = '';

  switch (message.object_kind) {
    case 'issue':
      messageText = `
        <h3> New Update in the maintainer group:</h3>

        <p>In the project named: <strong>${message.project.name}</strong></p>
        <p>Issue title: <strong>${message.object_attributes.title}</strong></p>
        <p>Updated by: <strong>${authorName}</strong></p>
        <p>Last activity: <strong>${lastUpdated}</strong></p>
      `;
      break;
    case 'push':
      messageText = `
        <p>New project created with name: <strong>${message.project.name}</strong></p>
      `;
      break;
    case 'note':
      messageText = `
        <p>New comment in project: <strong>${message.project.name}</strong></p>
        <p>Issue title: <strong>${message.issue.title}</strong></p>
        <p>Comment by: <strong>${authorName}</strong></p>
      `;
      break;
    default:
      messageText = '<p>Unknown update type</p>';
  }

  messageLinkElm.innerHTML = messageText;
  messageLinkElm.style.display = 'flex';

  setTimeout(() => {
    messageLinkElm.style.display = 'none';
  }, 15000);
};

const handleProjectUpdates = (message) => {
  if (message.object_kind === 'issue') {
    const projectCard = document.getElementById(message.project.id);
    if (projectCard) {
      const updateElement = projectCard.querySelector('.update-info');
      const dateLastActivity = new Date(message.object_attributes.updated_at);
      const authorName = message.user ? message.user.name : 'Unknown';
      const assignees = message.assignees && message.assignees.length > 0
        ? message.assignees.map(assignee => assignee.name).join(', ')
        : 'None';

      updateElement.innerHTML = `
        <p><strong>Last activity:</strong> ${dateLastActivity.toDateString()} ${dateLastActivity.toLocaleTimeString()}</p>
        <p><strong>Updated by:</strong> ${authorName}</p>
        <p><strong>Assignees:</strong> ${assignees}</p>
      `;
    }
  } else if (message.object_kind === 'push') {
    const projectsContainer = document.getElementById('projectsContainer');
    if (projectsContainer) {
      projectsContainer.innerHTML += createProjectCard(message.project);
    }
  }
};



const createProjectCard = (project) => {
  return `
    <div id="${project.id}" class="project-card">
      <h2>${project.name}</h2>
      <p>${project.description || 'No description available'}</p>
      <button>View Details</button>
    </div>
  `;
};

socket.on('register', (data) => {
  console.log('Register event received:', data);
});

export default socket;
