module.exports = app => {
    const messages = require("../controllers/message.controller.js");
  
    // Create a new Message
    app.post("/messages", messages.create);

    app.post('/login',function(req,res){
      
      console.log("user name is: " + req.body.user_name); 
      
      res.end(req.body.user_name);
    });
  
    // Retrieve all Messages
    app.get("/messages", messages.findAll);
  
    // Retrieve a single Message with messageId
    app.get("/messages/:messageId", messages.findOne);

    // Retrieve a single Message with messageId
    app.get("/messages/latest/:userId", messages.findLatest);
  
    // Retrieve a single Message with messageId
    app.get("/latest/:userId", messages.findLatest);
  
    // Update a Message with messageId
    app.put("/messages/:messageId", messages.update);
  
    // Delete a Message with messageId
    app.delete("/messages/:messageId", messages.delete);
  
    // Create a new Message
    app.delete("/messages", messages.deleteAll);
  };