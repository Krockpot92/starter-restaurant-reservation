/**
 * List handler for reservation resources
 */
const today = require ("../utils/date-time");

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const isQuery = req.query.date;
  if (isQuery) {
    service.isQuery(isQuery).then((data) => res.send({ data }));
  }
  // const data = await service.list();
  // res.json({ data });
}

function reservationExists(req, res, next) {
  service
    .read(req.params.reservation_id)
    .then((reservation) => {
      if (reservation) {
        res.locals.reservation = reservation;
        return next();
      }
      next({ status: 404, message: `99` });
    })
    .catch(next);
}

function read(req, res, next) {
  res.json({ data: res.locals.reservation });
};

function peopleCheck(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (typeof data[propertyName] == "number") {
      return next();
    }
    next({ status: 400, message: `${propertyName} must be a number` });
  };
}

function isTuesday(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;

    let result = data[propertyName];
    let dateConversion = Date.parse(result);
    let reservationDay = new Date(dateConversion).getDay();
    
    if (reservationDay === 1) {
      return next({ status: 400, message: `closed` });
      
    }
    if(result< today.today() && !isNaN(reservationDay)){
    return next({ status: 400, message: `future` })
  }
    return next();
  }
}

function dateCheck(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    let result = data[propertyName];
    if (Date.parse(result)) {
      return next();
    }
    next({ status: 400, message: `${propertyName} must be a date` });
  };
}

function timeCheck(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    let time = data[propertyName].replace(":", ".");

    if (parseFloat(time) < 10.30 || parseFloat(time) > 21.30) {
      return next({ status: 400, message: `${propertyName} Time is not available`});
    }

    if (parseFloat(time) < 24 && parseFloat(time) > 0) {
      return next();
    }

    next({ status: 400, message: `${propertyName} is not a valid time` });
  };
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

async function create(req, res, next) {
  if (req.body.data.status === "seated"){
    return next({status: 400, message:"seated"})
  }
  if (req.body.data.status === "finished"){
    return next({status: 400, message:"finished"})
  }

  req.body.data.status= "seated"

  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function destroy(req, res) {
  const { reservation } = res.locals;
  await service.destroy(reservation.reservation_id);
  res.sendStatus(204);
}

async function statusUpdate(req, res, next) {
  const reservationId = req.params.reservation_id;
  const newData = req.body.data
  const currentStatus= res.locals.reservation.status

  if(!newData.status){
    return next({status: 400, message:"unknown"})
  }

  if(newData.status !="booked" && newData.status !="seated" && newData.status !="finished"){
    return next({status: 400, message:"unknown"})
  }

  if(currentStatus === "finished"){
    return next({status: 400, message:"finished"} )
  }
  
  const data = await service.statusUpdate(newData, Number(reservationId));
  return res.status(200).json({ data: data });
}
  
  

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_time"),
    timeCheck("reservation_time"),
    isTuesday("reservation_date"),
    bodyDataHas("reservation_date"),
    dateCheck("reservation_date"),
    bodyDataHas("people"),
    peopleCheck("people"),
    asyncErrorBoundary(create),
  ],
  read:[reservationExists, read],
  delete: [reservationExists, asyncErrorBoundary(destroy)],
  update:[reservationExists, asyncErrorBoundary(statusUpdate)],
};
