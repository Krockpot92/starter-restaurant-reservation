/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const isQuery = req.query.date
  console.log("Test", req.query.date, isQuery, req.params);
  if (isQuery ) {
    console.log("we in")
    service.isQuery(isQuery)
    .then((data) => res.send({ data }));
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
  list:  asyncErrorBoundary(list),
  create: [bodyDataHas("first_name"),bodyDataHas("last_name"), bodyDataHas("mobile_number"),bodyDataHas("reservation_time"),bodyDataHas("reservation_date"),bodyDataHas("people"),asyncErrorBoundary(create)],
  delete: [reservationExists, asyncErrorBoundary(destroy)],
};
