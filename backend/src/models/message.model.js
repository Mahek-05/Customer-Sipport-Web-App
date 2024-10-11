const mongoose = require('mongoose');

const { Schema } = mongoose;


const messageSchema = new Schema(
  {
    sender: { type: String, enum: ['customer', 'agent'], required: true, trim: true},
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'customers', index: true}, // will be null if sender is agent
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'agents', index: true}, // will be null if sender is customer
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'tickets', required: true, index: true},
    content: { type: String, required: true},
  },
  {
    timestamps: true,
  },
);


module.exports = mongoose.model('messages', messageSchema);