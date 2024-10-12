const ticketServices = require('../services/ticket.services');
const { asyncHandler } = require('../../lib/helpers/asyncHandler');
const { errorHandler, responseHandler } = require('../../lib/helpers/responseHandler');


exports.createTicket = asyncHandler(async (req, res) => {
  const { username, issueTitle } = req.value;
  const body = {
    username,
    issueTitle,
  };
  const ticket = await ticketServices.create({ body });
  return responseHandler({ ticket }, res);
});

exports.updateTicket = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { status, agentId } = req.value;
  let body = {};
  if(status === 'resolved' || status === 'assigned') {
    if(!agentId) {
      return errorHandler('ERR-103', res);
    }
    body = {...body, status, agentId: agentId};
  }
  if(status === 'unassigned') { body = { ...body, status, agentId: null }; }
  const ticket = await ticketServices.findByIdAndUpdate({ id: ticketId, body } ); 
  if(!ticket) {
    return errorHandler('ERR-101', res);
  }
  return responseHandler({ticket}, res);
});

exports.getTicket = asyncHandler(async (req, res) => {
  const { username, agentId, searchText, status } = req.value;
  
  let filter = {};
  
  if(username && username != '') {
    filter.username = username
  };
  
  if(agentId && agentId !== '') {
    filter.agentId = agentId
  };
  
  if(status && status !== '') {
    filter.status = status
  };
  
  let tickets = [];
  
  if (Object.keys(filter).length > 0) {
    tickets.push({ $match: { ...filter } });
  };
  
  tickets = [
    ...tickets,
    {
      $lookup: {
        from: 'customers',
        localField: 'username',
        foreignField: 'username',
        as: 'customerDetails'
      }
    },
    {
      $unwind: {
        path: '$customerDetails',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'agents',
        localField: 'agentId',
        foreignField: 'agentId',
        as: 'agentDetails'
      }
    },
    {
      $unwind: {
        path: '$agentDetails',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $sort: { createdAt: 1 } 
    },
  ];
  
  if(searchText && searchText.length > 0) {
    tickets.push(
      {
        $match: {
          $or: [
            { 'issueTitle': { $regex: searchText, $options: 'i' } },
            { 'customerDetails.firstName': { $regex: searchText, $options: 'i' } },
            { 'customerDetails.lastName': { $regex: searchText, $options: 'i' } },
            { 'agentDetails.firstName': { $regex: searchText, $options: 'i' } },
            { 'agentDetails.lastName': { $regex: searchText, $options: 'i' } }
          ]
        }
      }
    );
  };
  
  let totalCount =  [{ $count: 'count' }];

  const aggregationPipeline =  [	
    {
      $facet: {
        tickets: [...tickets],
        totalCount: [...totalCount],
      }
    }  
  ];

  const result = await ticketServices.aggregate({ query: aggregationPipeline });

  tickets = result[0].tickets || [];
  const totalDocuments = (result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0);

  return responseHandler({
    totalDocuments,
    tickets,
  }, res);
});