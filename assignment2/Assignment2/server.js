/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: CELAL ALYAPRAK Student ID: 177177235  Date: 2025-05-25
*
********************************************************************************/

const express = require("express");
const app = express();
const projectData = require("./modules/projects.js");
const HTTP_PORT = process.env.PORT || 8080;

projectData.initialize()
    .then(() => {
        app.get("/", (req, res) => {
            res.send("Assignment 2: Celal Alyaprak - 177177235");
        });

        app.get("/solutions/projects", (req, res) => {
            projectData.getAllProjects()
                .then(data => res.json(data))
                .catch(err => res.status(500).send(err));
        });

        app.get("/solutions/projects/id-demo", (req, res) => {
            projectData.getProjectById(9)
                .then(data => res.json(data))
                .catch(err => res.status(404).send(err));
        });

        app.get("/solutions/projects/sector-demo", (req, res) => {
            projectData.getProjectsBySector("agriculture")
                .then(data => res.json(data))
                .catch(err => res.status(404).send(err));
        });

        app.listen(HTTP_PORT, () => {
            console.log(`Server running on port ${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.log("Unable to start server:", err);
    });