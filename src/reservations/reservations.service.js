const { select } = require("../db/connection");
const knex = require("../db/connection");

const tableName = "reservations";

function list(){
    return knex(tableName)
    .select("first_name")
}

function isQuery(date){
    return knex(tableName)
    .select("first_name",
        "last_name",
        "mobile_number",
        "reservation_time",
        "reservation_date")
    .where({reservation_date : date})
}

function read(reservatinonId) {
    return knex(tableName).select("*").where({ reservation_id: reservatinonId }).first();
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

module.exports={
    list,
    create,
    destroy,
    read,
    isQuery
}