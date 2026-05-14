/********************************************************************************
*  WEB322 – Assignment 05
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
*  Name: Celal Alyaprak    Student ID: 177177235     Date: 2025-07-16
*
*  Published URL: https://celalassignment4.vercel.app
********************************************************************************/

const express = require('express');
const path = require('path');
const app = express();
const projectService = require('./modules/projects');

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes

app.get('/', (req, res) => {
  res.render('home', { page: '/' });
});

app.get('/about', (req, res) => {
  res.render('about', { page: '/about' });
});

app.get('/solutions/projects', (req, res) => {
  const sector = req.query.sector;
  if (sector) {
    projectService.getProjectsBySector(sector)
      .then((projects) => {
        res.render('projects', { projects, page: '/solutions/projects' });
      })
      .catch(err => {
        res.status(404).render('404', { message: err });
      });
  } else {
    projectService.getAllProjects()
      .then((projects) => {
        res.render('projects', { projects, page: '/solutions/projects' });
      })
      .catch(err => {
        res.status(500).render('500', { message: err });
      });
  }
});

app.get('/solutions/addProject', (req, res) => {
  projectService.getAllSectors()
    .then(sectors => {
      res.render('addProject', { sectors });
    })
    .catch(err => {
      res.status(500).render('500', { message: `Error loading sectors: ${err}` });
    });
});


app.post('/solutions/addProject', (req, res) => {
  projectService.addProject(req.body)
    .then(() => res.redirect('/solutions/projects'))
    .catch(err => {
      res.status(500).render('500', { message: `Error adding project: ${err}` });
    });
});

app.get('/solutions/editProject/:id', (req, res) => {
  Promise.all([
    projectService.getProjectById(req.params.id),
    projectService.getAllSectors()
  ])
  .then(([project, sectors]) => {
    res.render('editProject', { project, sectors });
  })
  .catch(err => {
    res.status(404).render('404', { message: err });
  });
});

app.post('/solutions/editProject', (req, res) => {
  projectService.editProject(req.body.id, req.body)
    .then(() => res.redirect('/solutions/projects'))
    .catch(err => {
      res.status(500).render('500', { message: `Error updating project: ${err}` });
    });
});

app.get('/solutions/deleteProject/:id', (req, res) => {
  projectService.deleteProject(req.params.id)
    .then(() => res.redirect('/solutions/projects'))
    .catch(err => {
      res.status(500).render('500', { message: `Error deleting project: ${err}` });
    });
});

app.use((req, res) => {
  res.status(404).render('404', { message: "Page not found" });
});

const PORT = process.env.PORT || 8080;
projectService.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log("Failed to start server:", err);
  });
