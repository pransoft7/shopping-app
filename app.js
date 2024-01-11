const express = require('express');
const app = express();
const csrf = require('csurf');
const expressSession = require('express-session');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth.routes'); 
const productRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');

const db = require('./data/database'); // Import database connection

// Middlewares
const addCsrfToken = require('./middlewares/csrf-token');
const errorHandler = require('./middlewares/error-handler');
const checkAuthStatus = require('./middlewares/check-auth');

// Configurations
const createSessionConfig = require('./config/session');

db.conntoDB()
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  })
})
.catch((err) => {
  console.log('Error connecting to MongoDB', err);
});

// Set up view engine
app.set('view engine', 'ejs');
// Set up views folder
app.set('views', path.join(__dirname, 'views'));

// Set up parent folder for static page styles
app.use(express.static('public'));

// Set up req.body parser
app.use(express.urlencoded({ extended: false }));

// Set up session
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

// Set up CSRF protection
app.use(csrf());
app.use(addCsrfToken); // Middleware to add CSRF token to res.locals
app.use(checkAuthStatus); // Middleware to check auth status

// Error handling
app.use(errorHandler);

// Use routes
app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
})