const { Server } = require("socket.io");
const { corsOptions } = require("../config/cors");

const io = (server) => {
  return new Server(server, {
    cors: corsOptions,
  });
};

module.exports = io;
