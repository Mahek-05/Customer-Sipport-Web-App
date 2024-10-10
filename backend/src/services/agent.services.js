const model = require('../models/agent.model');
const dal = require('../../lib/dal/dal');

// MONGODB SERVICES -----------------------------------------------------------
exports.findOne = async ({
  filter, projection = {}, populate = null, sort = {}, session = null,
}) => dal.findOne(model, {
  filter, projection, populate, sort, session,
});

exports.findById = async ({ id, session = null }) => dal.findById(model, { id, session });

exports.create = async ({ body, session = null }) => dal.create(model, { body, session });

exports.find = async (
    filter = {},
    pagination = {},
    sort = {},
    projection = {},
    populate = null,
    session = null
) => await dal.find(model, filter, pagination, sort, projection, populate, session);

exports.findByIdAndUpdate = async ({ id, body, session = null }) => (
  dal.findByIdAndUpdate(model, { id, body, session })
);

exports.findOneAndUpdate = async ({ filter, body, session = null }) => (
  dal.findOneAndUpdate(model, { filter, body, session })
);
exports.findOneAndUpsert = async ({filter, body, session = null}) =>
    await dal.findOneAndUpsert(model,{ filter, body, session});
