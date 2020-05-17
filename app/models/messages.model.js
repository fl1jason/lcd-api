const sql = require("./db.js");
const funcs = require("../util/datetime.functions.js");
const qryBuilder = require("./messages.model.query.params.js");

// constructor
const Message = function(message) {
  this.user_name = message.user_name;
  this.message_text = message.message_text;
  this.message_from = message.message_from;
  this.message_to = message.message_to;
  this.time_stamp = funcs.getTimestamp();
};

Message.create = (newMessage, result) => {
  sql.query("INSERT INTO messages SET ?", newMessage, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created message: ", { id: res.insertId, ...newMessage });
    result(null, { id: res.insertId, ...newMessage });
  });
};


Message.findLatestByUserId = (userId, result) => {
  sql.query(`SELECT message_text FROM messages INNER JOIN users ON messages.message_to = users.ID WHERE users.user_name='${userId}' ORDER BY messages.id DESC LIMIT 1`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found message: ", res[0].message_text);
      result(null, res[0].message_text);
      return;
    }

    // not found Message with the id
    result({ kind: "not_found" }, null);
  });
};

Message.findFromUser = (userId, result) => {
  sql.query(`SELECT * FROM messages INNER JOIN users ON messages.message_to = users.ID WHERE messages.message_from=${userId} ORDER BY messages.time_stamp DESC`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("messages: ", res);
      result(null, res);
      return;
    }

    // not found Message with the id
    result({ kind: "not_found" }, null);
  });
};

Message.findToUser = (userId, result) => {
  sql.query(`SELECT * FROM messages INNER JOIN users ON messages.message_from = users.ID WHERE messages.message_to=${userId} ORDER BY messages.time_stamp DESC`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("messages: ", res);
      result(null, res);
      return;
    }

    // not found Message with the id
    result({ kind: "not_found" }, null);
  });
};

Message.findById = (messageId, result) => {
  sql.query(`SELECT * FROM messages WHERE id = ${messageId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found message: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Message with the id
    result({ kind: "not_found" }, null);
  });
};

Message.getAll = (params, result) => {
  
  qry = new qryBuilder(params);
  sql.query(qry.select(), (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("messages: ", res);
    result(null, res);
  });
};

Message.updateById = (id, message, result) => {
  sql.query(
    "UPDATE messages SET user_name = ?, message_text = ?, time_stamp = ? WHERE id = ?",
    [message.user_name, message.message_text, message.time_stamp, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Message with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated message: ", { id: id, ...message });
      result(null, { id: id, ...message });
    }
  );
};

Message.remove = (id, result) => {
  sql.query("DELETE FROM messages WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Message with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted message with id: ", id);
    result(null, res);
  });
};

Message.removeAll = result => {
  sql.query("DELETE FROM messages", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} messages`);
    result(null, res);
  });
};

module.exports = Message;