const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            projects = projectData.map(p => {
                const sector = sectorData.find(s => s.id === p.sector_id);
                return { ...p, sector: sector ? sector.sector_name : "Unknown" };
            });
            resolve();
        } catch (err) {
            reject("Unable to initialize project data");
        }
    });
}

function getAllProjects() {
    return new Promise((resolve, reject) => {
        if (projects.length > 0) resolve(projects);
        else reject("No project data available");
    });
}

function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        const proj = projects.find(p => p.id == projectId);
        proj ? resolve(proj) : reject("Project not found");
    });
}

function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        const filtered = projects.filter(p =>
            p.sector.toLowerCase().includes(sector.toLowerCase())
        );
        filtered.length > 0 ? resolve(filtered) : reject("No projects found for that sector");
    });
}

module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector };
