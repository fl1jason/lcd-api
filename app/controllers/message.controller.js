const jwt = require('jsonwebtoken');
const config = require("../config/db.config.js");
const Message = require("../models/messages.model.js");

// Create and Save a new Message
exports.create = (req, res) => {

  var token = req.headers['x-access-token']
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.SECRET, function(err, decoded) 
  {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    // Validate request
    if (!req.body) 
    {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    // Create a Message
    const message = new Message({
      user_name: req.body.user_name,
      message_text: req.body.message_text,
      message_from: req.body.message_from,
      message_to: req.body.message_to
    });

    // Save Message in the database
    Message.create(message, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Message."
        });
      else res.send(data);
    });
  });
};

// Find a single Message with a Message ID
exports.findOne = (req, res) => {

  var token = req.headers['x-access-token']
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.SECRET, function(err, decoded) 
  {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
    Message.findById(req.params.messageId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No Message found with id ${req.params.messageId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Message with id " + req.params.messageId
          });
        }
      } else res.send(data);
    });
  });
};

// Find a single Message with a Message ID
exports.findLatest = (req, res) => {

  Message.findLatestByUserId(req.params.userId, (err, data) => {
  if (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `No Message found for user id ${req.params.userId}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Message for user id " + req.params.userId
      });
    }
  } 
  else res.send(data);
  });
};

// Retrieve all Message from the database.
exports.findAll = (req, res) => {

  var token = req.headers['x-access-token']
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.SECRET, function(err, decoded) 
  {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    Message.getAll(req.query, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving messages."
        });
      else res.send(data);
    });
  });
};

// Find Messages Sent to a User
exports.findToUser = (req, res) => {

  var token = req.headers['x-access-token']
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.SECRET, function(err, decoded) 
  {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
    Message.findToUser(req.params.userId, req.query, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No Messages found for user id ${req.params.userId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Messages for user id " + req.params.userId
          });
        }
      } else res.send(data);
    });
  });
};

// Find Messages Sent to a User
exports.findFromUser = (req, res) => {

  var token = req.headers['x-access-token']
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.SECRET, function(err, decoded) 
  {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
    Message.findFromUser(req.params.userId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No Messages found from user id ${req.params.userId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Messages from user id " + req.params.userId
          });
        }
      } else res.send(data);
    });
  });
};

// Update a Message identified by the messageId in the request
exports.update = (req, res) => {

  var token = req.headers['x-access-token']
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.SECRET, function(err, decoded) 
  {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    Message.updateById(
      req.params.messageId,
      new Message(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `No Message found with id ${req.params.messageId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Message with id " + req.params.messageId
            });
          }
        } else res.send(data);
      }
    );
  });
};

// Delete a Message with the specified MessageId in the request
exports.delete = (req, res) => {
  var token = req.headers['x-access-token']
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.SECRET, function(err, decoded) 
  {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
    Message.remove(req.params.messageId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No Message found with id ${req.params.messageId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Message with id " + req.params.messageId
          });
        }
      } else res.send({ message: `Message was deleted successfully!` });
    });
  });
};

// Delete all Messages from the database.
exports.deleteAll = (req, res) => {
  var token = req.headers['x-access-token']
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.SECRET, function(err, decoded) 
  {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
    Message.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "An error occurred while removing all Messages."
        });
      else res.send({ message: `All Messages were deleted successfully!` });
    });
  });
};