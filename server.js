const express     = require("express");
const bodyParser  = require("body-parser");
const querystring = require('querystring');
const cors        = require("cors");
const app         = express();
const PORT = process.env.PORT || 5000

//app.use(cors());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse requests of content-type: application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
  //res.header('Access-Control-Allow-Origin', '*');
  
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  next();
});
/*
app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})*/


// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to LCD Message Server API.", version: "1.0" });
});

require("./app/routes/message.routes.js")(app);
require("./app/routes/user.routes.js")(app);
