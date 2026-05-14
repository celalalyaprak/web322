/********************************************************************************
*  WEB322 – Assignment 04
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
*  Name: Celal Alyaprak    Student ID: 177177235     Date: 2025-07-02
*
*  Published URL: https://celalassignment4.vercel.app
********************************************************************************/

const express = require('express');
const app = express();
const path = require('path');
const projects = require('./data/projects.json'); 

// View engine setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('home', { page: '/' });
});

app.get('/about', (req, res) => {
  res.render('about', { page: '/about' });
});

// Projects list (with optional filtering)
app.get('/solutions/projects', (req, res) => {
  const sector = req.query.sector;
  let filtered = projects;

  if (sector) {
    filtered = projects.filter(p => p.sector.toLowerCase() === sector.toLowerCase());
  }

  if (filtered.length > 0) {
    res.render('projects', { projects: filtered, page: '/solutions/projects' });
  } else {
    res.status(404).render('404', { message: `No projects found for sector: ${sector}` });
  }
});

// Single project
app.get('/solutions/projects', (req, res) => {
  const sector = req.query.sector;
  let filtered = projects;

  if (sector) {
    filtered = projects.filter(p => p.sector.toLowerCase() === sector.toLowerCase());
  }

  if (filtered.length > 0) {
    res.render('projects', { projects: filtered, page: '/solutions/projects' });
  } else {
    res.status(404).render('404', { message: `No projects found for sector: ${sector}` });
  }
});


// 404 fallback
app.use((req, res) => {
  res.status(404).render('404', { message: "Page not found" });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
