const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
  /*,socketPath: dbConfig.PORT*/
});

// open the MySQL connection
connection.connect(error => {
  if (error) { 
    console.log(`Failed to connect to the database ${error}`);
    console.log(`host: ${dbConfig.HOST}`);
    console.log(`user: ${dbConfig.USER}`);
    console.log(`password: ${dbConfig.PASSWORD}`);
    console.log(`database: ${dbConfig.DB}`);
  } else {
    console.log("Successfully connected to the database.");
  }
});

module.exports = connection;