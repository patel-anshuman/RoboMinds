const express = require('express');
const cors = require("cors");
require("dotenv").config()

const app = express(); // Create an Express app

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable JSON parsing for request bodies



// Import database connection configuration
const Connection = require('./Configs/db');
app.listen(process.env.port, Connection()); // Start the server and listen on port, establishing a database connection
