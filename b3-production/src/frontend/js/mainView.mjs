
import { loadHomePage, loadProjectsPage, loadMaintainerPage } from './uiPages.mjs';

document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main");
    const homeLink = document.getElementById("homeLink");
    const projectsLink = document.getElementById("projectsLink");
    const maintainerLink = document.getElementById("maintainer");

    homeLink.addEventListener("click", (e) => {
        e.preventDefault();
        loadHomePage(mainContent);
    });

    projectsLink.addEventListener("click", (e) => {
        e.preventDefault();
        loadProjectsPage(mainContent);
    });

    maintainerLink.addEventListener("click", (e) => {
        e.preventDefault();
        loadMaintainerPage(mainContent);
    });

    loadHomePage(mainContent);
});
