const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const bodyParser = require('body-parser');

const app = express();

//To have access to the port
dotenv.config({ path: './config/config.env' });

// Body Parser
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

//Import auth routes
const authRoutes = require('./routes/auth.js');

//connect MongoDb
connectDB();

//to have access to json data
app.use(express.json());

// set up routes
app.use('/api/user', authRoutes);

// create port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
