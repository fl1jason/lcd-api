/* 
module.exports = {
    HOST: '127.0.0.1',
    USER: 'root',
    PASSWORD: 'root',
    DB: 'lcd',
    PORT: "8889",
    SECRET: "bottom"
  };
*/

  module.exports = {
    HOST: process.env.DB_SERV,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASS,
    DB: process.env.DB_NAME,
    PORT: "3306",
    SECRET: "bottom"
  };