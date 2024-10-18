const mongoose = require('mongoose');
const { mongoUri, mongoOptions } = require('../configs/db.config');

exports.connectDB = async () => {
  console.info('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, mongoOptions);
  console.info('MongoDB connected !!');
};