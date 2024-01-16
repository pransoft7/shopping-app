const express = require('express');
const app = express();
const csrf = require('csurf');
const expressSession = require('express-session');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth.routes'); 
const productRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes')

const db = require('./data/database'); // Import database connection

// Middlewares
const addCsrfToken = require('./middlewares/csrf-token');
const errorHandler = require('./middlewares/error-handler');
const checkAuthStatus = require('./middlewares/check-auth');
const protectRoutes = require('./middlewares/protect-routes');
const initialiseCart = require('./middlewares/cart');
const updateCartPrices = require('./middlewares/update-cart-prices')
const notFoundHandler = require('./middlewares/not-found')

// Configurations
const createSessionConfig = require('./config/session');

// Set up view engine
app.set('view engine', 'ejs');
// Set up views folder
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public')); // Set up parent folder for static page styles
app.use('/products/assets', express.static('productData')) // Serve product-data to frontend

// Set up req.body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up session
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

// Set up CSRF protection
app.use(csrf());
app.use(addCsrfToken); // Middleware to add CSRF token to res.locals

app.use(initialiseCart);
app.use(updateCartPrices);

app.use(checkAuthStatus); // Middleware to check auth status

// Use routes
app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', protectRoutes, ordersRoutes) // Added protection for admin routes
app.use('/admin', protectRoutes, adminRoutes);

app.use(notFoundHandler); // Handler for non-existent pages

// Error handling
app.use(errorHandler); // Note to add it after the routes

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