/********************************************************************************
*  WEB322 – Assignment 06
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
*  Name: Celal Alyaprak    Student ID: 177177235     Date: 2025-08-05
*
*  Published URL: https://celalassignment6.vercel.app
********************************************************************************/

const clientSessions = require('client-sessions');
const authData = require('./modules/auth-service');
const express = require('express');
const path = require('path');
const app = express();
const projectService = require('./modules/projects');

const PORT = process.env.PORT || 8080;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Client Sessions Middleware
app.use(clientSessions({
    cookieName: "session",
    secret: "web322_secret_key",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));

// Make session available to all views
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// ensureLogin Middleware
function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        next();
    }
}

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
app.get('/', (req, res) => {
    projectService.getAllProjects()
        .then((projects) => {
            res.render('home', { projects, page: '/' });
        })
        .catch(err => {
            res.status(500).render('500', { message: err });
        });
});


app.get('/solutions/addProject', ensureLogin, (req, res) => {
    projectService.getAllSectors()
        .then(sectors => {
            res.render('addProject', { sectors, page: '/solutions/addProject' });
        })
        .catch(err => {
            res.status(500).render('500', { message: `Error loading sectors: ${err}` });
        });
});

app.post('/solutions/addProject', ensureLogin, (req, res) => {
    projectService.addProject(req.body)
        .then(() => res.redirect('/solutions/projects'))
        .catch(err => {
            res.status(500).render('500', { message: `Error adding project: ${err}` });
        });
});

app.get('/solutions/editProject/:id', ensureLogin, (req, res) => {
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

app.post('/solutions/editProject', ensureLogin, (req, res) => {
    projectService.editProject(req.body.id, req.body)
        .then(() => res.redirect('/solutions/projects'))
        .catch(err => {
            res.status(500).render('500', { message: `Error updating project: ${err}` });
        });
});


app.get('/solutions/deleteProject/:id', ensureLogin, (req, res) => {
    projectService.deleteProject(req.params.id)
        .then(() => res.redirect('/solutions/projects'))
        .catch(err => {
            res.status(500).render('500', { message: `Error deleting project: ${err}` });
        });
});

// Authentication Routes
app.get('/login', (req, res) => {
    res.render('login', { page: '/login', errorMessage: "", userName: "" });
});

app.get('/register', (req, res) => {
    res.render('register', { page: '/register', errorMessage: "", successMessage: "", userName: "" });
});

app.post('/register', (req, res) => {
    authData.registerUser(req.body)
        .then(() => {
            res.render('register', { page: '/register', successMessage: "User created", errorMessage: "", userName: "" });
        })
        .catch(err => {
            res.render('register', { page: '/register', errorMessage: err, successMessage: "", userName: req.body.userName });
        });
});


app.post('/login', (req, res) => {
    req.body.userAgent = req.get('User-Agent');

    authData.checkUser(req.body)
        .then(user => {
            req.session.user = {
                userName: user.userName,
                email: user.email,
                loginHistory: user.loginHistory
            };
            res.redirect('/solutions/projects');
        })
        .catch(err => {
            res.render('login', { page: '/login', errorMessage: err, userName: req.body.userName });
        });
});


app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
});

app.get('/userHistory', ensureLogin, (req, res) => {
    res.render('userHistory', { page: '/userHistory' });
});


// 404 Route
app.use((req, res) => {
    res.status(404).render('404', { message: "Page not found" });
});

// Initialize Services and Start Server
Promise.all([projectService.initialize(), authData.initialize()])
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log("Failed to start server:", err);
    });
