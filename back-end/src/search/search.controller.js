const service = require("./search.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    const isQuery = req.query.mobile_number;
    console.log(isQuery)
  
    if (isQuery) {
      service.search(isQuery).then((data) => res.send({ data }));
    }
  }

  module.exports ={
      list: asyncErrorBoundary(list),
  }
