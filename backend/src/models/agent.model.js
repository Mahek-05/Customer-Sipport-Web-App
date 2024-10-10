const mongoose = require('mongoose');

const { Schema } = mongoose;


const agentSchema = new Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true, unique: true, required: true, index: true },
    agentId: { type: String, trim: true, unique: true, required: true, index: true },
  },
  {
    timestamps: true,
  },
);


module.exports = mongoose.model('agents', agentSchema);
