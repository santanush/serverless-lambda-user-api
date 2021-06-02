'use strict'

const mongoose    = require('mongoose');
require("dotenv").config();
const DBOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

mongoose.Promise = global.Promise;
let isConnected;

const connectToDatabase = (MONGODB_URL_API) => {

  if (isConnected) {
    console.log('using existing database connection');
    return Promise.resolve();
  }
  
  return mongoose.connect(MONGODB_URL_API, DBOptions)
        .then(db => { 
          isConnected = db.connections[0].readyState;
        });
};
 

module.exports = connectToDatabase;