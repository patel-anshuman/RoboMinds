const mongoose = require('mongoose');
require('dotenv').config();

const Connection = async () => {
    await mongoose.connect(process.env.MONGO_CONNECTION_URL);
    console.log(`Server Started at PORT ${process.env.port}`);
}

module.exports = Connection;