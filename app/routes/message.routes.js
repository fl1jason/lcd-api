module.exports = app => {
  const messages = require("../controllers/message.controller.js");

  /**
  * Message Specific Routes 
  */
  // Create a new Message
  app.post("/messages", messages.create);

  // Retrieve all Messages
  app.get("/messages", messages.findAll);

  // Retrieve a single Message with messageId
  app.get("/messages/:messageId", messages.findOne);

    // Retrieve a single Message with messageId
  app.get("/messages/latest/:userId", messages.findLatest);

  // Retrieve Messages sent to the specified user
  app.get("/messages/to/:userId", messages.findToUser);

  // Retrieve Messages sent from the specified user
  app.get("/messages/from/:userId", messages.findFromUser);

  // Update a Message with messageId
  app.put("/messages/:messageId", messages.update);

  // Delete a Message with messageId
  app.delete("/messages/:messageId", messages.delete);

  // Create a new Message
  app.delete("/messages", messages.deleteAll);

};
