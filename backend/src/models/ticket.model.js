const { required } = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;


const ticketSchema = new Schema(
  {
    username: { type: String, required: true, index: true}, // ticket owner customer
    issueTitle: { type: String, required: true },
    status: { type: String, enum: ['unassigned', 'assigned', 'resolved', ], required: true, default: 'unassigned'},
    agentId: { type: String, required: false, index: true}, // assigned agent
  },
  {
    timestamps: true,
  },
);


module.exports = mongoose.model('tickets', ticketSchema);