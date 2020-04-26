const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require("../models/users.model.js");

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body) 
    {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    // Create a User
    const user = new User({
      user_name: req.body.user_name,
      user_psw: req.body.user_psw,
      user_email: req.body.user_email,
      user_avatar: req.body.user_avatar
    });

    // Save User in the database
    User.create(user, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      else res.send(data);
    });
  };

// Find a single User with a User ID
exports.findOne = (req, res) => {
    User.findById(req.params.userId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No User found with id ${req.params.userId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving User with id " + req.params.userId
          });
        }
      } else res.send(data);
    });
  };

  // Find a single User with a User ID
exports.auth = (req, res) => {
  User.findByUserName(req.body.user_name, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Invalid login details or user account does not exist for ${req.body.user_name}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User for user id " + req.body.user_name
        });
      }
    } 
    else 
    {
      // Compare the passwords
      if (User.ComnparePasswords(data.user_psw, req.body.user_psw, res))
      {
        const jwtSecret = 'bottom';
        let refreshId = req.body.user_name + jwtSecret;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
        req.body.refreshKey = salt;
        let token = jwt.sign(req.body, jwtSecret);
        let b = new Buffer(hash);
        let refresh_token = b.toString('base64');
        res.status(201).send({accessToken: token, refreshToken: refresh_token});

        //res.status(201).send({accessToken: token, refreshToken: refresh_token});
      }
      else
      {
        res.status(400).send({errors: ['Invalid user name or password']});
      }
    }
  });
};

// Find by User name
exports.findByUserName = (req, res) => {
  User.findByUserName(req.params.userName, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No User found with id ${req.params.userName}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with UserName " + req.params.userName
        });
      }
    } else res.send(data);
  });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    User.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      else res.send(data);
    });
  };

// Update a User identified by the userId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    User.updateById(
      req.params.userId,
      new User(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `No User found with id ${req.params.userId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating User with id " + req.params.userId
            });
          }
        } else res.send(data);
      }
    );
  };

// Delete a User with the specified userId in the request
exports.delete = (req, res) => {
    User.remove(req.params.userId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No User found with id ${req.params.userId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete User with id " + req.params.userId
          });
        }
      } else res.send({ message: `User was deleted successfully!` });
    });
  };

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "An error occurred while removing all Users."
        });
      else res.send({ message: `All Users were deleted successfully!` });
    });
  };