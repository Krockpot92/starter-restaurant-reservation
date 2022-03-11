const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
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

function tableExists(req, res, next) {
  if (isNaN(parseFloat(req.params.table_id)) || !req.params) {
    return next({ status: 404, message: `Invalid Id` });
  }

  service
    .read(req.params.table_id)
    .then((table) => {
      if (table) {
        res.locals.table = table;
        return next();
      }
      next({ status: 404, message: `99999` });
    })
    .catch(next);
}

function nameCheck(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName].length > 1) {
      return next();
    }
    next({ status: 400, message: `table_name` });
  };
}

function capacityCheck(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (typeof data[propertyName] == "number") {
      return next();
    }
    next({ status: 400, message: `${propertyName} must be a number` });
  };
}

function read(req, res, next) {
  res.json({ data: res.locals.table });
}

function reservationRead(req, res, next) {
  if (!req.body.data.reservation_id) {
    return next({ status: 400, message: `reservation_id` });
  }
  service
    .getPeople(req.body.data.reservation_id)
    .then((reservation) => {
      if (reservation) {
        res.locals.reservation = reservation;
        return next();
      }
      next({ status: 404, message: `999` });
    })
    .catch(next);
}

async function update(req, res, next) {
  const tableId = req.params.table_id;
  const newData = req.body.data;
  const peopleData = res.locals.reservation.people;
  const capacity = res.locals.table.capacity;

  const newStatus = {status: "seated"}
  const oldData = res.locals.reservation.reservation_id

  if(res.locals.reservation.status === "seated" || res.locals.reservation.status==="finshed" ){
    return next({status:400, message: "already seated"})
  }

  if (res.locals.table.reservation_id != null) {
    return next({ status: 400, message: "occupied" });
  }

  if (!newData.reservation_id || typeof newData.reservation_id != "number") {
    return next({ status: 400, message: "reservation_id" });
  }

  if (capacity < peopleData) {
    return next({ status: 400, message: "capacity" });
  }

  const statusData = await service.statusUpdate(newStatus ,Number(oldData))
  const data = await service.update(newData, Number(tableId));

  return res.status(200).json({ data: data }), res.status(200).json({ data: statusData })
}

async function destroy(req, res,next ) {
  const tableId = req.params.table_id;
  const newData = { reservation_id: null }
  const oldData = res.locals.table.reservation_id

  const newStatus = {status: "finished"}
  
  if(oldData === null){
    return next({ status: 400, message: "not occupied" });
  }

  const statusData = await service.statusUpdate(newStatus ,Number(oldData))
  const data = await service.update(newData, Number(tableId));

  return res.status(200).json({ data: data }),res.status(200).json({ data: statusData })
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyDataHas("table_name"),
    nameCheck("table_name"),
    bodyDataHas("capacity"),
    capacityCheck("capacity"),
    asyncErrorBoundary(create),
  ],
  read: [
    tableExists,
    bodyDataHas("table_name"),
    bodyDataHas("capacity"),
    asyncErrorBoundary(read),
  ],
  update: [
    tableExists,
    bodyDataHas("reservation_id"),
    asyncErrorBoundary(reservationRead),
    asyncErrorBoundary(update),
  ],
  delete: [
    tableExists,
    asyncErrorBoundary(destroy)
  ]
};
