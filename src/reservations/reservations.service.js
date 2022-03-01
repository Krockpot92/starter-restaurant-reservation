const knex = require("../db/connection");

const tableName = "reservations";

function list(){
    return knex(tableName)
    .select("*")
}

function create(newReservation){
    return knex(tableName)
    .insert(newReservation)
    .returning("*")
    .then((createdRecords)=> createdRecords[0])
}

module.exports={
    list,
    create,
}