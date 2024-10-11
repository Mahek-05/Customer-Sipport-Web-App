require('dotenv').config({
  path: `./.env.${process.env.NODE_ENV}`,
});
const { connectDB } = require('../lib/helpers/connectDb');
const httpServer = require('./app');
const serverConfig = require('../lib/configs/server.config');

(async () => {
  try {
    await connectDB();
    httpServer.listen(serverConfig.PORT, () => {
      console.info(`Api Server is running at port : ${serverConfig.PORT}`);
    });
  } catch (err) {
    console.error('Connection failed!', err.message);
  }
})();
