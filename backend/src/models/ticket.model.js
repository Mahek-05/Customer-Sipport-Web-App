const { required } = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;


const ticketSchema = new Schema(
  {
    customerUsername: { type: mongoose.Schema.Types.ObjectId, ref: 'customers', required: true, index: true},
    issueTitle: { type: String, required: true },
    status: { type: String, enum: ['unassigned', 'assigned', 'resolved', ], required: true, default: 'unassigned'},
    agentId: { type: String, required: false, index: true},
  },
  {
    timestamps: true,
  },
);


module.exports = mongoose.model('tickets', ticketSchema);