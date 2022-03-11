const knex = require("../db/connection");

const tableName = "tables";
const reservationsTable= "reservations"

function list(){
    return knex(tableName)
    .select("*")
    .orderBy("table_name")
}

function create(newTable){
    return knex(tableName)
    .insert(newTable)
    .returning("*")
    .then((createdRecords)=> createdRecords[0])
}

function read(table_id) {
    return knex(tableName)
    .select("*")
    .where({table_id})
    .first();
  }

function getPeople(reservation_id) {
    return knex(reservationsTable)
    .select("*")
    .where({reservation_id})
    .first();
  }

function update(updatedId,table_id){
      return knex(tableName)
      .where({table_id})
      .update(updatedId)
      .returning("*")
      .then((data)=> data[0])
}

function statusUpdate(updatedId,reservation_id){
  return knex(reservationsTable)
  .where({reservation_id})
  .update(updatedId)
  .returning("*")
  .then((data)=> data[0])
}


module.exports={
    list,
    create,
    read,
    update,
    getPeople,
    statusUpdate
}