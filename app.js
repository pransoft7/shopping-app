const express = require('express');
const app = express();

const path = require('path');

const authRoutes = require('./routes/auth.routes');

const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
client.connect((err) => {
  if(err) throw err;
  console.log('Database connection established')
});


app.listen(3000, () => {
  console.log('Server listening on port 3000');
})

// Set up view engine
app.set('view engine', 'ejs');
// Set up views folder
app.set('views', path.join(__dirname, 'views'));

// Set up parent folder for static page styles
app.use(express.static('public'));

// Import routes
app.use(authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
})