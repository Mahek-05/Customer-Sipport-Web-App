const { mongoUri, mongoOptions } = require("./socket.config");

module.exports = {
  mongoUri: process.env.MONGO_URI,
  mongoOptions: {},
};