const sql = require("./db.js");
const crypto = require('crypto');
const funcs = require("../util/datetime.functions.js");

// constructor
const User = function(user) {
  this.user_name = user.user_name;
  this.user_psw = user.user_psw;
  this.user_email = user.user_email;
  this.user_avatar = user.user_avatar;
  this.user_created = funcs.getTimestamp();
  this.user_updated = funcs.getTimestamp();
};

User.create = (newUser, result) => {

  let salt = crypto.randomBytes(16).toString('base64');
  let hash = crypto.createHmac('sha512',salt)
                                  .update(newUser.user_psw)
                                  .digest("base64");
  newUser.user_psw = salt + "$" + hash;

  // Does a user with this email address already exist?
  User.findByEmail(newUser.userEmail, res);
  if (res.length) {
    
    result(null, "Email address already in use");
    return;
  }

  // Does a user with this User Name already exist?
  User.findByUserName(newUser.userName, res);
  if (res.length) {
    
    result(null, "UserName address already in use");
    return;
  }

  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

User.ComnparePasswords = (pswHash, pswAttempt, result) => {
  
    let passwordFields = pswHash.split('$');
    let salt = passwordFields[0];
    let hash = crypto.createHmac('sha512', salt).update(pswAttempt).digest("base64");
    
    return (hash === passwordFields[1]);    
}

User.findById = (userId, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${userId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

User.findByUserName = (userName, result) => {
  sql.query(`SELECT * FROM users WHERE user_name = '${userName}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

User.findByEmail = (userEmail, result) => {
  sql.query(`SELECT * FROM users WHERE user_email = '${userEmail}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAll = result => {
  sql.query("SELECT * FROM users ORDER BY user_created DESC", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.updateById = (id, user, result) => {
  user.user_updated = funcs.getTimestamp();
  sql.query(
    "UPDATE users SET user_name = ?, user_email = ?, user_avatar = ?, user_updated = ? WHERE id = ?",
    [user.user_name, user.user_email, user.user_avatar, user.user_updated, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

User.removeAll = result => {
  sql.query("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} user`);
    result(null, res);
  });
};

module.exports = User;