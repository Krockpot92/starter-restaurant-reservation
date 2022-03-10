const { select } = require("../db/connection");
const knex = require("../db/connection");

const tableName = "reservations";

function list(){
    return knex(tableName)
    .select("first_name")
}

function isQuery(date){
    return knex(tableName)
    .select("*")
    .where({reservation_date : date})
    .orderBy("reservation_time")
}

function read(reservation_id) {
    return knex(tableName)
    .select("*")
    .where({reservation_id})
    .first();
  }

function create(newReservation){
    return knex(tableName)
    .insert(newReservation)
    .returning("*")
    .then((createdRecords)=> createdRecords[0])
}

function destroy(reservationId) {
    return knex(tableName).where({ reservation_id: reservationId }).del();
  }
  
  function statusUpdate(updatedId,reservation_id){
    return knex(tableName)
    .where({reservation_id})
    .update(updatedId)
    .returning("*")
    .then((data)=> data[0])
}

module.exports={
    list,
    create,
    destroy,
    read,
    isQuery,
    statusUpdate,
}