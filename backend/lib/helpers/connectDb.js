const mongoose = require('mongoose');
const { mongoUri, mongoOptions } = require('../configs/db.config');

async function createIndex() {
  try {

  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}
exports.connectDB = async () => {
  console.info('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, mongoOptions);
  createIndex();
  console.info('MongoDB connected !!');
};