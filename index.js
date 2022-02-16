const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

//To have access to the port
dotenv.config({ path: './config/config.env' });

const app = express();
//Import auth routes
const authRoutes = require('./routes/auth.js');

// set up routes
app.use('/api/user', authRoutes);

//connect MongoDb
connectDB();

// create port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
