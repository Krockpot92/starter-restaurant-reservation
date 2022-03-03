/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const isQuery = req.query.date;
  console.log("Test", req.query.date, isQuery, req.params);
  if (isQuery) {
    console.log("we in");
    service.isQuery(isQuery).then((data) => res.send({ data }));
  }

  // const data = await service.list();
  // res.json({ data });
}

function reservationExists(req, res, next) {
  service
    .read(req.params.reservationId)
    .then((reservation) => {
      if (reservation) {
        res.locals.reservation = reservation;
        return next();
      }
      next({ status: 404, message: `Reservation cannot be found.` });
    })
    .catch(next);
}

function peopleCheck(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (typeof data[propertyName] == "number") {
      return next();
    }
    next({ status: 400, message: `${propertyName} must be a number` });
  };
}

function dateCheck(propertyName){
  return function (req, res, next) {
    console.log
    const { data = {} } = req.body;
    let result= data[propertyName]
    if(Date.parse(result)){
      return next()
    }
    next({ status: 400, message: `${propertyName} must be a date` });
  }
}

function timeCheck(propertyName){
  return function (req, res, next) {
    const { data = {} } = req.body;
    let time= data[propertyName]
    if(parseFloat(time) < 24 && parseFloat(time) > 0){
      return next()
    }
    next({ status: 400, message: `${propertyName} is not a valid time` });
  }
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function destroy(req, res) {
  const { reservation } = res.locals;
  await service.destroy(reservation.reservation_id);
  res.sendStatus(204);
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_time"),
    timeCheck("reservation_time"),
    bodyDataHas("reservation_date"),
    dateCheck("reservation_date"),
    bodyDataHas("people"),
    peopleCheck("people"),
    asyncErrorBoundary(create),
  ],
  delete: [reservationExists, asyncErrorBoundary(destroy)],
};
