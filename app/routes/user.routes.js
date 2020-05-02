module.exports = app => {
  const users = require("../controllers/user.controller.js");

  /**
  * Users Specific Routes 
  */
  // Create a new User Record
  app.post("/users", users.create);

  // Authenticates a User
  app.post("/users/auth", users.auth);

  // Logs out a user and expires their session
  app.post("/users/logout", users.create);

  // Retrieve all Users
  app.get("/users", users.findAll);

  // Retrieve a single User with userId
  app.get("/users/:userId", users.findOne);

  // Retrieve a single User with userId
  app.get("/users/username/:userName", users.findByUserName);
  
  // Update a User with userId
  app.put("/users/:userId", users.update);

  // Delete a User with userId
  app.delete("/users/:userId", users.delete);

  // Deletes all users
  app.delete("/users", users.deleteAll);
};